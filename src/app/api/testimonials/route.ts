import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { mockDb } from "@/lib/mockDb";

const SEED_TESTIMONIALS = [
  {
    name: "Priya Sharma",
    role: "Marriage Consultation",
    quote:
      "Shubham ji's Gun Milan reading gave us so much clarity before our wedding. He explained everything in plain language, no fear-mongering, just honest guidance and practical remedies.",
    rating: 5,
  },
  {
    name: "Arjun Mehta",
    role: "Career & Wealth Session",
    quote:
      "I was stuck between a job offer and starting my own business. The 10th house analysis he walked me through made the decision obvious. Three months later, things are working out exactly as discussed.",
    rating: 5,
  },
  {
    name: "Kavita Iyer",
    role: "Family & Ancestry Reading",
    quote:
      "Incredibly thoughtful session on Pitra Dosha and family harmony. The Lal Kitab remedies were simple to follow and things at home genuinely feel calmer.",
    rating: 5,
  },
  {
    name: "Daniel Fischer",
    role: "General Consultation",
    quote:
      "Booked from the US expecting the usual vague answers, got the opposite. Direct, specific, and genuinely helpful guidance on my health and energy concerns.",
    rating: 4,
  },
];

export async function GET() {
  try {
    // 1. Try the real database first
    try {
      let testimonials = await db.testimonial.findMany({
        where: { approved: true },
        orderBy: { createdAt: "desc" },
      });

      // Auto-seed on first run, mirroring the /api/slots pattern
      if (testimonials.length === 0) {
        console.log("No testimonials found in DB. Auto-seeding sample testimonials...");
        await db.testimonial.createMany({ data: SEED_TESTIMONIALS });
        testimonials = await db.testimonial.findMany({
          where: { approved: true },
          orderBy: { createdAt: "desc" },
        });
      }

      return NextResponse.json({ success: true, testimonials, source: "database" });
    } catch (dbErr) {
      console.warn("Database connection issue. Falling back to in-memory mock DB for testimonials.");
      const testimonials = mockDb.getTestimonials();
      return NextResponse.json({ success: true, testimonials, source: "mock_db", fallbackMode: true });
    }
  } catch (error: any) {
    console.error("General error in GET /api/testimonials:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch testimonials" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const role = typeof body.role === "string" ? body.role.trim() : "";
    const quote = typeof body.quote === "string" ? body.quote.trim() : "";
    const rating = Number(body.rating);

    if (!name || name.length > 80) {
      return NextResponse.json({ success: false, error: "Please provide a valid name." }, { status: 400 });
    }
    if (!quote || quote.length < 10 || quote.length > 600) {
      return NextResponse.json(
        { success: false, error: "Please share a bit more detail (10-600 characters)." },
        { status: 400 }
      );
    }
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return NextResponse.json({ success: false, error: "Rating must be between 1 and 5." }, { status: 400 });
    }

    const data = {
      name,
      role: role || "Client",
      quote,
      rating,
      approved: false, // held for manual review before it appears publicly
    };

    try {
      const testimonial = await db.testimonial.create({ data });
      return NextResponse.json({ success: true, testimonial, source: "database" });
    } catch (dbErr) {
      console.warn("Database connection issue. Storing testimonial submission in mock DB.");
      const testimonial = mockDb.createTestimonial(data);
      return NextResponse.json({ success: true, testimonial, source: "mock_db", fallbackMode: true });
    }
  } catch (error: any) {
    console.error("General error in POST /api/testimonials:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to submit testimonial" },
      { status: 500 }
    );
  }
}
