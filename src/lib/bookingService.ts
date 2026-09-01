import { db } from "@/lib/db";
import { googleCalendar } from "@/lib/googleCalendar";
import { sendBookingConfirmation } from "@/lib/email";
import { mockDb } from "@/lib/mockDb";
import { PACKAGES, isSupportedCurrency } from "@/lib/pricing";

// Helper to resolve package name by price and currency
export function getPackageNameByPrice(price: number, currency: string): string {
  if (isSupportedCurrency(currency)) {
    const match = PACKAGES.find((pkg) => pkg.prices[currency] === price);
    if (match) return match.title;
  }
  return "Premium Astrology Consultation";
}

// Helper to resolve package id by price and currency (used to pick GCal duration/slot type)
export function getPackageIdByPrice(price: number, currency: string): string {
  if (isSupportedCurrency(currency)) {
    const match = PACKAGES.find((pkg) => pkg.prices[currency] === price);
    if (match) return match.id;
  }
  return "general";
}

export interface BookingFallbackDetails {
  name?: string;
  email?: string;
  phone?: string;
  birthDate?: string;
  birthTime?: string;
  birthPlace?: string;
  gender?: string;
  notes?: string;
  packageId?: string;
  timeSlotId?: string;
  currency?: string;
  amountPaid?: number;
}

export async function finalizeBooking(
  orderId: string,
  paymentId: string,
  fallbackDetails?: BookingFallbackDetails
) {
  let updatedBooking: any = null;

  // Check if booking is already updated in the database to prevent duplicate processing
  try {
    const existing = await db.booking.findUnique({
      where: { orderId },
      include: { user: true, timeSlot: true },
    });
    if (existing && existing.paymentStatus === "SUCCESS") {
      console.log(`Booking for Order ${orderId} is already marked as SUCCESS in DB. Skipping duplicate finalization.`);
      return { success: true };
    }

    if (existing) {
      updatedBooking = await db.booking.update({
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
    }
  } catch (err: any) {
    console.warn("Database connection issue during finalizeBooking. Falling back to direct Google Calendar & Email processing:", err?.message || err);
  }

  // Resolve client and session details from DB record or fallback payload
  const clientName = updatedBooking?.user?.name || fallbackDetails?.name || "Client";
  const clientEmail = updatedBooking?.user?.email || fallbackDetails?.email || "";
  const birthDateStr = updatedBooking?.birthDate ? new Date(updatedBooking.birthDate).toDateString() : (fallbackDetails?.birthDate || "");
  const birthTime = updatedBooking?.birthTime || fallbackDetails?.birthTime || "";
  const birthPlace = updatedBooking?.birthPlace || fallbackDetails?.birthPlace || "";
  const gender = updatedBooking?.gender || fallbackDetails?.gender || "";
  const notes = updatedBooking?.notes || fallbackDetails?.notes || "";
  const timeSlotId = updatedBooking?.timeSlotId || fallbackDetails?.timeSlotId || "";
  const currency = updatedBooking?.currency || fallbackDetails?.currency || "USD";
  const amountPaid = updatedBooking?.amountPaid ?? fallbackDetails?.amountPaid ?? 0;
  const packageId = fallbackDetails?.packageId || getPackageIdByPrice(amountPaid, currency);

  let meetLink = "https://meet.google.com/mock-meet-room";

  // If Google Calendar is configured, book the slot on Google Calendar in real-time
  if (googleCalendar.isConfigured() && timeSlotId) {
    try {
      console.log(`Finalizing booking details on Google Calendar for ${clientName}...`);
      const result = await googleCalendar.bookSlot(
        timeSlotId,
        {
          name: clientName,
          email: clientEmail,
          birthDate: birthDateStr,
          birthTime,
          birthPlace,
          gender,
          notes,
        },
        packageId
      );
      meetLink = result.meetLink;
      console.log(`Successfully finalized Google Calendar event and generated Meet link: ${meetLink}`);
    } catch (gcalErr: any) {
      console.error("Failed to book slot on Google Calendar API:", gcalErr.message || gcalErr);
    }
  }

  // Send confirmation email
  try {
    if (clientEmail) {
      const packageName = getPackageNameByPrice(amountPaid, currency);
      await sendBookingConfirmation({
        id: updatedBooking?.id || orderId,
        amountPaid,
        currency,
        birthDate: new Date(birthDateStr || Date.now()),
        birthTime,
        birthPlace,
        notes,
        packageName,
        user: {
          name: clientName,
          email: clientEmail,
        },
        timeSlot: {
          startTime: updatedBooking?.timeSlot?.startTime || new Date(),
          endTime: updatedBooking?.timeSlot?.endTime || new Date(),
        },
        googleMeetLink: meetLink,
      });
    }
  } catch (emailErr) {
    console.error("Failed to send booking confirmation email:", emailErr);
  }

  return { success: true, meetLink };
}

// Finalizes a booking that only exists in the in-memory mock DB (Postgres unreachable),
// mirroring finalizeBooking's GCal + email side effects. Shared by both payment providers'
// mock-order fallback paths.
export async function finalizeMockBooking(orderId: string, paymentId: string) {
  const mockBooking = mockDb.finalizeBooking(orderId, paymentId);
  if (!mockBooking) return null;

  let meetLink = "https://meet.google.com/mock-meet-room";

  if (googleCalendar.isConfigured()) {
    try {
      console.log("Mock payment verified. Syncing booking to Google Calendar...");
      const packageId = getPackageIdByPrice(mockBooking.amountPaid, mockBooking.currency);
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

  return mockBooking;
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
