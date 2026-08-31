"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Star, Quote, Sparkles, CheckCircle2, AlertCircle } from "lucide-react";
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

function StarPicker({ rating, onChange }: { rating: number; onChange: (value: number) => void }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div style={{ display: "flex", gap: "0.3rem" }} onMouseLeave={() => setHovered(0)}>
      {Array.from({ length: 5 }).map((_, i) => {
        const value = i + 1;
        const filled = value <= (hovered || rating);
        return (
          <motion.button
            key={value}
            type="button"
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            onMouseEnter={() => setHovered(value)}
            onClick={() => onChange(value)}
            aria-label={`Rate ${value} out of 5 stars`}
            style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex" }}
          >
            <Star size={26} fill={filled ? "var(--gold-primary)" : "none"} color={filled ? "var(--gold-primary)" : "var(--border-focus)"} />
          </motion.button>
        );
      })}
    </div>
  );
}

const initialFormState = { name: "", role: "", quote: "", rating: 0 };

export default function Testimonials() {
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
          setTestimonials(data.testimonials);
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
        ) : testimonials.length === 0 ? null : (
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            variants={staggerContainer(0.12)}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "1.5rem",
              marginBottom: "4rem",
            }}
          >
            {testimonials.map((t) => (
              <motion.div
                key={t.id}
                variants={fadeUp}
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                className="glass-card hover-lift"
                style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
              >
                <Quote size={22} style={{ color: "var(--gold-primary)", opacity: 0.5 }} />
                <p style={{ fontSize: "0.92rem", flexGrow: 1 }}>&ldquo;{t.quote}&rdquo;</p>
                <StarRating rating={t.rating} />
                <div>
                  <div style={{ fontWeight: 600, color: "var(--text-primary)", fontSize: "0.95rem" }}>{t.name}</div>
                  <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>{t.role}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Share Your Experience */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={fadeUp}
          className="glass-card"
          style={{ maxWidth: "640px", margin: "0 auto", padding: "2.5rem 2rem" }}
        >
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem", padding: "1rem 0" }}
            >
              <CheckCircle2 size={40} style={{ color: "var(--gold-primary)" }} />
              <h3 style={{ color: "var(--text-primary)" }}>Thank you for sharing!</h3>
              <p style={{ fontSize: "0.9rem", maxWidth: "420px" }}>
                Your review has been successfully published and is now live below!
              </p>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setSubmitted(false)}
                className="btn btn-secondary"
                style={{ fontSize: "0.85rem", padding: "0.5rem 1.2rem" }}
              >
                Submit Another
              </motion.button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmitTestimonial} className="form-container">
              <h3 style={{ textAlign: "center", marginBottom: "0.25rem", color: "var(--text-primary)" }}>Share Your Experience</h3>
              <p style={{ textAlign: "center", fontSize: "0.88rem", marginBottom: "0.5rem" }}>
                Had a consultation with Shubham? Let others know how it went.
              </p>

              {submitError && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    background: "rgba(239, 68, 68, 0.08)",
                    border: "1px solid rgba(239, 68, 68, 0.25)",
                    padding: "0.7rem 1rem",
                    borderRadius: "8px",
                    color: "#dc2626",
                    fontSize: "0.85rem",
                  }}
                >
                  <AlertCircle size={16} />
                  <span>{submitError}</span>
                </div>
              )}

              <div className="form-group" style={{ alignItems: "center" }}>
                <label className="form-label">Your Rating *</label>
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
                    placeholder="Priya Sharma"
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
                    placeholder="Marriage Consultation"
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
                  placeholder="Tell us about your session..."
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
                style={{ alignSelf: "center", padding: "0.7rem 2rem", opacity: submitting ? 0.7 : 1, cursor: submitting ? "not-allowed" : "pointer" }}
              >
                {submitting ? "Submitting..." : "Submit Testimonial"}
              </motion.button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}
