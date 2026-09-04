"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Star, Quote, Sparkles, CheckCircle2, AlertCircle, ArrowLeft, MessageSquarePlus } from "lucide-react";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/motion";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  quote: string;
  rating: number;
  createdAt: string;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div style={{ display: "flex", gap: "0.2rem" }} aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={16}
          fill={i < rating ? "var(--gold-primary)" : "none"}
          color={i < rating ? "var(--gold-primary)" : "var(--border-focus)"}
        />
      ))}
    </div>
  );
}

function StarPicker({ rating, onChange }: { rating: number; onChange: (value: number) => void }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div style={{ display: "flex", gap: "0.4rem" }} onMouseLeave={() => setHovered(0)}>
      {Array.from({ length: 5 }).map((_, i) => {
        const value = i + 1;
        const filled = value <= (hovered || rating);
        return (
          <motion.button
            key={value}
            type="button"
            whileHover={{ scale: 1.18 }}
            whileTap={{ scale: 0.9 }}
            onMouseEnter={() => setHovered(value)}
            onClick={() => onChange(value)}
            aria-label={`Rate ${value} out of 5 stars`}
            style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex" }}
          >
            <Star size={28} fill={filled ? "var(--gold-primary)" : "none"} color={filled ? "var(--gold-primary)" : "var(--border-focus)"} />
          </motion.button>
        );
      })}
    </div>
  );
}

const initialFormState = { name: "", role: "", quote: "", rating: 5 };

export default function ReviewsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState(initialFormState);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitted, setSubmitted] = useState(false);

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

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmitTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");

    if (!formData.name.trim() || !formData.quote.trim()) {
      setSubmitError("Please share your name and a few words about your session.");
      return;
    }
    if (formData.rating < 1) {
      setSubmitError("Please select a star rating.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setSubmitError(data.error || "Failed to submit your testimonial.");
        return;
      }
      if (data.testimonial) {
        setTestimonials((prev) => [data.testimonial, ...prev]);
      }
      setSubmitted(true);
      setFormData(initialFormState);
    } catch (err) {
      console.error("Error submitting testimonial:", err);
      setSubmitError("Connection error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Header />

      <main style={{ paddingTop: "7.5rem", paddingBottom: "6rem", minHeight: "80vh" }}>
        <div className="container">
          {/* Breadcrumb / Back Link */}
          <Link
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              color: "var(--gold-primary)",
              marginBottom: "2rem",
              fontSize: "0.9rem",
              fontWeight: 500,
            }}
          >
            <ArrowLeft size={16} /> Back to Home
          </Link>

          {/* Hero Header */}
          <motion.div
            style={{ textAlign: "center", maxWidth: "700px", margin: "0 auto 4rem" }}
            initial="hidden"
            animate="show"
            variants={staggerContainer(0.1)}
          >
            <motion.span className="section-eyebrow" variants={fadeUp} style={{ justifyContent: "center", width: "100%", display: "flex" }}>
              <Sparkles size={12} />
              Seeker Stories & Experiences
            </motion.span>
            <motion.h1 variants={fadeUp} style={{ fontSize: "clamp(2rem, 4vw, 3rem)", marginBottom: "0.75rem" }}>
              Client <span className="gradient-text">Reviews & Feedback</span>
            </motion.h1>
            <motion.p variants={fadeUp} style={{ fontSize: "1.05rem", color: "var(--text-secondary)" }}>
              Read genuine experiences from clients who sought astrological guidance from Shubham Chhabra, or share your own consultation story below.
            </motion.p>

            {averageRating && (
              <motion.div
                variants={fadeUp}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  marginTop: "1.5rem",
                  padding: "0.5rem 1.3rem",
                  borderRadius: "999px",
                  border: "1px solid var(--border-color)",
                  background: "var(--bg-card)",
                }}
              >
                <StarRating rating={Math.round(Number(averageRating))} />
                <span style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--text-primary)" }}>
                  {averageRating} out of 5
                </span>
                <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                  ({testimonials.length} {testimonials.length === 1 ? "review" : "reviews"})
                </span>
              </motion.div>
            )}

            <motion.div variants={fadeUp} style={{ marginTop: "2rem" }}>
              <a href="#submit-review" className="btn btn-secondary" style={{ fontSize: "0.9rem", padding: "0.6rem 1.4rem" }}>
                <MessageSquarePlus size={16} /> Write a Review
              </a>
            </motion.div>
          </motion.div>

          {/* Testimonials List / Grid */}
          {loading ? (
            <div style={{ textAlign: "center", padding: "4rem 0", color: "var(--text-secondary)", fontSize: "1rem" }}>
              Loading reviews...
            </div>
          ) : testimonials.length === 0 ? (
            <div
              className="glass-card"
              style={{
                maxWidth: "600px",
                margin: "0 auto 4rem",
                padding: "3rem 2rem",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "1rem",
              }}
            >
              <Quote size={32} style={{ color: "var(--gold-primary)", opacity: 0.4 }} />
              <h3 style={{ color: "var(--text-primary)" }}>No Reviews Yet</h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
                Be the first to share your consultation experience with Shubham!
              </p>
            </div>
          ) : (
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={viewportOnce}
              variants={staggerContainer(0.08)}
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "1.8rem",
                marginBottom: "5rem",
              }}
            >
              {testimonials.map((t) => (
                <motion.div
                  key={t.id}
                  variants={fadeUp}
                  whileHover={{ y: -6 }}
                  transition={{ type: "spring", stiffness: 300, damping: 22 }}
                  className="glass-card hover-lift"
                  style={{ display: "flex", flexDirection: "column", gap: "1rem", padding: "2rem" }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <Quote size={24} style={{ color: "var(--gold-primary)", opacity: 0.5 }} />
                    <StarRating rating={t.rating} />
                  </div>
                  <p style={{ fontSize: "0.95rem", flexGrow: 1, lineHeight: "1.6", color: "var(--text-secondary)" }}>
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "0.8rem" }}>
                    <div style={{ fontWeight: 600, color: "var(--text-primary)", fontSize: "1rem" }}>{t.name}</div>
                    <div style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>{t.role || "Consultation Client"}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Share Your Experience Section */}
          <section id="submit-review" style={{ scrollMarginTop: "100px" }}>
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={viewportOnce}
              variants={fadeUp}
              className="glass-card"
              style={{ maxWidth: "680px", margin: "0 auto", padding: "3rem 2.5rem" }}
            >
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "1.2rem", padding: "1.5rem 0" }}
                >
                  <CheckCircle2 size={48} style={{ color: "var(--gold-primary)" }} />
                  <h2 style={{ color: "var(--text-primary)", fontSize: "1.6rem" }}>Thank you for your review!</h2>
                  <p style={{ fontSize: "0.95rem", maxWidth: "460px", color: "var(--text-secondary)" }}>
                    Your experience has been successfully published and is now live on this page.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setSubmitted(false)}
                    className="btn btn-secondary"
                    style={{ fontSize: "0.9rem", padding: "0.6rem 1.5rem" }}
                  >
                    Submit Another Review
                  </motion.button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmitTestimonial} className="form-container">
                  <h2 style={{ textAlign: "center", marginBottom: "0.3rem", color: "var(--text-primary)", fontSize: "1.6rem" }}>
                    Share Your Experience
                  </h2>
                  <p style={{ textAlign: "center", fontSize: "0.92rem", marginBottom: "1.5rem", color: "var(--text-secondary)" }}>
                    Had a consultation with Shubham? Help others on their journey by leaving your feedback.
                  </p>

                  {submitError && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        background: "rgba(239, 68, 68, 0.08)",
                        border: "1px solid rgba(239, 68, 68, 0.25)",
                        padding: "0.75rem 1rem",
                        borderRadius: "8px",
                        color: "#dc2626",
                        fontSize: "0.88rem",
                      }}
                    >
                      <AlertCircle size={16} />
                      <span>{submitError}</span>
                    </div>
                  )}

                  <div className="form-group" style={{ alignItems: "center", marginBottom: "1.5rem" }}>
                    <label className="form-label" style={{ fontWeight: 600 }}>Your Rating *</label>
                    <StarPicker rating={formData.rating} onChange={(value) => setFormData((prev) => ({ ...prev, rating: value }))} />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Your Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleFormChange}
                        className="form-input"
                        placeholder="e.g. Priya Sharma"
                        maxLength={80}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Consultation Type</label>
                      <input
                        type="text"
                        name="role"
                        value={formData.role}
                        onChange={handleFormChange}
                        className="form-input"
                        placeholder="e.g. Marriage Consultation"
                        maxLength={80}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Your Experience *</label>
                    <textarea
                      name="quote"
                      value={formData.quote}
                      onChange={handleFormChange}
                      className="form-input"
                      placeholder="Share how the session helped you, the clarity you received, or the guidance provided..."
                      rows={4}
                      maxLength={600}
                      required
                      style={{ resize: "vertical", fontFamily: "var(--font-body)" }}
                    />
                  </div>

                  <motion.button
                    whileHover={{ scale: submitting ? 1 : 1.02 }}
                    whileTap={{ scale: submitting ? 1 : 0.98 }}
                    type="submit"
                    disabled={submitting}
                    className="btn btn-primary"
                    style={{ alignSelf: "center", padding: "0.75rem 2.5rem", fontSize: "0.95rem", opacity: submitting ? 0.7 : 1, cursor: submitting ? "not-allowed" : "pointer" }}
                  >
                    {submitting ? "Publishing Review..." : "Publish Review"}
                  </motion.button>
                </form>
              )}
            </motion.div>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}
