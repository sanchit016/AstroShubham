import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { razorpay } from "@/lib/razorpay";
import { paypal } from "@/lib/paypal";
import { mockDb } from "@/lib/mockDb";
import { googleCalendar } from "@/lib/googleCalendar";
import { getPackage, getPrice, getAmountInSubunits, isSupportedCurrency, type CurrencyCode } from "@/lib/pricing";

type CheckoutOrderResult =
  | { ok: true; provider: "razorpay"; orderId: string; razorpayKeyId: string }
  | { ok: true; provider: "paypal"; orderId: string; paypalClientId: string }
  | { ok: false; status: number; error: string };

// INR settles via Razorpay (this account's domestic processor). USD/CAD route through PayPal
// since Razorpay rejected international payments for this account.
async function createCheckoutOrder(
  currency: CurrencyCode,
  price: number,
  amountInSubunits: number,
  referenceId: string
): Promise<CheckoutOrderResult> {
  if (currency === "INR") {
    let orderId: string;
    try {
      const razorpayOrder = await razorpay.orders.create({
        amount: amountInSubunits,
        currency,
        receipt: referenceId,
      });
      orderId = razorpayOrder.id;
    } catch (razorpayErr: any) {
      console.error("Razorpay Order Creation Error (using mock ID instead):", razorpayErr);
      orderId = `order_mock_${Date.now()}`;
    }
    return { ok: true, provider: "razorpay", orderId, razorpayKeyId: process.env.RAZORPAY_KEY_ID || "MOCK_KEY_ID" };
  }

  if (!paypal.isConfigured()) {
    return {
      ok: false,
      status: 503,
      error: "PayPal checkout is not configured yet. Please try the INR plan or contact support.",
    };
  }

  try {
    const paypalOrder = await paypal.createOrder(price, currency, referenceId);
    return { ok: true, provider: "paypal", orderId: paypalOrder.id, paypalClientId: paypal.clientId };
  } catch (paypalErr: any) {
    console.error("PayPal Order Creation Error:", paypalErr);
    return { ok: false, status: 502, error: "Failed to initiate PayPal checkout. Please try again shortly." };
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      packageId,
      timeSlotId,
      currency, // "USD", "INR", or "CAD"
      name,
      email,
      phone,
      birthDate, // String "YYYY-MM-DD"
      birthTime, // String "HH:MM"
      birthPlace,
      gender,
      notes,
    } = body;

    // 1. Validate mandatory fields
    if (!packageId || !timeSlotId || !currency || !name || !email || !birthDate || !birthTime || !birthPlace) {
      return NextResponse.json(
        { success: false, error: "Missing required details." },
        { status: 400 }
      );
    }

    if (!isSupportedCurrency(currency)) {
      return NextResponse.json(
        { success: false, error: "Unsupported currency." },
        { status: 400 }
      );
    }

    const selectedPackage = getPackage(packageId);

    // Attempt DB operations
    try {
      let isGcal = false;

      // Check Google Calendar if configured and sync the slot details to local DB
      if (googleCalendar.isConfigured()) {
        try {
          console.log(`Verifying slot availability on Google Calendar for package: ${packageId}...`);
          const slots = await googleCalendar.getAvailableSlots(packageId);
          const targetSlot = slots.find((s) => s.id === timeSlotId);
          if (targetSlot) {
            isGcal = true;
            // Sync/Lock slot in local database
            await db.timeSlot.upsert({
              where: { id: timeSlotId },
              create: {
                id: timeSlotId,
                startTime: new Date(targetSlot.startTime),
                endTime: new Date(targetSlot.endTime),
                isBooked: true,
              },
              update: {
                isBooked: true,
              },
            });
            console.log(`Synced GCal slot ${timeSlotId} into local database as booked/locked.`);
          }
        } catch (gcalErr) {
          console.error("Failed to verify slot on Google Calendar:", gcalErr);
        }
      }

      if (!isGcal) {
        // Fetch and validate standard database slot
        const timeSlot = await db.timeSlot.findUnique({
          where: { id: timeSlotId },
        });

        if (!timeSlot) {
          return NextResponse.json(
            { success: false, error: "Time slot not found." },
            { status: 404 }
          );
        }

        if (timeSlot.isBooked) {
          return NextResponse.json(
            { success: false, error: "This time slot is already booked." },
            { status: 400 }
          );
        }

        // Lock standard database slot
        await db.timeSlot.update({
          where: { id: timeSlotId },
          data: { isBooked: true },
        });
      }

      // 3. Find or Create User
      let user = await db.user.findUnique({
        where: { email: email.toLowerCase() },
      });

      if (!user) {
        user = await db.user.create({
          data: {
            email: email.toLowerCase(),
            name,
            phone,
          },
        });
      }

      // 4. Calculate amount
      const price = getPrice(selectedPackage, currency);
      const amountInSubunits = getAmountInSubunits(selectedPackage, currency);

      // 5. Create the checkout order with the right processor for this currency
      const order = await createCheckoutOrder(
        currency,
        price,
        amountInSubunits,
        `rcpt_${user.id.substring(0, 8)}_${Date.now()}`
      );
      if (!order.ok) {
        // Release the slot we locked in steps 1-2 — no booking will be created for this request.
        try {
          await db.timeSlot.update({ where: { id: timeSlotId }, data: { isBooked: false } });
        } catch (releaseErr) {
          console.error("Failed to release slot after checkout order creation failure:", releaseErr);
        }
        return NextResponse.json({ success: false, error: order.error }, { status: order.status });
      }

      // 6. Create Pending Booking
      const booking = await db.booking.create({
        data: {
          userId: user.id,
          timeSlotId: timeSlotId,
          birthDate: new Date(birthDate),
          birthTime,
          birthPlace,
          gender,
          notes,
          orderId: order.orderId,
          paymentStatus: "PENDING",
          amountPaid: price,
          currency,
        },
      });

      return NextResponse.json({
        success: true,
        booking,
        provider: order.provider,
        razorpayOrderId: order.provider === "razorpay" ? order.orderId : undefined,
        razorpayKeyId: order.provider === "razorpay" ? order.razorpayKeyId : undefined,
        paypalOrderId: order.provider === "paypal" ? order.orderId : undefined,
        paypalClientId: order.provider === "paypal" ? order.paypalClientId : undefined,
        amount: amountInSubunits,
        currency,
        user,
      });

    } catch (dbErr: any) {
      let isGcal = false;
      let slotStartTime = new Date();
      let slotEndTime = new Date();

      // Check if it is a virtual Google Calendar slot ID
      if (googleCalendar.isConfigured() && timeSlotId.startsWith("gcal-")) {
        try {
          const parts = timeSlotId.split("-");
          const timestamp = parseInt(parts[2]);
          if (!isNaN(timestamp)) {
            slotStartTime = new Date(timestamp);
            const duration = packageId === "marriage" ? 60 : 45;
            slotEndTime = new Date(slotStartTime.getTime() + duration * 60 * 1000);
            isGcal = true;
          }
        } catch (err) {
          console.error("Failed to parse virtual GCal slot inside mock fallback:", err);
        }
      }

      const mockUser = mockDb.getOrCreateUser(name, email, phone);
      const price = getPrice(selectedPackage, currency);
      const amountInSubunits = getAmountInSubunits(selectedPackage, currency);

      const order = await createCheckoutOrder(currency, price, amountInSubunits, `rcpt_mock_${Date.now()}`);
      if (!order.ok) {
        return NextResponse.json({ success: false, error: order.error }, { status: order.status });
      }

      let booking;

      if (isGcal) {
        // Create mock booking with a virtual time slot
        booking = mockDb.createBooking({
          userId: mockUser.id,
          user: mockUser,
          timeSlotId: timeSlotId,
          timeSlot: {
            id: timeSlotId,
            startTime: slotStartTime,
            endTime: slotEndTime,
            isBooked: true,
          },
          birthDate: new Date(birthDate),
          birthTime,
          birthPlace,
          gender,
          notes,
          orderId: order.orderId,
          amountPaid: price,
          currency,
        });
      } else {
        const mockSlot = mockDb.findSlot(timeSlotId);
        if (!mockSlot) {
          return NextResponse.json({ success: false, error: "Time slot not found in mock." }, { status: 404 });
        }
        if (mockSlot.isBooked) {
          return NextResponse.json({ success: false, error: "Time slot already booked." }, { status: 400 });
        }

        booking = mockDb.createBooking({
          userId: mockUser.id,
          user: mockUser,
          timeSlotId: mockSlot.id,
          timeSlot: mockSlot,
          birthDate: new Date(birthDate),
          birthTime,
          birthPlace,
          gender,
          notes,
          orderId: order.orderId,
          amountPaid: price,
          currency,
        });

        // Lock slot in mock db
        mockDb.bookSlot(mockSlot.id, true);
      }

      return NextResponse.json({
        success: true,
        booking,
        provider: order.provider,
        razorpayOrderId: order.provider === "razorpay" ? order.orderId : undefined,
        razorpayKeyId: order.provider === "razorpay" ? order.razorpayKeyId : undefined,
        paypalOrderId: order.provider === "paypal" ? order.orderId : undefined,
        paypalClientId: order.provider === "paypal" ? order.paypalClientId : undefined,
        amount: amountInSubunits,
        currency,
        user: mockUser,
        fallbackMode: true,
      });
    }

  } catch (error: any) {
    console.error("General error in POST /api/bookings:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create booking" },
      { status: 500 }
    );
  }
}
