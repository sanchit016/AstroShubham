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
        console.error("Failed to fetch slots from Google Calendar API. Falling back to local/mock database:", gcalErr.message || gcalErr);
      }
    } else {
      console.log("Google Calendar credentials not fully configured in .env. Attempting DB query...");
    }

    // 2. Fetch from DB if Google Calendar is not configured or failed
    try {
      let slots = await db.timeSlot.findMany({
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

      // Auto-seed mock slots if database is empty
      if (slots.length === 0) {
        console.log("No slots found in DB. Auto-seeding mock slots...");
        const mockSlots = [];
        const today = new Date();
        
        for (let day = 1; day <= 7; day++) {
          const currentDate = new Date(today);
          currentDate.setDate(today.getDate() + day);
          
          const hours = [10, 11.5, 14, 15.5, 17];
          for (const hour of hours) {
            const startTime = new Date(currentDate);
            startTime.setHours(Math.floor(hour), (hour % 1) * 60, 0, 0);
            
            const endTime = new Date(startTime);
            endTime.setMinutes(endTime.getMinutes() + 45);

            mockSlots.push({
              startTime,
              endTime,
              isBooked: false,
            });
          }
        }

        await db.timeSlot.createMany({
          data: mockSlots,
        });

        slots = await db.timeSlot.findMany({
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
      }

      return NextResponse.json({ success: true, slots, source: "database" });
    } catch (dbErr: any) {
      console.warn("Database connection issue. Falling back to in-memory mock DB.");
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
