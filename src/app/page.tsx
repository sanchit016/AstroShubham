"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BookingWidget from "@/components/BookingWidget";
import Testimonials from "@/components/Testimonials";
import { Sparkles, Heart, Briefcase, Users, Activity, ChevronRight, HelpCircle, Star, Globe, Clock, ShieldCheck } from "lucide-react";
import { fadeUp, fadeIn, scaleIn, staggerContainer, viewportOnce } from "@/lib/motion";
import { getPackage, formatPrice, type CurrencyCode } from "@/lib/pricing";
import { useCurrency } from "@/lib/useCurrency";

const GUIDANCE_CATEGORIES = [
  {
    icon: Heart,
    title: "Marriage & Love Life",
    description:
      "Identify alignments in your 7th house, analyze marital compatibility (Gun Milan), detect Manglik or Venus placement issues, and forecast love life timelines.",
    questions: [
      "When will I get married?",
      "How will my partner be?",
      "Are we astrologically compatible?",
      "Remedies for delayed marriage?",
    ],
    cta: { action: "Book Couple Session", pkg: "marriage" },
    guideLink: { href: "/services/kundli-matching", label: "Explore Gun Milan Guide" },
  },
  {
    icon: Briefcase,
    title: "Career & Wealth",
    description:
      "Map out your professional choices using the 10th house blueprint. Understand whether jobs or businesses suit you, detect wealth blockages (Daridra Yoga), and time promotions.",
    questions: [
      "When is a good time to switch jobs?",
      "Should I do job or self-business?",
      "Which field will bring me the most wealth?",
      "Remedies for career obstacles?",
    ],
    cta: { action: "Book Session", pkg: "general" },
    guideLink: { href: "/services/career-astrology", label: "Explore Career Guide" },
  },
  {
    icon: Users,
    title: "Family & Ancestry",
    description:
      "Analyze family harmony, parent-child dynamics, inheritance, property concerns, and clear negative patterns like Pitra Dosha.",
    questions: [
      "How can I improve relationship with my family?",
      "Are there ancestral blockages (Pitra Dosha)?",
      "When will family property disputes resolve?",
      "Remedies for peace at home?",
    ],
    cta: { action: "Book Session", pkg: "general" },
    guideLink: { href: "/services/lal-kitab-remedies", label: "Explore Lal Kitab Remedies" },
  },
  {
    icon: Activity,
    title: "Health & Energy",
    description:
      "Understand your physical constitution (Lagna & Sun health parameters) and detect weak planetary transits (e.g. Rahu/Saturn) affecting mental peace or energy.",
    questions: [
      "Which planets are causing weak health?",
      "When will my mental stress and anxiety reduce?",
      "What astrological remedies support physical vitality?",
      "Timing of health recovery?",
    ],
    cta: { action: "Book Session", pkg: "general" },
    guideLink: { href: "/services/lal-kitab-remedies", label: "Explore Planetary Remedies" },
  },
];

function getFaqItems(currency: CurrencyCode) {
  const generalPrice = formatPrice(getPackage("general"), currency);
  const marriagePrice = formatPrice(getPackage("marriage"), currency);

  return [
    {
      q: "How do online astrology sessions work for clients in the USA, Canada, and India?",
      a: (
        <>
          All consultations are conducted 1-on-1 via private <strong>Google Meet video calls</strong>. When you select a date, the booking calendar automatically converts and displays available slots in your local timezone (e.g. <strong>US Pacific PST, US Eastern EST, Canada EST/PST, or India IST</strong>). Upon booking, a Google Calendar invite with a dedicated Google Meet link is instantly emailed to you.
        </>
      ),
      plainText:
        "All consultations are conducted 1-on-1 via private Google Meet video calls. The booking calendar automatically displays available slots in your local timezone (US Pacific PST, US Eastern EST, Canada EST/PST, or India IST), and a Google Meet link is sent to your email immediately upon booking.",
    },
    {
      q: "What is the difference between the plans?",
      a: (
        <>
          The <strong>General Plan ({generalPrice})</strong> is a comprehensive 45-minute individual reading where you can ask Shubham any number of questions regarding career, wealth, health, or life path. The <strong>Couple/Matching Plan ({marriagePrice})</strong> is a 60-minute double-chart reading specifically optimized for marriage matching (Ashtakoot Gun Milan), Manglik analysis, and relationship harmony for two profiles.
        </>
      ),
      plainText: `The General Plan (${generalPrice}) is a comprehensive 45-minute individual reading where you can ask any number of questions regarding career, wealth, health, or life path. The Couple/Matching Plan (${marriagePrice}) is a 60-minute double-chart reading specifically optimized for marriage matching (Ashtakoot Gun Milan), Manglik analysis, and relationship harmony for two profiles.`,
    },
    {
      q: "Which payment options are supported for international (USD/CAD) and Indian (INR) clients?",
      a: (
        <>
          Clients in the <strong>United States and Canada</strong> can pay securely in <strong>USD ($) or CAD (CA$)</strong> via <strong>PayPal</strong> (Credit/Debit Cards, PayPal Balance). Clients in <strong>India</strong> can pay in <strong>INR (₹)</strong> seamlessly via <strong>Razorpay</strong> (UPI, Google Pay, PhonePe, Paytm, Net Banking, and Cards).
        </>
      ),
      plainText:
        "Clients in the USA and Canada can pay in USD or CAD via PayPal (Credit/Debit Cards, PayPal Balance). Clients in India can pay in INR seamlessly via Razorpay (UPI, Google Pay, PhonePe, Net Banking, and Cards).",
    },
    {
      q: "What birth details are required for an accurate horoscope & Lal Kitab reading?",
      a: "You will need to provide your exact Birth Date, Birth Time (as precise as possible), and Birth Place (City & Country). For couple compatibility readings, birth parameters for both partners are required.",
      plainText:
        "You will need to provide your exact Birth Date, Birth Time (as precise as possible), and Birth Place (City & Country). For couple compatibility readings, birth parameters for both partners are required.",
    },
    {
      q: "Can I consult for family members or prospective marriage proposals abroad?",
      a: "Yes. Many NRI clients in the USA and Canada consult Shubham for family members living in India or prospective marriage matches located in different time zones. You can discuss multiple charts within your scheduled consultation.",
      plainText:
        "Yes. Many NRI clients in the USA and Canada consult Shubham for family members living in India or prospective marriage matches located in different time zones. You can discuss multiple charts within your scheduled consultation.",
    },
    {
      q: "Can I change my scheduled slot later?",
      a: "Yes, you can request a reschedule up to 24 hours in advance by replying to your confirmation email or contacting astroshubhamchhabra@gmail.com.",
      plainText:
        "Yes, you can request a reschedule up to 24 hours in advance by replying to your confirmation email or contacting astroshubhamchhabra@gmail.com.",
    },
  ];
}

export default function Home() {
  // Auto-detected from the visitor's locale/timezone (shared with BookingWidget) — no manual selector.
  const currency = useCurrency();
  const faqItems = getFaqItems(currency);
  const generalPrice = formatPrice(getPackage("general"), currency);
  const marriagePrice = formatPrice(getPackage("marriage"), currency);

  const handleBookClick = (pkgId: string) => {
    window.dispatchEvent(new CustomEvent("select-package", { detail: pkgId }));
    const element = document.getElementById("book");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <Header />

      <main>
        {/* HERO SECTION */}
        <section aria-label="Hero" className="hero" style={{ minHeight: "90vh", display: "flex", alignItems: "center", padding: "120px 0 60px 0" }}>
          <div className="nebula-glow-1" />
          <motion.div
            className="container hero-grid"
            initial="hidden"
            animate="show"
            variants={staggerContainer(0.14, 0.1)}
          >
            <div className="hero-content" style={{ gap: "1rem" }}>
              <motion.div className="hero-badge" variants={fadeUp} style={{ padding: "0.3rem 0.8rem", fontSize: "0.8rem" }}>
                <Sparkles size={12} />
                <span>Vedic & Lal Kitab Astrologer – USA, Canada & India</span>
              </motion.div>
              <motion.h1 variants={fadeUp} style={{ fontSize: "clamp(2.2rem, 4.5vw, 4rem)", lineHeight: 1.15 }}>
                Clarity for <span className="gradient-text">Your Life&apos;s Journey</span>
              </motion.h1>
              <motion.p variants={fadeUp} style={{ fontSize: "1.1rem", maxWidth: "550px", color: "var(--text-secondary)" }}>
                Get clear, practical, and honest Vedic guidance from Shubham Chhabra. 1-on-1 private video consultations on Google Meet for seekers across the United States, Canada, India, and worldwide.
              </motion.p>

              <motion.div variants={fadeUp} style={{ margin: "1rem 0", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", fontSize: "1.05rem", color: "var(--gold-primary)" }}>
                  <Star size={16} fill="var(--gold-primary)" />
                  <span><strong>General Plan: {generalPrice} | Couple/Matching: {marriagePrice}</strong></span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", fontSize: "0.92rem", color: "var(--stellar-cyan)" }}>
                  <Globe size={15} />
                  <span>Slots auto-converted to your timezone (IST, PST, EST, CST) • Unlimited questions</span>
                </div>
              </motion.div>

              <motion.div className="hero-cta-group" variants={fadeUp} style={{ gap: "1rem" }}>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleBookClick("general")}
                  className="btn btn-primary"
                  style={{ fontSize: "0.95rem", padding: "0.75rem 1.8rem", cursor: "pointer" }}
                >
                  Book Session
                </motion.button>
                <motion.a
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  href="#services"
                  className="btn btn-secondary"
                  style={{ fontSize: "0.95rem", padding: "0.75rem 1.8rem" }}
                >
                  What You Can Ask
                </motion.a>
              </motion.div>
            </div>

            <motion.div
              className="hero-visual"
              variants={scaleIn}
              animate={{ y: [0, -14, 0] }}
              transition={{ y: { duration: 6, repeat: Infinity, ease: "easeInOut" } }}
            >
              <svg width="340" height="340" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ opacity: 0.85 }}>
                {/* Concentric Orbits */}
                <g className="orbit-spin">
                  <circle cx="50" cy="50" r="45" stroke="rgba(180, 150, 50, 0.12)" strokeWidth="0.5" />
                  <circle cx="50" cy="50" r="25" stroke="rgba(180, 150, 50, 0.12)" strokeWidth="0.5" />
                </g>
                <g className="orbit-spin-reverse">
                  <circle cx="50" cy="50" r="35" stroke="rgba(180, 150, 50, 0.08)" strokeWidth="0.5" strokeDasharray="2 2" />
                  <circle cx="50" cy="50" r="12" stroke="rgba(180, 150, 50, 0.08)" strokeWidth="0.5" strokeDasharray="1 1" />
                </g>

                {/* Crosshairs */}
                <line x1="50" y1="2" x2="50" y2="98" stroke="rgba(180, 150, 50, 0.06)" strokeWidth="0.3" />
                <line x1="2" y1="50" x2="98" y2="50" stroke="rgba(180, 150, 50, 0.06)" strokeWidth="0.3" />

                {/* Diagonal rays */}
                <line x1="18.2" y1="18.2" x2="81.8" y2="81.8" stroke="rgba(180, 150, 50, 0.04)" strokeWidth="0.3" />
                <line x1="18.2" y1="81.8" x2="81.8" y2="18.2" stroke="rgba(180, 150, 50, 0.04)" strokeWidth="0.3" />

                {/* Constellation 1 */}
                <g className="orbit-spin">
                  <path d="M50 20 L65 28 L72 45" stroke="rgba(217, 119, 6, 0.3)" strokeWidth="0.4" strokeDasharray="1 1" />
                  <circle cx="50" cy="20" r="1" fill="#d97706" />
                  <circle cx="65" cy="28" r="0.8" fill="#d97706" opacity="0.8" />
                  <circle cx="72" cy="45" r="1.2" fill="#92400e" />
                </g>

                {/* Constellation 2 */}
                <g className="orbit-spin-reverse">
                  <path d="M28 65 L35 75 L50 80" stroke="rgba(217, 119, 6, 0.2)" strokeWidth="0.3" />
                  <circle cx="28" cy="65" r="0.8" fill="#92400e" opacity="0.6" />
                  <circle cx="35" cy="75" r="1" fill="#92400e" />
                  <circle cx="50" cy="80" r="0.7" fill="#d97706" />
                </g>

                {/* Center Star */}
                <path d="M50 46 L51.2 48.8 L54 50 L51.2 51.2 L50 54 L48.8 51.2 L46 50 L48.8 48.8 Z" fill="rgba(217, 119, 6, 0.7)" />
                <circle cx="50" cy="50" r="5" stroke="rgba(217, 119, 6, 0.35)" strokeWidth="0.4" />
              </svg>
            </motion.div>
          </motion.div>
        </section>

        {/* GUIDANCE CATEGORIES SECTION */}
        <section id="services" className="section" style={{ padding: "6rem 0" }}>
          <div className="container" style={{ maxWidth: "900px" }}>
            <motion.h2
              initial="hidden"
              whileInView="show"
              viewport={viewportOnce}
              variants={fadeUp}
              style={{ fontSize: "2rem", marginBottom: "3rem" }}
            >
              What You Can Ask
            </motion.h2>

            <motion.div
              className="guidance-list"
              initial="hidden"
              whileInView="show"
              viewport={viewportOnce}
              variants={staggerContainer(0.15)}
            >
              {GUIDANCE_CATEGORIES.map((category, idx) => {
                const Icon = category.icon;
                return (
                  <div key={category.title}>
                    <motion.div className="guidance-item" variants={fadeUp}>
                      <div className="guidance-icon">
                        <Icon size={30} />
                      </div>
                      <div>
                        <h3 style={{ fontSize: "1.4rem", color: "var(--gold-primary)", marginBottom: "0.8rem" }}>{category.title}</h3>
                        <p style={{ fontSize: "1rem", color: "var(--text-secondary)", marginBottom: "1.2rem" }}>
                          {category.description}
                        </p>
                        <div className="guidance-details">
                          {category.questions.map((question) => (
                            <div key={question} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                              <ChevronRight size={14} style={{ color: "var(--stellar-cyan)" }} />
                              <span>{question}</span>
                            </div>
                          ))}
                        </div>
                        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "1rem", marginTop: "1rem" }}>
                          <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => handleBookClick(category.cta.pkg)}
                            className="btn btn-secondary"
                            style={{ padding: "0.5rem 1.2rem", fontSize: "0.85rem", cursor: "pointer" }}
                          >
                            {category.cta.action} ({formatPrice(getPackage(category.cta.pkg), currency)})
                          </motion.button>
                          {category.guideLink && (
                            <Link
                              href={category.guideLink.href}
                              style={{
                                color: "var(--gold-primary)",
                                fontSize: "0.88rem",
                                fontWeight: 500,
                                textDecoration: "none",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "0.25rem",
                              }}
                            >
                              <span>{category.guideLink.label}</span>
                              <ChevronRight size={14} />
                            </Link>
                          )}
                        </div>
                      </div>
                    </motion.div>
                    {idx < GUIDANCE_CATEGORIES.length - 1 && (
                      <hr style={{ border: "none", borderTop: "1px solid rgba(180, 150, 50, 0.12)", margin: "3.5rem 0 0" }} />
                    )}
                  </div>
                );
              })}
            </motion.div>
          </div>
        </section>

        {/* BOOKING SECTION (3RD) */}
        <section id="book" aria-label="Book a consultation" className="section" style={{ padding: "6rem 0" }}>
          <div className="container">
            <motion.h2
              initial="hidden"
              whileInView="show"
              viewport={viewportOnce}
              variants={fadeUp}
              style={{ fontSize: "2rem", marginBottom: "3rem" }}
            >
              Schedule Consultation
            </motion.h2>
            <motion.div initial="hidden" whileInView="show" viewport={viewportOnce} variants={fadeIn}>
              <BookingWidget />
            </motion.div>
          </div>
        </section>

        {/* ABOUT SECTION (4TH) */}
        <section id="about" aria-label="About Shubham Chhabra" className="section" style={{ background: "rgba(248, 243, 227, 0.6)", padding: "6rem 0" }}>
          <div className="nebula-glow-2" />
          <div className="container" style={{ maxWidth: "700px" }}>
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={viewportOnce}
              variants={staggerContainer(0.12)}
              style={{ display: "flex", flexDirection: "column", gap: "1.2rem", textAlign: "center" }}
            >
              <motion.h2 variants={fadeUp} style={{ margin: 0 }}>
                Meet Shubham Chhabra
              </motion.h2>
              <motion.p variants={fadeUp} style={{ fontSize: "1rem" }}>
                With over a decade of dedication to the study of ancient Vedic scriptures and Lal Kitab remedies, Shubham bridges traditional astrological wisdom with modern life choices. He specializes in providing rational, actionable advice without fear-mongering.
              </motion.p>
              <motion.p variants={fadeUp} style={{ fontSize: "1rem" }}>
                His consultations are focused on identifying root planetary alignments and providing simple, non-superstitious remedies (Lal Kitab adjustments, lifestyle alignment, and charity coordinates) to harmonize planetary coordinates.
              </motion.p>
              <motion.p variants={fadeUp} style={{ fontSize: "0.95rem", color: "var(--text-muted)", fontStyle: "italic" }}>
                &ldquo;Astrology is a cosmic compass, not a binding script. The stars show the tides, but you sail the ship.&rdquo;
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* TESTIMONIALS SECTION (5TH) */}
        <Testimonials />

        {/* FAQ SECTION */}
        <section id="faq" aria-label="Frequently Asked Questions" className="section" style={{ background: "rgba(248, 243, 227, 0.6)", padding: "6rem 0" }}>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "FAQPage",
                mainEntity: faqItems.map((item) => ({
                  "@type": "Question",
                  name: item.q,
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: item.plainText,
                  },
                })),
              }),
            }}
          />
          <div className="container" style={{ maxWidth: "750px" }}>
            <motion.h2
              initial="hidden"
              whileInView="show"
              viewport={viewportOnce}
              variants={fadeUp}
              style={{ fontSize: "2rem", marginBottom: "3rem" }}
            >
              Frequently Asked Questions
            </motion.h2>
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={viewportOnce}
              variants={staggerContainer(0.1)}
              style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}
            >
              {faqItems.map((item) => (
                <motion.div key={item.q} variants={fadeUp} className="glass-card hover-lift" style={{ padding: "1.5rem" }}>
                  <h4 style={{ display: "flex", alignItems: "center", gap: "0.6rem", color: "var(--gold-primary)", marginBottom: "0.4rem", fontSize: "1.05rem" }}>
                    <HelpCircle size={16} style={{ color: "var(--stellar-cyan)" }} />
                    {item.q}
                  </h4>
                  <p style={{ fontSize: "0.95rem" }}>{item.a}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
