import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { mockDb } from "@/lib/mockDb";
import { googleCalendar } from "@/lib/googleCalendar";

export async function GET(req: Request) {
  try {
    let gcalError: string | null = null;

    if (googleCalendar.isConfigured()) {
      try {
        const { searchParams } = new URL(req.url || "");
        const packageId = searchParams.get("packageId") || "general";
        const slots = await googleCalendar.getAvailableSlots(packageId);
        return NextResponse.json({ success: true, slots, source: "google_calendar" });
      } catch (err: any) {
        gcalError = err?.message || String(err);
        console.error("Failed to fetch slots from Google Calendar API:", gcalError);
      }
    } else {
      gcalError = "Google Calendar environment variables not fully configured.";
    }

    try {
      const slots = await db.timeSlot.findMany({
        where: {
          isBooked: false,
          startTime: { gt: new Date() },
        },
        orderBy: { startTime: "asc" },
      });

      return NextResponse.json({ success: true, slots, source: "database", gcalError });
    } catch (dbErr: any) {
      return NextResponse.json({
        success: true,
        slots: [],
        source: "unavailable",
        gcalError,
      });
    }
  } catch (error: any) {
    console.error("General error in GET /api/slots:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch slots" },
      { status: 500 }
    );
  }
}
