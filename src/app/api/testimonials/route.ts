import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { mockDb } from "@/lib/mockDb";
import { INITIAL_TESTIMONIALS } from "@/lib/testimonialsData";

export async function GET() {
  try {
    try {
      const dbTestimonials = await db.testimonial.findMany({
        where: { approved: true },
        orderBy: { createdAt: "desc" },
      });

      const dbIds = new Set(dbTestimonials.map((t) => t.id));
      const dbQuotes = new Set(dbTestimonials.map((t) => t.quote.trim()));

      const fallbackList = INITIAL_TESTIMONIALS.filter(
        (it) => !dbIds.has(it.id) && !dbQuotes.has(it.quote.trim())
      );

      const combined = [...dbTestimonials, ...fallbackList];

      return NextResponse.json({ success: true, testimonials: combined, source: "database_merged" });
    } catch (dbErr: any) {
      console.warn("Database connection issue. Returning mockDb list:", dbErr?.message || dbErr);
      const testimonials = mockDb.getTestimonials();
      return NextResponse.json({
        success: true,
        testimonials,
        source: "mock_db",
        fallbackMode: true,
        dbError: dbErr?.message || String(dbErr),
      });
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
      approved: true, // auto-approve so client reviews appear immediately
    };

    try {
      const testimonial = await db.testimonial.create({ data });
      return NextResponse.json({ success: true, testimonial, source: "database" });
    } catch (dbErr: any) {
      console.warn("Database connection issue. Storing testimonial submission in mock DB:", dbErr?.message || dbErr);
      const testimonial = mockDb.createTestimonial(data);
      return NextResponse.json({
        success: true,
        testimonial,
        source: "mock_db",
        fallbackMode: true,
        dbError: dbErr?.message || String(dbErr),
      });
    }
  } catch (error: any) {
    console.error("General error in POST /api/testimonials:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to submit testimonial" },
      { status: 500 }
    );
  }
}
