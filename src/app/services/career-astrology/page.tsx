import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Briefcase, TrendingUp, CheckCircle2, ShieldCheck, Clock, Globe, ArrowRight, HelpCircle, Coins, Award } from "lucide-react";

const siteUrl = "https://astroshubhamchhabra.com";
const pageUrl = `${siteUrl}/services/career-astrology`;

export const metadata: Metadata = {
  title: "Career Astrology Consultation & Wealth Forecast | Shubham Chhabra",
  description:
    "Expert Career & Financial Vedic Astrology reading by Shubham Chhabra. 10th House Karma Bhava & D10 Dasamsa analysis, job change timing, business vs. employment, and wealth remedies for seekers in USA, Canada, and India.",
  keywords: [
    "career astrology consultation",
    "job change astrology",
    "business astrology reading",
    "Vedic career horoscope",
    "10th house Dasamsa career analysis",
    "financial astrology consultation USA",
    "career astrology Canada",
    "promotions and job switch timing",
    "wealth yoga astrology remedies",
    "Shubham Chhabra career astrologer",
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
    title: "Career & Wealth Astrology Consultation | AstroShubham",
    description:
      "Unlock your professional potential with personalized 10th house analysis, job change timing, and business strategy on Google Meet with Shubham Chhabra.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Career Astrology Consultation by Shubham Chhabra" }],
  },
};

const FAQS = [
  {
    q: "How does Vedic astrology identify the best career path or industry for me?",
    a: "Shubham analyzes your 10th house of career (Karma Bhava), the Amatyakaraka planet, your D10 Dasamsa divisional chart, and dominant planetary elements (Fire for leadership, Earth for finance/operations, Air for tech/communication, Water for creative/healing professions).",
  },
  {
    q: "Can astrology predict the right time to change jobs or start a business?",
    a: "Yes. Planetary Dasha periods (Mahadasha & Antardasha) along with transits of Jupiter, Saturn, and Rahu pinpoint exact favorable windows for successful job changes, promotions, salary renegotiations, or launching entrepreneurial ventures.",
  },
  {
    q: "What if I am facing office politics or persistent career stagnation?",
    a: "Stagnation or sudden hostility at work is often caused by afflicted Sun (authority issues), Saturn (delays), or Rahu (confusion). Shubham provides focused Lal Kitab behavioral and environmental remedies to restore authority, confidence, and smooth workplace dynamics.",
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
        { "@type": "ListItem", "position": 3, "name": "Career Astrology", "item": pageUrl },
      ],
    },
    {
      "@type": "Service",
      "name": "Career & Financial Astrology Consultation",
      "provider": {
        "@type": "Person",
        "name": "Shubham Chhabra",
        "url": siteUrl,
      },
      "serviceType": "Vedic & Lal Kitab Astrology",
      "areaServed": [
        { "@type": "Country", "name": "United States" },
        { "@type": "Country", "name": "Canada" },
        { "@type": "Country", "name": "India" },
      ],
      "description":
        "Detailed Vedic birth chart reading focused on 10th house (Karma Bhava), 2nd & 11th wealth houses, D10 Dasamsa divisional chart, job switch timing, promotion forecasts, and practical business remedies.",
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

const CAREER_PILLARS = [
  {
    icon: Award,
    title: "10th House & D10 Dasamsa",
    desc: "Examine your highest career calling, leadership potential, reputation, and public standing in society.",
  },
  {
    icon: Coins,
    title: "2nd & 11th Houses (Wealth & Gains)",
    desc: "Diagnose money flow (Dhana Yogas), identify active income streams, and eliminate hidden financial leaks.",
  },
  {
    icon: TrendingUp,
    title: "Dasha & Transit Timing",
    desc: "Calculate auspicious timing for job switches, promotions, corporate interviews, or relocating for work.",
  },
  {
    icon: Briefcase,
    title: "Job vs. Business & Startup Suitability",
    desc: "Determine whether steady corporate employment (6th house) or entrepreneurship (7th & 10th houses) will bring higher wealth and fulfillment.",
  },
];

export default function CareerAstrologyPage() {
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
            <span style={{ color: "var(--text-secondary)" }}>Career Astrology</span>
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
              <Briefcase size={16} />
              <span>Vedic Career Blueprint & Wealth Forecast</span>
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
              Career Astrology & <br />
              <span className="gold-text-gradient">Financial Growth Consultation</span>
            </h1>

            <p
              style={{
                fontSize: "clamp(1.05rem, 2vw, 1.25rem)",
                color: "var(--text-secondary)",
                lineHeight: 1.6,
                marginBottom: "2rem",
              }}
            >
              Gain complete clarity on your career path, timing for job transitions, promotion cycles, business investments, and practical Lal Kitab remedies to remove workplace roadblocks with <strong>Shubham Chhabra</strong>.
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
                <span>Book Career Blueprint Session</span>
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
                <span>Read Client Success Stories</span>
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
                <span style={{ fontSize: "0.9rem" }}>45-Min Private Session</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", justifyContent: "center" }}>
                <Globe size={20} style={{ color: "var(--gold-primary)" }} />
                <span style={{ fontSize: "0.9rem" }}>Global NRI & India Timezones</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", justifyContent: "center" }}>
                <ShieldCheck size={20} style={{ color: "var(--gold-primary)" }} />
                <span style={{ fontSize: "0.9rem" }}>Actionable Career Remedies</span>
              </div>
            </div>
          </div>
        </section>

        {/* 4 PILLARS OF CAREER ASTROLOGY */}
        <section className="container" style={{ marginBottom: "5rem" }}>
          <div style={{ maxWidth: "900px", margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "3rem" }}>
              <h2 style={{ fontFamily: "var(--font-outfit)", fontSize: "2.1rem", fontWeight: 700, marginBottom: "0.75rem" }}>
                Comprehensive <span className="gold-text-gradient">Career Chart Analysis</span>
              </h2>
              <p style={{ color: "var(--text-secondary)", fontSize: "1.05rem" }}>
                How Vedic astrology decodes your Karma Bhava, wealth capacity, and professional timing.
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.25rem" }}>
              {CAREER_PILLARS.map((pillar, idx) => {
                const IconComponent = pillar.icon;
                return (
                  <div
                    key={idx}
                    style={{
                      padding: "1.75rem",
                      borderRadius: "14px",
                      background: "rgba(255, 255, 255, 0.02)",
                      border: "1px solid var(--border-color)",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.6rem" }}>
                      <IconComponent size={20} style={{ color: "var(--gold-primary)" }} />
                      <h3 style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--text-primary)" }}>
                        {pillar.title}
                      </h3>
                    </div>
                    <p style={{ color: "var(--text-secondary)", fontSize: "0.92rem", lineHeight: 1.5 }}>
                      {pillar.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* QUESTIONS ANSWERED */}
        <section className="container" style={{ marginBottom: "5rem" }}>
          <div style={{ maxWidth: "900px", margin: "0 auto" }}>
            <h2 style={{ fontFamily: "var(--font-outfit)", fontSize: "2rem", fontWeight: 700, textAlign: "center", marginBottom: "2.5rem" }}>
              Key Career Questions We Answer in Your Session
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: "1.25rem" }}>
              {[
                "When is the most auspicious time to switch jobs or negotiate a hike?",
                "Will I succeed more in a corporate job or through my own business?",
                "Are there overseas job opportunities (US, Canada, UK, Europe) in my chart?",
                "Which specific industry aligns best with my natural planetary strengths?",
                "How to resolve conflicts with seniors, boss, or workplace politics?",
                "What simple Lal Kitab remedies can unlock stuck wealth and delayed promotions?",
              ].map((q, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: "1.25rem 1.5rem",
                    borderRadius: "12px",
                    background: "rgba(255, 255, 255, 0.02)",
                    border: "1px solid var(--border-color)",
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                  }}
                >
                  <HelpCircle size={22} style={{ color: "var(--gold-primary)", flexShrink: 0 }} />
                  <span style={{ fontSize: "0.98rem", color: "var(--text-primary)", lineHeight: 1.4 }}>{q}</span>
                </div>
              ))}
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
              Step Confidently into Your Professional Future
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem", maxWidth: "600px", margin: "0 auto 2rem auto" }}>
              Book your private 1-on-1 Career Blueprint consultation with Shubham Chhabra on Google Meet.
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
              <span>Schedule Career Consultation</span>
              <ArrowRight size={20} />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
