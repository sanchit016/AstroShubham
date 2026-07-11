// Google Calendar API Client Wrapper (Lightweight REST implementation)
// Used as the primary availability scheduler and booking manager for AstroShubham.

export interface CalendarSlot {
  id: string;
  startTime: string; // ISO String
  endTime: string; // ISO String
  isBooked: boolean;
}

export interface BookingDetails {
  name: string;
  email: string;
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  gender: string;
  notes: string;
}

// Fetch a short-lived access token using the long-lived refresh token
async function getAccessToken(): Promise<string> {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error("Google Calendar API environment variables are not configured in your .env file.");
  }

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
    cache: "no-store",
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(`Failed to refresh Google access token: ${data.error_description || JSON.stringify(data)}`);
  }

  return data.access_token;
}

export const googleCalendar = {
  // Check if credentials are fully configured in the environment
  isConfigured: () => {
    return !!(
      process.env.GOOGLE_CLIENT_ID &&
      process.env.GOOGLE_CLIENT_SECRET &&
      process.env.GOOGLE_REFRESH_TOKEN
    );
  },

  // Retrieve available slots (Events with title "Available Slot") dynamically sliced based on package selection
  getAvailableSlots: async (packageId: string = "general"): Promise<CalendarSlot[]> => {
    const calendarId = process.env.GOOGLE_CALENDAR_ID || "primary";
    const accessToken = await getAccessToken();

    const timeMin = new Date().toISOString();
    // 10 days forward slot range
    const timeMax = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString();

    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?` +
      `timeMin=${encodeURIComponent(timeMin)}` +
      `&timeMax=${encodeURIComponent(timeMax)}` +
      `&singleEvents=true` +
      `&orderBy=startTime`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
        },
        cache: "no-store",
      }
    );

    const data = await response.json();
    if (!response.ok) {
      throw new Error(`Failed to fetch calendar events: ${JSON.stringify(data)}`);
    }

    const items = data.items || [];

    // Filter "Available Slot" events from other "Booked" events
    const rawBlocks = items.filter((event: any) => {
      const title = (event.summary || "").trim().toLowerCase();
      return title === "available slot";
    });

    const bookedEvents = items.filter((event: any) => {
      const title = (event.summary || "").trim().toLowerCase();
      return title !== "available slot";
    });

    // Slicing parameters
    // marriage -> 60 min session + 15 min buffer (75 mins interval)
    // general/career -> 45 min session + 15 min buffer (60 mins interval)
    const isMarriage = packageId === "marriage";
    const activeDuration = isMarriage ? 60 * 60 * 1000 : 45 * 60 * 1000;
    const bufferDuration = 15 * 60 * 1000;
    const interval = activeDuration + bufferDuration;

    const slots: CalendarSlot[] = [];

    rawBlocks.forEach((block: any) => {
      const blockStart = new Date(block.start.dateTime || block.start.date).getTime();
      const blockEnd = new Date(block.end.dateTime || block.end.date).getTime();

      let currentStart = blockStart;
      // Slice block into segments
      while (currentStart + activeDuration <= blockEnd) {
        const currentEnd = currentStart + activeDuration;

        // Check if segment overlaps with any already-booked event
        const hasOverlap = bookedEvents.some((booked: any) => {
          const bookedStart = new Date(booked.start.dateTime || booked.start.date).getTime();
          const bookedEnd = new Date(booked.end.dateTime || booked.end.date).getTime();
          // Overlap check (needs to overlap with session time + buffer duration to keep schedule clean)
          const sessionEndWithBuffer = currentStart + interval;
          return currentStart < bookedEnd && bookedStart < sessionEndWithBuffer;
        });

        if (!hasOverlap) {
          slots.push({
            id: `gcal-${block.id}-${currentStart}`,
            startTime: new Date(currentStart).toISOString(),
            endTime: new Date(currentEnd).toISOString(),
            isBooked: false,
          });
        }

        currentStart += interval;
      }
    });

    return slots;
  },

  // Finalize booking on Google Calendar by inserting a new event
  bookSlot: async (
    timeSlotId: string,
    details: BookingDetails,
    packageId: string = "general"
  ): Promise<{ meetLink: string; eventId: string }> => {
    const calendarId = process.env.GOOGLE_CALENDAR_ID || "primary";
    const accessToken = await getAccessToken();

    // Parse the start/end times directly from the sub-slot ID structure
    let startTime = new Date();
    let endTime = new Date();

    if (timeSlotId.startsWith("gcal-")) {
      const parts = timeSlotId.split("-");
      const timestamp = parseInt(parts[2]);
      if (!isNaN(timestamp)) {
        startTime = new Date(timestamp);
        const duration = packageId === "marriage" ? 60 : 45;
        endTime = new Date(startTime.getTime() + duration * 60 * 1000);
      }
    }

    // Build description containing birth details
    const description = `Vedic & Lal Kitab Astrology Consultation with Shubham Chhabra.\n\n` +
      `Client Name: ${details.name}\n` +
      `Client Email: ${details.email}\n` +
      `Birth Date: ${details.birthDate}\n` +
      `Birth Time: ${details.birthTime}\n` +
      `Birth Place: ${details.birthPlace}\n` +
      `Gender: ${details.gender}\n` +
      `Notes: ${details.notes || "None"}`;

    // Create a new event on Google Calendar for the specific session and notify attendees
    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?conferenceDataVersion=1&sendUpdates=all`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          summary: `Astrology Session - ${details.name}`,
          description,
          start: { dateTime: startTime.toISOString() },
          end: { dateTime: endTime.toISOString() },
          attendees: [{ email: details.email }],
          conferenceData: {
            createRequest: {
              requestId: `meet_request_${Date.now()}`,
              conferenceSolutionKey: { type: "hangoutsMeet" },
            },
          },
        }),
      }
    );

    const createdEvent = await response.json();
    if (!response.ok) {
      throw new Error(`Failed to create calendar booking event: ${JSON.stringify(createdEvent)}`);
    }

    // Resolve the generated Google Meet link
    let meetLink = "";
    if (createdEvent.conferenceData && createdEvent.conferenceData.entryPoints) {
      const videoPoint = createdEvent.conferenceData.entryPoints.find(
        (ep: any) => ep.entryPointType === "video"
      );
      if (videoPoint) {
        meetLink = videoPoint.uri;
      }
    }

    return {
      eventId: createdEvent.id,
      meetLink: meetLink || "https://meet.google.com/mock-meet-room",
    };
  }
};
