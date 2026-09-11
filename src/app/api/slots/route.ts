import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { mockDb } from "@/lib/mockDb";
import { googleCalendar } from "@/lib/googleCalendar";

function generateUpcomingSlots(daysAhead = 14) {
  const slots: { id: string; startTime: string; endTime: string; isBooked: boolean }[] = [];
  const now = new Date();

  for (let dayOffset = 0; dayOffset <= daysAhead; dayOffset++) {
    const slotDate = new Date();
    slotDate.setDate(now.getDate() + dayOffset);

    // Consultation hours in IST (11:00, 12:30, 15:00, 16:30, 18:00, 19:30, 21:00 IST)
    const istHours = [11, 12.5, 15, 16.5, 18, 19.5, 21];

    for (const h of istHours) {
      const year = slotDate.getFullYear();
      const month = slotDate.getMonth();
      const date = slotDate.getDate();

      const hourInt = Math.floor(h);
      const minInt = (h % 1) * 60;

      // Construct UTC timestamp (IST is UTC+5:30)
      const slotStart = new Date(Date.UTC(year, month, date, hourInt - 5, minInt - 30, 0));
      const slotEnd = new Date(slotStart.getTime() + 45 * 60 * 1000);

      if (slotStart.getTime() > now.getTime() + 20 * 60 * 1000) {
        slots.push({
          id: `slot-auto-${slotStart.getTime()}`,
          startTime: slotStart.toISOString(),
          endTime: slotEnd.toISOString(),
          isBooked: false,
        });
      }
    }
  }
  return slots;
}

export async function GET(req: Request) {
  try {
    let gcalError: string | null = null;

    // 1. Attempt to fetch from Google Calendar if configured
    if (googleCalendar.isConfigured()) {
      try {
        const { searchParams } = new URL(req.url || "");
        const packageId = searchParams.get("packageId") || "general";
        const slots = await googleCalendar.getAvailableSlots(packageId);
        if (slots && slots.length > 0) {
          return NextResponse.json({ success: true, slots, source: "google_calendar" });
        }
      } catch (err: any) {
        gcalError = err?.message || String(err);
        console.error("GCal fetch failed, falling back to instant slots:", gcalError);
      }
    }

    // 2. Fetch from DB if available
    try {
      const dbSlots = await db.timeSlot.findMany({
        where: {
          isBooked: false,
          startTime: { gt: new Date() },
        },
        orderBy: { startTime: "asc" },
      });

      if (dbSlots && dbSlots.length > 0) {
        return NextResponse.json({ success: true, slots: dbSlots, source: "database", gcalError });
      }
    } catch (dbErr) {
      // Ignore DB issue and proceed to dynamic generator
    }

    // 3. Fallback: Return instantly generated future slots so the calendar is ALWAYS open
    const fallbackSlots = generateUpcomingSlots(14);
    return NextResponse.json({
      success: true,
      slots: fallbackSlots,
      source: "instant_slots",
      fallbackMode: true,
      gcalError,
    });
  } catch (error: any) {
    console.error("General error in GET /api/slots:", error);
    const fallbackSlots = generateUpcomingSlots(14);
    return NextResponse.json({
      success: true,
      slots: fallbackSlots,
      source: "instant_slots",
      fallbackMode: true,
    });
  }
}
