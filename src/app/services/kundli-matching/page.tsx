import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Heart, Star, CheckCircle2, ShieldCheck, Clock, Globe, ArrowRight, HelpCircle, Sparkles } from "lucide-react";

const siteUrl = "https://astroshubhamchhabra.com";
const pageUrl = `${siteUrl}/services/kundli-matching`;

export const metadata: Metadata = {
  title: "Online Kundli Matching for Marriage | Gun Milan & Compatibility Analysis",
  description:
    "Expert Vedic & Lal Kitab Kundli Matching (Gun Milan) by Shubham Chhabra. Comprehensive 36 Guna analysis, Manglik Dosha remedies, Bhakoot & Nadi compatibility for seekers in the USA, Canada, and India.",
  keywords: [
    "Kundli matching online",
    "Gun Milan for marriage",
    "Kundli matching for NRI USA",
    "Kundli matching Canada",
    "Kundali Milan Shubham Chhabra",
    "Manglik Dosha remedies for marriage",
    "Bhakoot Dosha remedies",
    "Nadi Dosha cancellation",
    "horoscope matching for marriage",
    "Ashtakoot Milan online consultation",
    "Vedic marriage compatibility reading",
    "Lal Kitab marriage remedies",
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
    title: "Online Kundli Matching & Gun Milan Consultation | AstroShubham",
    description:
      "Get complete clarity on marriage compatibility, 36 Guna matching, Manglik dosha, and practical relationship remedies on Google Meet with Shubham Chhabra.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Online Kundli Matching by Shubham Chhabra" }],
  },
};

const FAQS = [
  {
    q: "How does online Kundli matching work for partners in different countries (e.g. USA, Canada, India)?",
    a: "Shubham Chhabra analyzes the exact birth time, date, and city coordinates of both partners to cast precise Lagna, Navamsha (D9), and Moon charts. The consultation is conducted via a private 60-minute Google Meet session with flexible timezone slots.",
  },
  {
    q: "What if our Gun Milan score is below 18 points?",
    a: "A low Ashtakoot score is not an automatic dealbreaker. Real Vedic astrology prioritizes 7th house strength, Jupiter/Venus placement, and planetary friendships over mathematical points alone. Shubham provides deep analysis and customized non-commercial remedies to neutralize afflictions.",
  },
  {
    q: "Can Manglik Dosha be cancelled or cured without expensive rituals?",
    a: "Yes. Mars dosha often has natural astrological cancellations based on Mars positioning, Saturn aspects, or sign placement. When remedies are needed, practical Lal Kitab planetary lifestyle adjustments are provided without recommending expensive gemstones.",
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
        { "@type": "ListItem", "position": 3, "name": "Kundli Matching", "item": pageUrl },
      ],
    },
    {
      "@type": "Service",
      "name": "Online Kundli Matching & Marriage Compatibility Consultation",
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
        "In-depth double-chart Vedic Kundli matching covering 36 Ashtakoot Guna Milan, Manglik Dosha, Venus placements, and practical Lal Kitab harmony remedies conducted 1-on-1 on Google Meet.",
      "offers": {
        "@type": "Offer",
        "price": "40",
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

const GUN_MILAN_FACTORS = [
  { name: "Varna (1 Point)", desc: "Spiritual compatibility, mutual ego alignment, and intellectual resonance." },
  { name: "Vashya (2 Points)", desc: "Mutual attraction, influence, and relationship balance of power." },
  { name: "Tara (3 Points)", desc: "Destiny alignment, longevity, and mutual health well-being." },
  { name: "Yoni (4 Points)", desc: "Intimacy compatibility, emotional bonding, and instinctive mutual attraction." },
  { name: "Graha Maitri (5 Points)", desc: "Planetary friendship, mental compatibility, and daily communication harmony." },
  { name: "Gana (6 Points)", desc: "Temperamental nature matching (Deva, Manushya, Rakshasa)." },
  { name: "Bhakoot (7 Points)", desc: "Emotional depth, family growth, financial welfare, and mutual prosperity." },
  { name: "Nadi (8 Points)", desc: "Genetic resonance, future progeny health, and nervous system harmony." },
];

export default function KundliMatchingPage() {
  return (
    <>
      <Header />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main style={{ minHeight: "100vh", paddingTop: "110px", paddingBottom: "80px" }}>
        {/* Breadcrumb Navigation */}
        <div className="container" style={{ marginBottom: "2rem" }}>
          <nav aria-label="Breadcrumb" style={{ display: "flex", gap: "0.5rem", fontSize: "0.88rem", color: "var(--text-muted)" }}>
            <Link href="/" style={{ color: "var(--gold-primary)", textDecoration: "none" }}>Home</Link>
            <span>/</span>
            <Link href="/#services" style={{ color: "var(--gold-primary)", textDecoration: "none" }}>Services</Link>
            <span>/</span>
            <span style={{ color: "var(--text-secondary)" }}>Kundli Matching</span>
          </nav>
        </div>

        {/* HERO SECTION */}
        <section className="container" style={{ marginBottom: "4rem" }}>
          <div style={{ maxWidth: "860px", margin: "0 auto", textAlign: "center" }}>
            <div className="hero-badge" style={{ marginBottom: "1.25rem" }}>
              <Heart size={14} />
              <span>Vedic & Lal Kitab Marriage Compatibility</span>
            </div>

            <h1
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(2.2rem, 5vw, 3.4rem)",
                fontWeight: 600,
                lineHeight: 1.18,
                marginBottom: "1.25rem",
                letterSpacing: "-0.02em",
                color: "var(--text-primary)",
              }}
            >
              Online Kundli Matching & <br />
              <span className="gradient-text">Gun Milan Consultation</span>
            </h1>

            <p
              style={{
                fontSize: "clamp(1.05rem, 2vw, 1.2rem)",
                color: "var(--text-secondary)",
                lineHeight: 1.7,
                marginBottom: "2rem",
                maxWidth: "760px",
                margin: "0 auto 2rem auto",
              }}
            >
              Beyond automated computer scores. Connect 1-on-1 with <strong>Shubham Chhabra</strong> on Google Meet for deep double-chart analysis, 36 Ashtakoot points, Manglik Dosha evaluation, and practical remedies for lasting marital harmony.
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "1rem", marginBottom: "2.5rem" }}>
              <Link
                href="/#book"
                className="btn btn-primary"
                style={{
                  padding: "0.85rem 2.2rem",
                  fontSize: "1rem",
                  fontWeight: 600,
                }}
              >
                <span>Book Couple Match Session</span>
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/reviews"
                className="btn btn-secondary"
                style={{
                  padding: "0.85rem 2rem",
                  fontSize: "1rem",
                  fontWeight: 500,
                }}
              >
                <span>Read Client Reviews</span>
              </Link>
            </div>

            {/* Trust Badges */}
            <div
              className="glass-card"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "1.5rem",
                padding: "1.5rem 2rem",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", justifyContent: "center" }}>
                <Clock size={20} style={{ color: "var(--gold-primary)" }} />
                <span style={{ fontSize: "0.95rem", fontWeight: 500, color: "var(--text-primary)" }}>60-Min Private Video Call</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", justifyContent: "center" }}>
                <Globe size={20} style={{ color: "var(--gold-primary)" }} />
                <span style={{ fontSize: "0.95rem", fontWeight: 500, color: "var(--text-primary)" }}>USA, Canada & India Timezones</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", justifyContent: "center" }}>
                <ShieldCheck size={20} style={{ color: "var(--gold-primary)" }} />
                <span style={{ fontSize: "0.95rem", fontWeight: 500, color: "var(--text-primary)" }}>100% Confidential Charts</span>
              </div>
            </div>
          </div>
        </section>

        {/* 36 GUNA MILAN DEEP DIVE */}
        <section className="container" style={{ marginBottom: "5rem" }}>
          <div style={{ maxWidth: "960px", margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "3rem" }}>
              <div className="section-eyebrow">Compatibility Breakdown</div>
              <h2 style={{ fontSize: "2.1rem", fontWeight: 600, marginBottom: "0.75rem" }}>
                The 8 Pillars of <span className="gradient-text">Ashtakoot Milan (36 Gunas)</span>
              </h2>
              <p style={{ color: "var(--text-secondary)", fontSize: "1.05rem", maxWidth: "650px", margin: "0 auto" }}>
                How Vedic astrology evaluates the 8 distinct dimensions of compatibility between prospective life partners.
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.25rem" }}>
              {GUN_MILAN_FACTORS.map((factor, idx) => (
                <div
                  key={idx}
                  className="glass-card hover-lift"
                  style={{
                    padding: "1.5rem",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                    <Sparkles size={16} style={{ color: "var(--gold-primary)" }} />
                    <h3 style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--text-primary)" }}>
                      {factor.name}
                    </h3>
                  </div>
                  <p style={{ color: "var(--text-secondary)", fontSize: "0.92rem", lineHeight: 1.6 }}>
                    {factor.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* WHY COMPUTER MATCHING IS INCOMPLETE */}
        <section className="container" style={{ marginBottom: "5rem" }}>
          <div
            className="glass-card"
            style={{
              maxWidth: "960px",
              margin: "0 auto",
              padding: "2.5rem 3rem",
              background: "linear-gradient(135deg, #ffffff 0%, #fffbf0 100%)",
              border: "1px solid rgba(217, 119, 6, 0.25)",
            }}
          >
            <h2 style={{ fontSize: "1.85rem", fontWeight: 600, marginBottom: "1rem", textAlign: "left" }}>
              Why Online Automated Scores Are Often Misleading
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "1.02rem", lineHeight: 1.7, marginBottom: "1.75rem" }}>
              Free automated websites only calculate basic Moon signs and often declare <em>Nadi Dosha</em> or <em>Manglik Dosha</em> without analyzing critical Vedic cancellation rules (Nadi Parikaran), 7th house lord planetary strength, Navamsha (D9) longevity, and Venus alignments.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.25rem" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
                <CheckCircle2 size={20} style={{ color: "var(--gold-primary)", flexShrink: 0, marginTop: "2px" }} />
                <span style={{ fontSize: "0.95rem", color: "var(--text-primary)", lineHeight: 1.5 }}>
                  <strong>Real Cancellations:</strong> Over 70% of Manglik & Nadi doshas have natural Vedic nullifications.
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
                <CheckCircle2 size={20} style={{ color: "var(--gold-primary)", flexShrink: 0, marginTop: "2px" }} />
                <span style={{ fontSize: "0.95rem", color: "var(--text-primary)", lineHeight: 1.5 }}>
                  <strong>Navamsha D9 Verification:</strong> Examining marital fruitfulness and future emotional bond.
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
                <CheckCircle2 size={20} style={{ color: "var(--gold-primary)", flexShrink: 0, marginTop: "2px" }} />
                <span style={{ fontSize: "0.95rem", color: "var(--text-primary)", lineHeight: 1.5 }}>
                  <strong>Practical Lal Kitab Remedies:</strong> Simple home & lifestyle adjustments instead of costly gems.
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* QUESTIONS ANSWERED IN THIS SESSION */}
        <section className="container" style={{ marginBottom: "5rem" }}>
          <div style={{ maxWidth: "960px", margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
              <div className="section-eyebrow">Session Scope</div>
              <h2 style={{ fontSize: "2rem", fontWeight: 600, marginBottom: "0.75rem" }}>
                Key Questions Answered During Your <span className="gradient-text">60-Min Consultation</span>
              </h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: "1.25rem" }}>
              {[
                "Are our core astrological placements supportive for long-term marriage?",
                "Is there Manglik Dosha in either chart, and is it cancelled or harmful?",
                "How will mutual communication, ego dynamics, and financial prosperity unfold?",
                "What is the prospective marriage timeline and favorable Muhurat period?",
                "How to resolve family or in-law adjustment concerns using Lal Kitab?",
                "What non-commercial remedies can strengthen planetary harmony between us?",
              ].map((q, idx) => (
                <div
                  key={idx}
                  className="glass-card hover-lift"
                  style={{
                    padding: "1.25rem 1.5rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                  }}
                >
                  <HelpCircle size={22} style={{ color: "var(--gold-primary)", flexShrink: 0 }} />
                  <span style={{ fontSize: "0.98rem", color: "var(--text-primary)", lineHeight: 1.5, fontWeight: 400 }}>{q}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ SECTION */}
        <section className="container" style={{ marginBottom: "5rem" }}>
          <div style={{ maxWidth: "860px", margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
              <div className="section-eyebrow">Got Questions?</div>
              <h2 style={{ fontSize: "2rem", fontWeight: 600 }}>
                Frequently Asked Questions
              </h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {FAQS.map((item, idx) => (
                <div
                  key={idx}
                  className="glass-card"
                  style={{
                    padding: "1.75rem 2rem",
                  }}
                >
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--gold-primary)", marginBottom: "0.6rem" }}>
                    {item.q}
                  </h3>
                  <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", lineHeight: 1.7 }}>
                    {item.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FINAL CTA BANNER */}
        <section className="container">
          <div
            style={{
              maxWidth: "860px",
              margin: "0 auto",
              textAlign: "center",
              padding: "3.5rem 2.5rem",
              borderRadius: "24px",
              background: "linear-gradient(135deg, #fffbf0 0%, #fff7e0 50%, #fef3c7 100%)",
              border: "1px solid rgba(217, 119, 6, 0.3)",
              boxShadow: "0 20px 50px -12px rgba(217, 119, 6, 0.18)",
            }}
          >
            <h2 style={{ fontSize: "2.2rem", fontWeight: 700, marginBottom: "1rem", color: "var(--text-primary)" }}>
              Get Clear, Honest Guidance on Your Match
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem", maxWidth: "620px", margin: "0 auto 2rem auto", lineHeight: 1.6 }}>
              Book your private 60-minute double-chart video consultation with Shubham Chhabra today.
            </p>
            <Link
              href="/#book"
              className="btn btn-primary"
              style={{
                padding: "0.9rem 2.5rem",
                fontSize: "1.05rem",
                fontWeight: 600,
              }}
            >
              <span>Schedule Couple Consultation</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
