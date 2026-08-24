import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { mockDb } from "@/lib/mockDb";
import { googleCalendar } from "@/lib/googleCalendar";

export async function GET(req: Request) {
  try {
    let gcalError: string | null = null;

    // 1. Attempt to fetch from Google Calendar if configured
    if (googleCalendar.isConfigured()) {
      try {
        const { searchParams } = new URL(req.url || "");
        const packageId = searchParams.get("packageId") || "general";
        console.log(`Google Calendar configured. Fetching available slots from GCal API for package: ${packageId}...`);
        const slots = await googleCalendar.getAvailableSlots(packageId);
        return NextResponse.json({ success: true, slots, source: "google_calendar" });
      } catch (err: any) {
        gcalError = err?.message || String(err);
        console.error("Failed to fetch slots from Google Calendar API. Falling back to database:", gcalError);
      }
    } else {
      gcalError = "Google Calendar environment variables not fully configured (missing clientId, clientSecret, or refreshToken).";
      console.log(gcalError);
    }

    // 2. Fetch from DB if Google Calendar is not configured or failed.
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

      return NextResponse.json({ success: true, slots, source: "database", gcalError });
    } catch (dbErr: any) {
      if (process.env.NODE_ENV === "production") {
        console.error("Database connection issue and no fallback available in production:", dbErr.message || dbErr);
        return NextResponse.json({
          success: true,
          slots: [],
          source: "unavailable",
          debug: {
            gcalConfigured: googleCalendar.isConfigured(),
            gcalError,
            dbError: dbErr.message || "Database unreachable",
          },
        });
      }

      console.warn("Database connection issue. Falling back to in-memory mock DB (development only).");
      const slots = mockDb.getAvailableSlots();
      return NextResponse.json({ success: true, slots, source: "mock_db", fallbackMode: true, gcalError });
    }

  } catch (error: any) {
    console.error("General error in GET /api/slots:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch slots" },
      { status: 500 }
    );
  }
}
