"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BookingWidget from "@/components/BookingWidget";
import { Compass, Sparkles, Heart, Briefcase, Users, Activity, ChevronRight, HelpCircle, Star } from "lucide-react";

export default function Home() {
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
          <div className="container hero-grid">
            <div className="hero-content" style={{ gap: "1rem" }}>
              <div className="hero-badge" style={{ padding: "0.3rem 0.8rem", fontSize: "0.8rem" }}>
                <Sparkles size={12} />
                <span>Vedic & Lal Kitab Astrology</span>
              </div>
              <h1 className="hero-title" style={{ fontSize: "clamp(2.2rem, 4.5vw, 4rem)", lineHeight: 1.15 }}>
                Clarity for Your Life's Journey
              </h1>
              <p className="hero-subtitle" style={{ fontSize: "1.1rem", maxWidth: "550px", color: "var(--text-secondary)" }}>
                Get clear, practical, and honest guidance from Shubham Chhabra. Plot your stars and find answers to all your concerns regarding career, relationships, and health.
              </p>
              
              <div style={{ margin: "1rem 0", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", fontSize: "1.05rem", color: "var(--gold-primary)" }}>
                  <Star size={16} fill="var(--gold-primary)" />
                  <span><strong>General Plan: $25 (₹1,999) | Couple/Matching: $40 (₹2,999)</strong></span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", fontSize: "0.95rem", color: "var(--stellar-cyan)" }}>
                  <Sparkles size={16} />
                  <span>Ask any number of questions. Direct Lal Kitab remedies.</span>
                </div>
              </div>

              <div className="hero-cta-group" style={{ gap: "1rem" }}>
                <button onClick={() => handleBookClick("general")} className="btn btn-primary" style={{ fontSize: "0.95rem", padding: "0.75rem 1.8rem", cursor: "pointer" }}>
                  Book Session
                </button>
                <a href="#services" className="btn btn-secondary" style={{ fontSize: "0.95rem", padding: "0.75rem 1.8rem" }}>
                  What You Can Ask
                </a>
              </div>
            </div>

            <div className="hero-visual">
              <svg width="340" height="340" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ opacity: 0.85 }}>
                {/* Concentric Orbits */}
                <circle cx="50" cy="50" r="45" stroke="rgba(180, 150, 50, 0.12)" strokeWidth="0.5" />
                <circle cx="50" cy="50" r="35" stroke="rgba(180, 150, 50, 0.08)" strokeWidth="0.5" strokeDasharray="2 2" />
                <circle cx="50" cy="50" r="25" stroke="rgba(180, 150, 50, 0.12)" strokeWidth="0.5" />
                <circle cx="50" cy="50" r="12" stroke="rgba(180, 150, 50, 0.08)" strokeWidth="0.5" strokeDasharray="1 1" />
                
                {/* Crosshairs */}
                <line x1="50" y1="2" x2="50" y2="98" stroke="rgba(180, 150, 50, 0.06)" strokeWidth="0.3" />
                <line x1="2" y1="50" x2="98" y2="50" stroke="rgba(180, 150, 50, 0.06)" strokeWidth="0.3" />
                
                {/* Diagonal rays */}
                <line x1="18.2" y1="18.2" x2="81.8" y2="81.8" stroke="rgba(180, 150, 50, 0.04)" strokeWidth="0.3" />
                <line x1="18.2" y1="81.8" x2="81.8" y2="18.2" stroke="rgba(180, 150, 50, 0.04)" strokeWidth="0.3" />
                
                {/* Constellation 1 */}
                <path d="M50 20 L65 28 L72 45" stroke="rgba(217, 119, 6, 0.3)" strokeWidth="0.4" strokeDasharray="1 1" />
                <circle cx="50" cy="20" r="1" fill="#d97706" />
                <circle cx="65" cy="28" r="0.8" fill="#d97706" opacity="0.8" />
                <circle cx="72" cy="45" r="1.2" fill="#92400e" />
                
                {/* Constellation 2 */}
                <path d="M28 65 L35 75 L50 80" stroke="rgba(217, 119, 6, 0.2)" strokeWidth="0.3" />
                <circle cx="28" cy="65" r="0.8" fill="#92400e" opacity="0.6" />
                <circle cx="35" cy="75" r="1" fill="#92400e" />
                <circle cx="50" cy="80" r="0.7" fill="#d97706" />
                
                {/* Center Star */}
                <path d="M50 46 L51.2 48.8 L54 50 L51.2 51.2 L50 54 L48.8 51.2 L46 50 L48.8 48.8 Z" fill="rgba(217, 119, 6, 0.7)" />
                <circle cx="50" cy="50" r="5" stroke="rgba(217, 119, 6, 0.35)" strokeWidth="0.4" />
              </svg>
            </div>
          </div>
        </section>

        {/* GUIDANCE CATEGORIES SECTION */}
        <section id="services" className="section" style={{ padding: "6rem 0" }}>
          <div className="container" style={{ maxWidth: "900px" }}>
            <h2 style={{ fontSize: "2rem", marginBottom: "3rem" }}>What You Can Ask</h2>
            
            <div className="guidance-list">
              
              {/* Category 1: Marriage & Lovelife */}
              <div className="guidance-item">
                <div
                  style={{
                    width: "70px",
                    height: "70px",
                    background: "rgba(217, 119, 6, 0.06)",
                    border: "1px solid rgba(217, 119, 6, 0.18)",
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--gold-primary)",
                  }}
                >
                  <Heart size={30} />
                </div>
                <div>
                  <h3 style={{ fontSize: "1.4rem", color: "var(--gold-primary)", marginBottom: "0.8rem" }}>Marriage & Love Life</h3>
                  <p style={{ fontSize: "1rem", color: "var(--text-secondary)", marginBottom: "1.2rem" }}>
                    Identify alignments in your 7th house, analyze marital compatibility (Gun Milan), detect Manglik or Venus placement issues, and forecast love life timelines.
                  </p>
                  <div className="guidance-details">
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <ChevronRight size={14} style={{ color: "var(--stellar-cyan)" }} />
                      <span>When will I get married?</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <ChevronRight size={14} style={{ color: "var(--stellar-cyan)" }} />
                      <span>How will my partner be?</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <ChevronRight size={14} style={{ color: "var(--stellar-cyan)" }} />
                      <span>Are we astrologically compatible?</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <ChevronRight size={14} style={{ color: "var(--stellar-cyan)" }} />
                      <span>Remedies for delayed marriage?</span>
                    </div>
                  </div>
                  <button onClick={() => handleBookClick("marriage")} className="btn btn-secondary" style={{ padding: "0.5rem 1.2rem", fontSize: "0.85rem", cursor: "pointer" }}>
                    Book Couple Session ($40)
                  </button>
                </div>
              </div>

              <hr style={{ border: "none", borderTop: "1px solid rgba(180, 150, 50, 0.12)" }} />

              {/* Category 2: Career & Business */}
              <div className="guidance-item">
                <div
                  style={{
                    width: "70px",
                    height: "70px",
                    background: "rgba(217, 119, 6, 0.06)",
                    border: "1px solid rgba(217, 119, 6, 0.18)",
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--gold-primary)",
                  }}
                >
                  <Briefcase size={30} />
                </div>
                <div>
                  <h3 style={{ fontSize: "1.4rem", color: "var(--gold-primary)", marginBottom: "0.8rem" }}>Career & Wealth</h3>
                  <p style={{ fontSize: "1rem", color: "var(--text-secondary)", marginBottom: "1.2rem" }}>
                    Map out your professional choices using the 10th house blueprint. Understand whether jobs or businesses suit you, detect wealth blockages (Daridra Yoga), and time promotions.
                  </p>
                  <div className="guidance-details">
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <ChevronRight size={14} style={{ color: "var(--stellar-cyan)" }} />
                      <span>When is a good time to switch jobs?</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <ChevronRight size={14} style={{ color: "var(--stellar-cyan)" }} />
                      <span>Should I do job or self-business?</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <ChevronRight size={14} style={{ color: "var(--stellar-cyan)" }} />
                      <span>Which field will bring me the most wealth?</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <ChevronRight size={14} style={{ color: "var(--stellar-cyan)" }} />
                      <span>Remedies for career obstacles?</span>
                    </div>
                  </div>
                  <button onClick={() => handleBookClick("general")} className="btn btn-secondary" style={{ padding: "0.5rem 1.2rem", fontSize: "0.85rem", cursor: "pointer" }}>
                    Book Session ($25)
                  </button>
                </div>
              </div>

              <hr style={{ border: "none", borderTop: "1px solid rgba(180, 150, 50, 0.12)" }} />

              {/* Category 3: Family & Relationships */}
              <div className="guidance-item">
                <div
                  style={{
                    width: "70px",
                    height: "70px",
                    background: "rgba(217, 119, 6, 0.06)",
                    border: "1px solid rgba(217, 119, 6, 0.18)",
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--gold-primary)",
                  }}
                >
                  <Users size={30} />
                </div>
                <div>
                  <h3 style={{ fontSize: "1.4rem", color: "var(--gold-primary)", marginBottom: "0.8rem" }}>Family & Ancestry</h3>
                  <p style={{ fontSize: "1rem", color: "var(--text-secondary)", marginBottom: "1.2rem" }}>
                    Analyze family harmony, parent-child dynamics, inheritance, property concerns, and clear negative patterns like Pitra Dosha.
                  </p>
                  <div className="guidance-details">
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <ChevronRight size={14} style={{ color: "var(--stellar-cyan)" }} />
                      <span>How can I improve relationship with my family?</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <ChevronRight size={14} style={{ color: "var(--stellar-cyan)" }} />
                      <span>Are there ancestral blockages (Pitra Dosha)?</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <ChevronRight size={14} style={{ color: "var(--stellar-cyan)" }} />
                      <span>When will family property disputes resolve?</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <ChevronRight size={14} style={{ color: "var(--stellar-cyan)" }} />
                      <span>Remedies for peace at home?</span>
                    </div>
                  </div>
                  <button onClick={() => handleBookClick("general")} className="btn btn-secondary" style={{ padding: "0.5rem 1.2rem", fontSize: "0.85rem", cursor: "pointer" }}>
                    Book Session ($25)
                  </button>
                </div>
              </div>

              <hr style={{ border: "none", borderTop: "1px solid rgba(180, 150, 50, 0.12)" }} />

              {/* Category 4: Health & Vitality */}
              <div className="guidance-item">
                <div
                  style={{
                    width: "70px",
                    height: "70px",
                    background: "rgba(217, 119, 6, 0.06)",
                    border: "1px solid rgba(217, 119, 6, 0.18)",
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--gold-primary)",
                  }}
                >
                  <Activity size={30} />
                </div>
                <div>
                  <h3 style={{ fontSize: "1.4rem", color: "var(--gold-primary)", marginBottom: "0.8rem" }}>Health & Energy</h3>
                  <p style={{ fontSize: "1rem", color: "var(--text-secondary)", marginBottom: "1.2rem" }}>
                    Understand your physical constitution (Lagna & Sun health parameters) and detect weak planetary transits (e.g. Rahu/Saturn) affecting mental peace or energy.
                  </p>
                  <div className="guidance-details">
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <ChevronRight size={14} style={{ color: "var(--stellar-cyan)" }} />
                      <span>Which planets are causing weak health?</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <ChevronRight size={14} style={{ color: "var(--stellar-cyan)" }} />
                      <span>When will my mental stress and anxiety reduce?</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <ChevronRight size={14} style={{ color: "var(--stellar-cyan)" }} />
                      <span>What astrological remedies support physical vitality?</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <ChevronRight size={14} style={{ color: "var(--stellar-cyan)" }} />
                      <span>Timing of health recovery?</span>
                    </div>
                  </div>
                  <button onClick={() => handleBookClick("general")} className="btn btn-secondary" style={{ padding: "0.5rem 1.2rem", fontSize: "0.85rem", cursor: "pointer" }}>
                    Book Session ($25)
                  </button>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ABOUT SECTION */}
        <section id="about" aria-label="About Shubham Chhabra" className="section" style={{ background: "rgba(248, 243, 227, 0.6)", padding: "6rem 0" }}>
          <div className="nebula-glow-2" />
          <div className="container about-grid">
            <div className="glass-card" style={{ padding: "0.5rem", overflow: "hidden", display: "flex", justifyContent: "center", alignItems: "center" }}>
              <img
                src="/shubham.jpg"
                alt="Shubham Chhabra"
                style={{
                  width: "100%",
                  height: "auto",
                  aspectRatio: "1/1",
                  objectFit: "cover",
                  borderRadius: "4px",
                  display: "block",
                }}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
              <h2 style={{ textTransform: "none", margin: 0, textAlign: "left", left: 0, transform: "none" }}>
                Meet Shubham Chhabra
              </h2>
              <p style={{ fontSize: "1rem" }}>
                With over a decade of dedication to the study of ancient Vedic scriptures and Lal Kitab remedies, Shubham bridges traditional astrological wisdom with modern life choices. He specializes in providing rational, actionable advice without fear-mongering.
              </p>
              <p style={{ fontSize: "1rem" }}>
                His consultations are focused on identifying root planetary alignments and providing simple, non-superstitious remedies (Lal Kitab adjustments, lifestyle alignment, and charity coordinates) to harmonize planetary coordinates.
              </p>
              <p style={{ fontSize: "0.95rem", color: "var(--text-muted)", fontStyle: "italic" }}>
                "Astrology is a cosmic compass, not a binding script. The stars show the tides, but you sail the ship."
              </p>
            </div>
          </div>
        </section>

        {/* BOOKING SECTION */}
        <section id="book" aria-label="Book a consultation" className="section" style={{ padding: "6rem 0" }}>
          <div className="container">
            <h2 style={{ fontSize: "2rem", marginBottom: "3rem" }}>Schedule Consultation</h2>
            <BookingWidget />
          </div>
        </section>

        {/* FAQ SECTION */}
        <section id="faq" aria-label="Frequently Asked Questions" className="section" style={{ background: "rgba(248, 243, 227, 0.6)", padding: "6rem 0" }}>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "FAQPage",
                mainEntity: [
                  {
                    "@type": "Question",
                    name: "What is the difference between the plans?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "The General Plan ($25 / ₹1,999) is for individual queries where you can ask any number of questions regarding career, health, or family. The Couple/Matching Plan ($40 / ₹2,999) is a double-chart reading specifically optimized for marriage matching (Gun Milan) and relationship consultation involving two profiles.",
                    },
                  },
                  {
                    "@type": "Question",
                    name: "What details are required for the session?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "You will need to provide your exact Birth Date, Birth Time, and Birth Place. For couple compatibility readings, providing birth parameters for both partners is recommended.",
                    },
                  },
                  {
                    "@type": "Question",
                    name: "How do the live consultations take place?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "Consultations are conducted online via Google Meet. A dynamic calendar invite and video link will be sent to your email address automatically upon scheduling.",
                    },
                  },
                  {
                    "@type": "Question",
                    name: "Can I change my scheduled slot later?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "Yes, you can request a reschedule up to 24 hours in advance by replying to your confirmation email or contacting support@astroshubham.com.",
                    },
                  },
                ],
              }),
            }}
          />
          <div className="container" style={{ maxWidth: "750px" }}>
            <h2 style={{ fontSize: "2rem", marginBottom: "3rem" }}>Frequently Asked Questions</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
              <div className="glass-card" style={{ padding: "1.5rem" }}>
                <h4 style={{ display: "flex", alignItems: "center", gap: "0.6rem", color: "var(--gold-primary)", marginBottom: "0.4rem", fontSize: "1.05rem" }}>
                  <HelpCircle size={16} style={{ color: "var(--stellar-cyan)" }} />
                  What is the difference between the plans?
                </h4>
                <p style={{ fontSize: "0.95rem" }}>
                  The <strong>General Plan ($25)</strong> is for individual queries where you can ask Shubham any number of questions regarding career, health, or family. The <strong>Couple/Matching Plan ($40)</strong> is a double-chart reading specifically optimized for marriage matching (Gun Milan) and relationship consultation involving two profiles.
                </p>
              </div>

              <div className="glass-card" style={{ padding: "1.5rem" }}>
                <h4 style={{ display: "flex", alignItems: "center", gap: "0.6rem", color: "var(--gold-primary)", marginBottom: "0.4rem", fontSize: "1.05rem" }}>
                  <HelpCircle size={16} style={{ color: "var(--stellar-cyan)" }} />
                  What details are required for the session?
                </h4>
                <p style={{ fontSize: "0.95rem" }}>
                  You will need to provide your exact Birth Date, Birth Time, and Birth Place. For couple compatibility readings, providing birth parameters for both partners is recommended.
                </p>
              </div>

              <div className="glass-card" style={{ padding: "1.5rem" }}>
                <h4 style={{ display: "flex", alignItems: "center", gap: "0.6rem", color: "var(--gold-primary)", marginBottom: "0.4rem", fontSize: "1.05rem" }}>
                  <HelpCircle size={16} style={{ color: "var(--stellar-cyan)" }} />
                  How do the live consultations take place?
                </h4>
                <p style={{ fontSize: "0.95rem" }}>
                  Consultations are conducted online via **Google Meet**. A dynamic calendar invite and video link will be sent to your email address automatically upon scheduling.
                </p>
              </div>

              <div className="glass-card" style={{ padding: "1.5rem" }}>
                <h4 style={{ display: "flex", alignItems: "center", gap: "0.6rem", color: "var(--gold-primary)", marginBottom: "0.4rem", fontSize: "1.05rem" }}>
                  <HelpCircle size={16} style={{ color: "var(--stellar-cyan)" }} />
                  Can I change my scheduled slot later?
                </h4>
                <p style={{ fontSize: "0.95rem" }}>
                  Yes, you can request a reschedule up to 24 hours in advance by replying to your confirmation email or contacting support@astroshubham.com.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
