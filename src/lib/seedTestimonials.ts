import { db } from "@/lib/db";
import { INITIAL_TESTIMONIALS } from "@/lib/testimonialsData";

export async function ensureTestimonialsSeeded() {
  try {
    const count = await db.testimonial.count();
    if (count >= INITIAL_TESTIMONIALS.length) {
      return;
    }

    const existing = await db.testimonial.findMany({
      select: { quote: true },
    });
    const existingQuotes = new Set(existing.map((e) => e.quote.trim()));

    for (const item of INITIAL_TESTIMONIALS) {
      if (!existingQuotes.has(item.quote.trim())) {
        await db.testimonial.create({
          data: {
            name: item.name,
            role: item.role,
            quote: item.quote,
            rating: item.rating,
            approved: true,
            createdAt: new Date(item.createdAt),
          },
        });
      }
    }
    console.log("Successfully synchronized testimonials with database.");
  } catch (err: any) {
    console.warn("Database auto-seed skipped or encountered issue:", err?.message || err);
  }
}
