import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Sparkles, CheckCircle2, ShieldCheck, Clock, Globe, ArrowRight, HelpCircle, BookOpen, Compass, ShieldAlert } from "lucide-react";

const siteUrl = "https://astroshubhamchhabra.com";
const pageUrl = `${siteUrl}/services/lal-kitab-remedies`;

export const metadata: Metadata = {
  title: "Lal Kitab Remedies & Astrological Consultation | Practical Guidance by Shubham Chhabra",
  description:
    "Discover authentic, practical Lal Kitab astrology remedies without expensive gemstones or commercial rituals. 1-on-1 private video consultations with Shubham Chhabra for clients in USA, Canada, and India.",
  keywords: [
    "Lal Kitab remedies",
    "Lal Kitab astrologer online",
    "Lal Kitab remedies without gemstones",
    "Lal Kitab specialist USA Canada",
    "Lal Kitab horoscope analysis",
    "Lal Kitab Varshphal reading",
    "Rahu Ketu Lal Kitab remedies",
    "Pitra Dosha Lal Kitab",
    "planetary debt remedies Rin",
    "practical astrology remedies Shubham Chhabra",
  ],
  alternates: {
    canonical: pageUrl,
    languages: {
      "en-US": `${pageUrl}?cur=USD`,
      "en-CA": `${pageUrl}?cur=CAD`,
      "en-IN": `${pageUrl}?cur=INR`,
      "x-default": pageUrl,
    },
  },
  openGraph: {
    type: "article",
    url: pageUrl,
    title: "Lal Kitab Astrology Remedies & Consultation | AstroShubham",
    description:
      "Honest, practical, and effective planetary remedies without commercial rituals. Book a 1-on-1 Lal Kitab session on Google Meet with Shubham Chhabra.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Lal Kitab Remedies Consultation by Shubham Chhabra" }],
  },
};

const FAQS = [
  {
    q: "How are Lal Kitab remedies different from traditional gemstone recommendations?",
    a: "Lal Kitab is famous for simplicity, precision, and zero commercial exploitation. Instead of selling thousands of dollars in precious gemstones or elaborate rituals, Lal Kitab modifies environmental vibrations and behaviors—such as serving elders, birds, or specific charity items that pacify malefic planets.",
  },
  {
    q: "What is Lal Kitab Varshphal (Yearly Reading)?",
    a: "Every year on your birthday, your planetary houses rotate into a specific annual horoscope (Varshphal). Shubham analyzes the active planets of your running year to forecast career milestones, financial shifts, and prescribe timely remedies before difficulties arise.",
  },
  {
    q: "Can Lal Kitab remedies be performed if I live abroad in the USA or Canada?",
    a: "Yes! Shubham adapts all Lal Kitab remedies to your local environment. Modern, practical adaptations are tailored specifically for NRI seekers living in apartments or western countries where traditional items may not be accessible.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": siteUrl },
        { "@type": "ListItem", "position": 2, "name": "Services", "item": `${siteUrl}/#services` },
        { "@type": "ListItem", "position": 3, "name": "Lal Kitab Remedies", "item": pageUrl },
      ],
    },
    {
      "@type": "Service",
      "name": "Lal Kitab Astrology & Practical Remedies Consultation",
      "provider": {
        "@type": "Person",
        "name": "Shubham Chhabra",
        "url": siteUrl,
      },
      "serviceType": "Lal Kitab & Vedic Astrology",
      "areaServed": [
        { "@type": "Country", "name": "United States" },
        { "@type": "Country", "name": "Canada" },
        { "@type": "Country", "name": "India" },
      ],
      "description":
        "Personalized Lal Kitab horoscope reading, Varshphal (yearly chart) analysis, planetary debt diagnosis, and practical home-based remedies that require zero costly stones or commercial pujas.",
      "offers": {
        "@type": "Offer",
        "price": "25",
        "priceCurrency": "USD",
        "url": `${siteUrl}/#book`,
        "availability": "https://schema.org/InStock",
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "reviewCount": "154",
      },
    },
    {
      "@type": "FAQPage",
      "mainEntity": FAQS.map((faq) => ({
        "@type": "Question",
        "name": faq.q,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.a,
        },
      })),
    },
  ],
};

const LAL_KITAB_PRINCIPLES = [
  {
    title: "1. No Expensive Gemstones",
    desc: "Gemstones can amplify malefic energy if prescribed incorrectly. Lal Kitab utilizes safe, peaceful remedies that never cause harm.",
  },
  {
    title: "2. Karma & Behavioral Alignment",
    desc: "Align your daily habits, respect for elders, honesty in transactions, and speech tone to activate benefic houses.",
  },
  {
    title: "3. Environmental Harmony (Dharmic Totke)",
    desc: "Using everyday elements (water, copper, brass, feeding birds/animals) to pacify afflictions of Rahu, Ketu, and Saturn.",
  },
  {
    title: "4. Ancestral Debt (Rin) Clearance",
    desc: "Identify whether unresolved Pitra Rin, Matru Rin, or Swa Rin are causing persistent blockages in career and health.",
  },
];

export default function LalKitabRemediesPage() {
  return (
    <>
      <Header />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main style={{ minHeight: "100vh", paddingTop: "110px", paddingBottom: "80px" }}>
        {/* Breadcrumb */}
        <div className="container" style={{ marginBottom: "2rem" }}>
          <nav aria-label="Breadcrumb" style={{ display: "flex", gap: "0.5rem", fontSize: "0.88rem", color: "var(--text-muted)" }}>
            <Link href="/" style={{ color: "var(--gold-primary)", textDecoration: "none" }}>Home</Link>
            <span>/</span>
            <Link href="/#services" style={{ color: "var(--gold-primary)", textDecoration: "none" }}>Services</Link>
            <span>/</span>
            <span style={{ color: "var(--text-secondary)" }}>Lal Kitab Remedies</span>
          </nav>
        </div>

        {/* HERO SECTION */}
        <section className="container" style={{ marginBottom: "4rem" }}>
          <div style={{ maxWidth: "860px", margin: "0 auto", textAlign: "center" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.4rem 1rem",
                borderRadius: "999px",
                background: "rgba(234, 179, 8, 0.12)",
                border: "1px solid rgba(234, 179, 8, 0.3)",
                color: "var(--gold-primary)",
                fontSize: "0.85rem",
                fontWeight: 600,
                marginBottom: "1.25rem",
              }}
            >
              <Sparkles size={16} />
              <span>Authentic, Non-Commercial Astrology</span>
            </div>

            <h1
              style={{
                fontFamily: "var(--font-outfit)",
                fontSize: "clamp(2.2rem, 5vw, 3.4rem)",
                fontWeight: 700,
                lineHeight: 1.15,
                marginBottom: "1.25rem",
                letterSpacing: "-0.02em",
              }}
            >
              Practical Lal Kitab Remedies & <br />
              <span className="gold-text-gradient">Planetary Alignment</span>
            </h1>

            <p
              style={{
                fontSize: "clamp(1.05rem, 2vw, 1.25rem)",
                color: "var(--text-secondary)",
                lineHeight: 1.6,
                marginBottom: "2rem",
              }}
            >
              Experience the clarity of true Lal Kitab astrology. Get customized, easy-to-follow planetary remedies for career, financial stability, health, and relationship peace without buying costly gemstones or paying for commercial rituals.
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "1rem", marginBottom: "2.5rem" }}>
              <Link
                href="/#book"
                className="btn-primary"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.9rem 2rem",
                  fontSize: "1.05rem",
                  fontWeight: 600,
                  textDecoration: "none",
                  borderRadius: "12px",
                }}
              >
                <span>Book 45-Min Consultation</span>
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/reviews"
                className="btn-secondary"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.9rem 1.8rem",
                  fontSize: "1.05rem",
                  fontWeight: 500,
                  textDecoration: "none",
                  borderRadius: "12px",
                }}
              >
                <span>Verified Client Reviews</span>
              </Link>
            </div>

            {/* Trust Badges */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "1rem",
                padding: "1.5rem",
                borderRadius: "16px",
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid var(--border-color)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", justifyContent: "center" }}>
                <Clock size={20} style={{ color: "var(--gold-primary)" }} />
                <span style={{ fontSize: "0.9rem" }}>45-Min Video Consultation</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", justifyContent: "center" }}>
                <Globe size={20} style={{ color: "var(--gold-primary)" }} />
                <span style={{ fontSize: "0.9rem" }}>NRI & Local Adapted Remedies</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", justifyContent: "center" }}>
                <ShieldCheck size={20} style={{ color: "var(--gold-primary)" }} />
                <span style={{ fontSize: "0.9rem" }}>Zero Up-selling or Gems</span>
              </div>
            </div>
          </div>
        </section>

        {/* CORE PRINCIPLES */}
        <section className="container" style={{ marginBottom: "5rem" }}>
          <div style={{ maxWidth: "900px", margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "3rem" }}>
              <h2 style={{ fontFamily: "var(--font-outfit)", fontSize: "2.1rem", fontWeight: 700, marginBottom: "0.75rem" }}>
                The 4 Pillars of <span className="gold-text-gradient">Pure Lal Kitab Astrology</span>
              </h2>
              <p style={{ color: "var(--text-secondary)", fontSize: "1.05rem" }}>
                Why Lal Kitab remains one of the most practical and respected branches of ancient Indian astrology.
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.25rem" }}>
              {LAL_KITAB_PRINCIPLES.map((principle, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: "1.75rem",
                    borderRadius: "14px",
                    background: "rgba(255, 255, 255, 0.02)",
                    border: "1px solid var(--border-color)",
                  }}
                >
                  <h3 style={{ fontSize: "1.15rem", fontWeight: 600, color: "var(--gold-primary)", marginBottom: "0.6rem" }}>
                    {principle.title}
                  </h3>
                  <p style={{ color: "var(--text-secondary)", fontSize: "0.92rem", lineHeight: 1.5 }}>
                    {principle.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* COMMON AFFLICTIONS RESOLVED */}
        <section className="container" style={{ marginBottom: "5rem" }}>
          <div
            style={{
              maxWidth: "900px",
              margin: "0 auto",
              padding: "2.5rem",
              borderRadius: "20px",
              background: "linear-gradient(135deg, rgba(234, 179, 8, 0.08) 0%, rgba(20, 15, 5, 0.8) 100%)",
              border: "1px solid rgba(234, 179, 8, 0.3)",
            }}
          >
            <h2 style={{ fontFamily: "var(--font-outfit)", fontSize: "1.85rem", fontWeight: 700, marginBottom: "1rem" }}>
              Common Astrological Afflictions We Resolve
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.25rem" }}>
              <div>
                <h4 style={{ color: "var(--gold-primary)", fontSize: "1.05rem", fontWeight: 600, marginBottom: "0.4rem" }}>
                  🪐 Rahu & Ketu Turbulence
                </h4>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: 1.5 }}>
                  Overcoming sudden losses, recurring anxiety, illusion, misunderstandings, and deceptive partnerships.
                </p>
              </div>
              <div>
                <h4 style={{ color: "var(--gold-primary)", fontSize: "1.05rem", fontWeight: 600, marginBottom: "0.4rem" }}>
                  ⚖️ Saturn (Shani) Delays
                </h4>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: 1.5 }}>
                  Smoothing Sade Sati and Dhaiya periods, eliminating hard-work blockages, and career stagnation.
                </p>
              </div>
              <div>
                <h4 style={{ color: "var(--gold-primary)", fontSize: "1.05rem", fontWeight: 600, marginBottom: "0.4rem" }}>
                  🌳 Pitra Dosha (Ancestral Patterns)
                </h4>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: 1.5 }}>
                  Clearing inherited financial bottlenecks, relationship turmoil, and bringing prosperity to the family lineage.
                </p>
              </div>
              <div>
                <h4 style={{ color: "var(--gold-primary)", fontSize: "1.05rem", fontWeight: 600, marginBottom: "0.4rem" }}>
                  💰 Daridra Yoga & Debt Cycles
                </h4>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: 1.5 }}>
                  Unblocking money inflow, recovering stuck funds, and establishing steady financial abundance.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ SECTION */}
        <section className="container" style={{ marginBottom: "5rem" }}>
          <div style={{ maxWidth: "800px", margin: "0 auto" }}>
            <h2 style={{ fontFamily: "var(--font-outfit)", fontSize: "2rem", fontWeight: 700, textAlign: "center", marginBottom: "2.5rem" }}>
              Frequently Asked Questions
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {FAQS.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: "1.5rem 1.75rem",
                    borderRadius: "14px",
                    background: "rgba(255, 255, 255, 0.02)",
                    border: "1px solid var(--border-color)",
                  }}
                >
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--gold-primary)", marginBottom: "0.6rem" }}>
                    {item.q}
                  </h3>
                  <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", lineHeight: 1.6 }}>
                    {item.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="container">
          <div
            style={{
              maxWidth: "800px",
              margin: "0 auto",
              textAlign: "center",
              padding: "3.5rem 2rem",
              borderRadius: "24px",
              background: "radial-gradient(circle at center, rgba(234, 179, 8, 0.15) 0%, rgba(10, 8, 3, 0.95) 100%)",
              border: "1px solid rgba(234, 179, 8, 0.35)",
            }}
          >
            <h2 style={{ fontFamily: "var(--font-outfit)", fontSize: "2.2rem", fontWeight: 700, marginBottom: "1rem" }}>
              Align Your Stars with Practical Guidance
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem", maxWidth: "600px", margin: "0 auto 2rem auto" }}>
              Schedule a 1-on-1 private video consultation with Shubham Chhabra on Google Meet.
            </p>
            <Link
              href="/#book"
              className="btn-primary"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "1rem 2.5rem",
                fontSize: "1.1rem",
                fontWeight: 600,
                textDecoration: "none",
                borderRadius: "12px",
              }}
            >
              <span>Book General Session</span>
              <ArrowRight size={20} />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
