import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { razorpay } from "@/lib/razorpay";
import { mockDb } from "@/lib/mockDb";
import { googleCalendar } from "@/lib/googleCalendar";

const PACKAGES: Record<string, { title: string; priceINR: number; priceUSD: number }> = {
  general: { title: "General Consultation (Unlimited Questions)", priceINR: 1999, priceUSD: 25 },
  marriage: { title: "Marriage Match & Couple Consultation", priceINR: 2999, priceUSD: 40 },
  career: { title: "General Consultation (Unlimited Questions)", priceINR: 1999, priceUSD: 25 },
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      packageId,
      timeSlotId,
      currency, // "USD" or "INR"
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

    const selectedPackage = PACKAGES[packageId] || PACKAGES.general;

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
      const price = currency === "INR" ? selectedPackage.priceINR : selectedPackage.priceUSD;
      const amountInSubunits = Math.round(price * 100);

      // 5. Create Razorpay Order
      let razorpayOrder;
      try {
        razorpayOrder = await razorpay.orders.create({
          amount: amountInSubunits,
          currency: currency,
          receipt: `rcpt_${user.id.substring(0, 8)}_${Date.now()}`,
        });
      } catch (razorpayErr: any) {
        console.error("Razorpay Order Creation Error (using mock ID instead):", razorpayErr);
        razorpayOrder = { id: `order_mock_${Date.now()}` };
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
          orderId: razorpayOrder.id,
          paymentStatus: "PENDING",
          amountPaid: price,
          currency,
        },
      });

      return NextResponse.json({
        success: true,
        booking,
        razorpayOrderId: razorpayOrder.id,
        razorpayKeyId: process.env.RAZORPAY_KEY_ID || "MOCK_KEY_ID",
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
      const price = currency === "INR" ? selectedPackage.priceINR : selectedPackage.priceUSD;
      const amountInSubunits = Math.round(price * 100);

      // Create a real Razorpay order in fallback mode if keys are available
      let orderId = `order_mock_${Date.now()}`;
      try {
        if (process.env.RAZORPAY_KEY_SECRET && process.env.RAZORPAY_KEY_ID) {
          const razorpayOrder = await razorpay.orders.create({
            amount: amountInSubunits,
            currency: currency,
            receipt: `rcpt_mock_${Date.now()}`,
          });
          orderId = razorpayOrder.id;
          console.log(`Successfully created real Razorpay order ${orderId} in database fallback mode.`);
        }
      } catch (rzpErr) {
        console.error("Failed to generate real Razorpay order in database fallback mode:", rzpErr);
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
          orderId,
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
          orderId,
          amountPaid: price,
          currency,
        });

        // Lock slot in mock db
        mockDb.bookSlot(mockSlot.id, true);
      }

      return NextResponse.json({
        success: true,
        booking,
        razorpayOrderId: orderId,
        razorpayKeyId: process.env.RAZORPAY_KEY_ID || "MOCK_KEY_ID",
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
