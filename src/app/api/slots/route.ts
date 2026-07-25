import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { mockDb } from "@/lib/mockDb";
import { googleCalendar } from "@/lib/googleCalendar";

export async function GET(req: Request) {
  try {
    // 1. Attempt to fetch from Google Calendar if configured
    if (googleCalendar.isConfigured()) {
      try {
        const { searchParams } = new URL(req.url || "");
        const packageId = searchParams.get("packageId") || "general";
        console.log(`Google Calendar configured. Fetching available slots from GCal API for package: ${packageId}...`);
        const slots = await googleCalendar.getAvailableSlots(packageId);
        return NextResponse.json({ success: true, slots, source: "google_calendar" });
      } catch (gcalErr: any) {
        console.error("Failed to fetch slots from Google Calendar API. Falling back to database:", gcalErr.message || gcalErr);
      }
    } else {
      console.log("Google Calendar credentials not fully configured in .env. Attempting DB query...");
    }

    // 2. Fetch from DB if Google Calendar is not configured or failed.
    // No fake/auto-seeded slots here — an empty result means no real availability exists yet,
    // and customers should see that honestly rather than being offered times nobody opened up.
    try {
      const slots = await db.timeSlot.findMany({
        where: {
          isBooked: false,
          startTime: {
            gt: new Date(),
          },
        },
        orderBy: {
          startTime: "asc",
        },
      });

      return NextResponse.json({ success: true, slots, source: "database" });
    } catch (dbErr: any) {
      // Real Postgres connection unreachable. In production, surface that honestly instead of
      // inventing availability. In local dev (no DB configured), fall back to the in-memory
      // mock DB purely so the booking funnel can still be previewed/tested.
      if (process.env.NODE_ENV === "production") {
        console.error("Database connection issue and no fallback available in production:", dbErr.message || dbErr);
        return NextResponse.json({ success: true, slots: [], source: "unavailable" });
      }

      console.warn("Database connection issue. Falling back to in-memory mock DB (development only).");
      const slots = mockDb.getAvailableSlots();
      return NextResponse.json({ success: true, slots, source: "mock_db", fallbackMode: true });
    }

  } catch (error: any) {
    console.error("General error in GET /api/slots:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch slots" },
      { status: 500 }
    );
  }
}
