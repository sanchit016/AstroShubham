import { db } from "@/lib/db";
import { googleCalendar } from "@/lib/googleCalendar";
import { sendBookingConfirmation } from "@/lib/email";

// Helper to resolve package name by price and currency
export function getPackageNameByPrice(price: number, currency: string): string {
  if (currency === "INR") {
    if (price === 1999 || price === 1) return "General Consultation (Unlimited Questions)";
    if (price === 2999) return "Marriage Match & Couple Consultation";
  } else {
    if (price === 25 || price === 1) return "General Consultation (Unlimited Questions)";
    if (price === 40) return "Marriage Match & Couple Consultation";
  }
  return "Premium Astrology Consultation";
}

export async function finalizeBooking(orderId: string, paymentId: string) {
  // Check if booking is already updated in the database to prevent duplicate processing
  try {
    const existing = await db.booking.findUnique({
      where: { orderId },
    });
    if (existing && existing.paymentStatus === "SUCCESS") {
      console.log(`Booking for Order ${orderId} is already marked as SUCCESS in DB. Skipping duplicate finalization.`);
      return;
    }
  } catch (err) {
    console.warn("DB check for existing booking failed, proceeding with update...");
  }

  // Update payment status in database
  const updatedBooking = await db.booking.update({
    where: { orderId },
    data: {
      paymentStatus: "SUCCESS",
      paymentId,
    },
    include: {
      user: true,
      timeSlot: true,
    },
  });

  console.log(`Booking for Order ${orderId} successfully finalized in DB.`);

  let meetLink = "https://meet.google.com/mock-meet-room";

  // If Google Calendar is configured, book the slot on Google Calendar in real-time
  if (googleCalendar.isConfigured()) {
    try {
      console.log("Finalizing booking details on Google Calendar...");
      const packageId = updatedBooking.amountPaid === 40 || updatedBooking.amountPaid === 2999 ? "marriage" : "general";
      const result = await googleCalendar.bookSlot(updatedBooking.timeSlotId, {
        name: updatedBooking.user.name,
        email: updatedBooking.user.email,
        birthDate: updatedBooking.birthDate.toDateString(),
        birthTime: updatedBooking.birthTime,
        birthPlace: updatedBooking.birthPlace,
        gender: updatedBooking.gender,
        notes: updatedBooking.notes || "",
      }, packageId);
      meetLink = result.meetLink;
      console.log(`Successfully finalized Google Calendar event and generated Meet link: ${meetLink}`);
    } catch (gcalErr: any) {
      console.error("Failed to book slot on Google Calendar API:", gcalErr.message || gcalErr);
    }
  }

  // Send confirmation email
  try {
    const packageName = getPackageNameByPrice(updatedBooking.amountPaid, updatedBooking.currency);
    await sendBookingConfirmation({
      id: updatedBooking.id,
      amountPaid: updatedBooking.amountPaid,
      currency: updatedBooking.currency,
      birthDate: updatedBooking.birthDate,
      birthTime: updatedBooking.birthTime,
      birthPlace: updatedBooking.birthPlace,
      notes: updatedBooking.notes,
      packageName,
      user: {
        name: updatedBooking.user.name,
        email: updatedBooking.user.email,
      },
      timeSlot: {
        startTime: updatedBooking.timeSlot.startTime,
        endTime: updatedBooking.timeSlot.endTime,
      },
      googleMeetLink: meetLink,
    });
  } catch (emailErr) {
    console.error("Failed to send booking confirmation email:", emailErr);
  }
}

export async function releaseBookingSlot(orderId: string) {
  try {
    const booking = await db.booking.findUnique({
      where: { orderId },
      include: { timeSlot: true },
    });

    if (booking) {
      if (booking.paymentStatus === "SUCCESS") {
        console.log(`Booking for Order ${orderId} is already marked as SUCCESS. Skipping release.`);
        return;
      }

      await db.$transaction([
        db.booking.update({
          where: { orderId },
          data: { paymentStatus: "FAILED" },
        }),
        db.timeSlot.update({
          where: { id: booking.timeSlotId },
          data: { isBooked: false },
        }),
      ]);
      console.log(`Booking order ${orderId} failed. Released timeslot ${booking.timeSlotId}.`);
    }
  } catch (err) {
    console.error("Error releasing timeslot:", err);
    throw err;
  }
}
