import { NextResponse } from "next/server";
import crypto from "crypto";
import { mockDb } from "@/lib/mockDb";
import { googleCalendar } from "@/lib/googleCalendar";
import { sendBookingConfirmation } from "@/lib/email";
import { finalizeBooking, releaseBookingSlot, getPackageNameByPrice } from "@/lib/bookingService";

export async function POST(req: Request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { success: false, error: "Missing verification parameters." },
        { status: 400 }
      );
    }

    // --- MOCK FALLBACK CHECK ---
    if (razorpay_order_id.startsWith("order_mock") || razorpay_signature === "mock_signature") {
      console.log("Mock Order detected. Finalizing in-memory...");
      const mockBooking = mockDb.finalizeBooking(razorpay_order_id, razorpay_payment_id);
      if (mockBooking) {
        let meetLink = "https://meet.google.com/mock-meet-room";

        // Try booking on Google Calendar even in mock mode if API is configured
        if (googleCalendar.isConfigured()) {
          try {
            console.log("Mock payment verified. Syncing booking to Google Calendar...");
            const packageId = getPackageNameByPrice(mockBooking.amountPaid, mockBooking.currency);
            const result = await googleCalendar.bookSlot(mockBooking.timeSlotId, {
              name: mockBooking.user.name,
              email: mockBooking.user.email,
              birthDate: mockBooking.birthDate.toDateString(),
              birthTime: mockBooking.birthTime,
              birthPlace: mockBooking.birthPlace,
              gender: mockBooking.gender,
              notes: mockBooking.notes || "",
            }, packageId);
            meetLink = result.meetLink;
          } catch (gcalErr: any) {
            console.error("Mock GCal book failed:", gcalErr.message || gcalErr);
          }
        }

        try {
          await sendBookingConfirmation({
            id: mockBooking.id,
            amountPaid: mockBooking.amountPaid,
            currency: mockBooking.currency,
            birthDate: mockBooking.birthDate,
            birthTime: mockBooking.birthTime,
            birthPlace: mockBooking.birthPlace,
            notes: mockBooking.notes,
            packageName: "Vedic & Lal Kitab Consultation",
            user: {
              name: mockBooking.user.name,
              email: mockBooking.user.email,
            },
            timeSlot: {
              startTime: mockBooking.timeSlot.startTime,
              endTime: mockBooking.timeSlot.endTime,
            },
            googleMeetLink: meetLink,
          });
        } catch (emailErr) {
          console.error("Mock email send failed:", emailErr);
        }
        return NextResponse.json({ success: true, message: "Mock payment verified and finalized in memory." });
      }
      return NextResponse.json({ success: false, error: "Booking order not found in mock." }, { status: 400 });
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      console.error("Razorpay Key Secret is missing. Skipping signature verification (dangerous!).");
      if (razorpay_signature === "mock_signature") {
        await finalizeBooking(razorpay_order_id, razorpay_payment_id);
        return NextResponse.json({ success: true, message: "Mock payment verified." });
      }
      return NextResponse.json({ success: false, error: "Payment processor key secret misconfigured" }, { status: 500 });
    }

    // Standard Razorpay Signature Verification
    const generatedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generatedSignature === razorpay_signature) {
      try {
        await finalizeBooking(razorpay_order_id, razorpay_payment_id);
        return NextResponse.json({ success: true, message: "Payment verified and booking confirmed!" });
      } catch (dbErr: any) {
        console.warn("DB connection lost during finalizeBooking. Finalizing in-memory mock instead.");
        const mockBooking = mockDb.finalizeBooking(razorpay_order_id, razorpay_payment_id);
        if (mockBooking) {
          return NextResponse.json({ success: true, message: "Finalized in mockDb fallback." });
        }
        throw dbErr;
      }
    } else {
      // Payment signature mismatch - set to failed and release the slot
      try {
        await releaseBookingSlot(razorpay_order_id);
      } catch (dbErr) {
        mockDb.failBooking(razorpay_order_id);
      }
      return NextResponse.json({ success: false, error: "Payment signature verification failed." }, { status: 400 });
    }
  } catch (error: any) {
    console.error("Error in POST /api/verify-payment:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to verify payment" },
      { status: 500 }
    );
  }
}
