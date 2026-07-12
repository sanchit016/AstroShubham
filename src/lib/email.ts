import nodemailer from "nodemailer";

interface EmailPayload {
  id: string;
  amountPaid: number;
  currency: string;
  birthDate: Date;
  birthTime: string;
  birthPlace: string;
  notes: string | null;
  packageName: string;
  user: {
    name: string;
    email: string;
  };
  timeSlot: {
    startTime: Date;
    endTime: Date;
  };
  googleMeetLink?: string;
}

// Format date into ICS format: YYYYMMDDTHHMMSSZ (UTC)
function formatToICSDate(date: Date): string {
  const d = new Date(date);
  return d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

export async function sendBookingConfirmation(booking: EmailPayload) {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM } = process.env;

  const startICS = formatToICSDate(booking.timeSlot.startTime);
  const endICS = formatToICSDate(booking.timeSlot.endTime);
  const stampICS = formatToICSDate(new Date());

  const meetLink = booking.googleMeetLink || "https://meet.google.com/mock-room";

  // Build the iCalendar event attachment
  const icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//AstroShubham//NONSGML Calendar Invite//EN",
    "METHOD:REQUEST",
    "BEGIN:VEVENT",
    `UID:booking_${booking.id}@astroshubham.com`,
    `DTSTAMP:${stampICS}`,
    `DTSTART:${startICS}`,
    `DTEND:${endICS}`,
    `SUMMARY:Astrology Session - ${booking.packageName}`,
    `DESCRIPTION:Vedic & Lal Kitab Astrology consultation with Shubham Chhabra.\\n\\nConsultation: ${booking.packageName}\\nClient Name: ${booking.user.name}\\nBirth Date: ${booking.birthDate.toDateString()}\\nBirth Time: ${booking.birthTime}\\nBirth Place: ${booking.birthPlace}\\nNotes: ${booking.notes || "None"}\\n\\nMeeting Link: ${meetLink}`,
    "LOCATION:Google Meet / Online Video",
    "STATUS:CONFIRMED",
    "SEQUENCE:0",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const emailHtml = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #0a0714; color: #fcfcfd; border-radius: 12px; border: 1px solid #fbbf24;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #fbbf24; font-size: 24px; margin-bottom: 5px;">AstroShubham</h1>
        <p style="color: #a0aec0; font-size: 14px; margin: 0;">Your Celestial Session is Confirmed</p>
      </div>
      
      <p style="font-size: 16px; line-height: 1.5; color: #fcfcfd;">Dear <strong>${booking.user.name}</strong>,</p>
      <p style="font-size: 15px; line-height: 1.5; color: #a0aec0;">
        Greetings. Your payment of <strong>${booking.currency === "INR" ? "₹" : "$"}${booking.amountPaid}</strong> has been successfully processed, and your virtual meeting room is prepared.
      </p>

      <div style="background-color: #120e2e; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #fbbf24;">
        <h3 style="color: #fbbf24; margin-top: 0; margin-bottom: 15px;">Appointment Details</h3>
        <table style="width: 100%; font-size: 14px; color: #a0aec0;">
          <tr>
            <td style="padding: 4px 0; width: 40%;"><strong>Consultation:</strong></td>
            <td style="color: #fcfcfd;">${booking.packageName}</td>
          </tr>
          <tr>
            <td style="padding: 4px 0;"><strong>Date & Time:</strong></td>
            <td style="color: #fcfcfd;">${booking.timeSlot.startTime.toLocaleString()} (Local Time)</td>
          </tr>
          <tr>
            <td style="padding: 4px 0;"><strong>Birth Parameters:</strong></td>
            <td style="color: #fcfcfd;">${booking.birthPlace} (at ${booking.birthTime})</td>
          </tr>
          <tr>
            <td style="padding: 4px 0;"><strong>Meeting Link:</strong></td>
            <td><a href="${meetLink}" style="color: #00f5ff; text-decoration: none;">Join Google Meet</a></td>
          </tr>
        </table>
      </div>

      <p style="font-size: 14px; line-height: 1.5; color: #a0aec0;">
        We have attached a calendar invitation (<code>appointment.ics</code>) to this email. You can open it to automatically add this session directly to Google Calendar, Apple Calendar, or Outlook.
      </p>

      <hr style="border: none; border-top: 1px solid rgba(255,255,255,0.05); margin: 30px 0;" />
      
      <p style="font-size: 12px; color: #6b7280; text-align: center; margin: 0;">
        AstroShubham &copy; ${new Date().getFullYear()} | support@astroshubham.com
      </p>
    </div>
  `;

  let transporter;
  let fromSender = SMTP_FROM || `"AstroShubham" <astroshubhamchhabra@gmail.com>`;

  // Configure transporter based on available authentication modes
  if (process.env.GOOGLE_REFRESH_TOKEN && process.env.GOOGLE_CLIENT_ID) {
    // 1. Send via Google OAuth2 using the Calendar token
    console.log("Configuring email delivery via secure Google OAuth2...");
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: "astroshubhamchhabra@gmail.com",
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
      },
    });
    fromSender = `"AstroShubham" <astroshubhamchhabra@gmail.com>`;
  } else if (SMTP_HOST && SMTP_USER && SMTP_PASS) {
    // 2. Fallback to standard SMTP
    console.log("Configuring email delivery via SMTP server...");
    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: parseInt(SMTP_PORT || "587"),
      secure: parseInt(SMTP_PORT || "587") === 465,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });
    fromSender = SMTP_FROM || `"AstroShubham" <${SMTP_USER}>`;
  } else {
    // 3. Fallback to Mock logging
    console.warn("SMTP / Google OAuth2 email settings are missing. Email confirmation output (Mock mode):");
    console.log(`To: ${booking.user.email}`);
    console.log(`Subject: AstroShubham Session Confirmed - ${booking.packageName}`);
    console.log(`Meeting Link: ${meetLink}`);
    console.log("ICS Attachment generated successfully.");
    return;
  }

  try {
    await transporter.sendMail({
      from: fromSender,
      to: booking.user.email,
      subject: `AstroShubham Consultation Confirmed - ${booking.packageName}`,
      html: emailHtml,
      attachments: [
        {
          filename: "appointment.ics",
          content: icsContent,
          contentType: "text/calendar; charset=utf-8; method=REQUEST",
        },
      ],
    });
    console.log(`Confirmation email successfully dispatched to ${booking.user.email} via transporter.`);
  } catch (err) {
    console.error("Nodemailer failed to dispatch email:", err);
  }
}
