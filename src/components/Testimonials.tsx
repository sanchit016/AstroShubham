import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Star, Quote, Sparkles, ArrowRight, MessageSquarePlus } from "lucide-react";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/motion";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  quote: string;
  rating: number;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div style={{ display: "flex", gap: "0.2rem" }} aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={15}
          fill={i < rating ? "var(--gold-primary)" : "none"}
          color={i < rating ? "var(--gold-primary)" : "var(--border-focus)"}
        />
      ))}
    </div>
  );
}

const MAX_HOMEPAGE_REVIEWS = 6;

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function loadTestimonials() {
      try {
        const res = await fetch("/api/testimonials");
        const data = await res.json();
        if (!cancelled && data.success) {
          setTestimonials(data.testimonials || []);
        }
      } catch (err) {
        console.error("Error fetching testimonials:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    loadTestimonials();
    return () => {
      cancelled = true;
    };
  }, []);

  const averageRating = testimonials.length
    ? (testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length).toFixed(1)
    : null;

  const displayedTestimonials = testimonials.slice(0, MAX_HOMEPAGE_REVIEWS);

  return (
    <section id="testimonials" aria-label="Client Testimonials" className="section">
      <div className="container">
        <motion.div
          style={{ textAlign: "center", maxWidth: "600px", margin: "0 auto 3.5rem" }}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={staggerContainer(0.1)}
        >
          <motion.span
            className="section-eyebrow"
            variants={fadeUp}
            style={{ justifyContent: "center", width: "100%", display: "flex" }}
          >
            <Sparkles size={12} />
            Trusted By Seekers Worldwide
          </motion.span>
          <motion.h2 variants={fadeUp} style={{ marginBottom: "0.75rem" }}>
            What <span className="gradient-text">Clients Say</span>
          </motion.h2>
          <motion.p variants={fadeUp} style={{ fontSize: "1rem" }}>
            Honest feedback from people who found clarity through their consultations with Shubham.
          </motion.p>
          {averageRating && (
            <motion.div
              variants={fadeUp}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.6rem",
                marginTop: "1.25rem",
                padding: "0.4rem 1rem",
                borderRadius: "999px",
                border: "1px solid var(--border-color)",
                background: "var(--bg-card)",
              }}
            >
              <StarRating rating={Math.round(Number(averageRating))} />
              <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                {averageRating} average from {testimonials.length}+ sessions
              </span>
            </motion.div>
          )}
        </motion.div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "2rem 0", color: "var(--text-secondary)", fontSize: "0.95rem" }}>
            Loading testimonials...
          </div>
        ) : testimonials.length === 0 ? (
          <div
            className="glass-card"
            style={{
              maxWidth: "550px",
              margin: "0 auto",
              padding: "2.5rem 2rem",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            <Quote size={28} style={{ color: "var(--gold-primary)", opacity: 0.5 }} />
            <h3 style={{ color: "var(--text-primary)", margin: 0 }}>Be the First to Review</h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", margin: 0 }}>
              Had a session with Shubham? Share your feedback with other seekers.
            </p>
            <Link href="/reviews#submit-review" className="btn btn-secondary" style={{ fontSize: "0.85rem", padding: "0.5rem 1.2rem", marginTop: "0.5rem" }}>
              <MessageSquarePlus size={15} /> Write a Review
            </Link>
          </div>
        ) : (
          <>
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={viewportOnce}
              variants={staggerContainer(0.12)}
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "1.5rem",
                marginBottom: "3rem",
              }}
            >
              {displayedTestimonials.map((t) => (
                <motion.div
                  key={t.id}
                  variants={fadeUp}
                  whileHover={{ y: -6 }}
                  transition={{ type: "spring", stiffness: 300, damping: 22 }}
                  className="glass-card hover-lift"
                  style={{ display: "flex", flexDirection: "column", gap: "1rem", padding: "1.8rem" }}
                >
                  <Quote size={22} style={{ color: "var(--gold-primary)", opacity: 0.5 }} />
                  <p style={{ fontSize: "0.92rem", flexGrow: 1, lineHeight: "1.6", color: "var(--text-secondary)" }}>
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <StarRating rating={t.rating} />
                  <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "0.6rem" }}>
                    <div style={{ fontWeight: 600, color: "var(--text-primary)", fontSize: "0.95rem" }}>{t.name}</div>
                    <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>{t.role || "Consultation Client"}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* View All Reviews / Show More CTA */}
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={viewportOnce}
              variants={fadeUp}
              style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap", marginTop: "1rem" }}
            >
              <Link href="/reviews" className="btn btn-primary" style={{ padding: "0.7rem 1.8rem", fontSize: "0.9rem" }}>
                View All Reviews ({testimonials.length}) <ArrowRight size={16} />
              </Link>
              <Link href="/reviews#submit-review" className="btn btn-secondary" style={{ padding: "0.7rem 1.5rem", fontSize: "0.9rem" }}>
                <MessageSquarePlus size={16} /> Write a Review
              </Link>
            </motion.div>
          </>
        )}
      </div>
    </section>
  );
}
