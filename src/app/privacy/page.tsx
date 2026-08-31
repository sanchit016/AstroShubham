import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { ArrowLeft, Lock } from "lucide-react";

export const metadata = {
  title: "Privacy Policy | AstroShubham",
  description: "Privacy policy and client data confidentiality commitment for AstroShubham / Chhabra Astrology.",
  alternates: {
    canonical: "https://astroshubhamchhabra.com/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="container" style={{ paddingTop: "7rem", paddingBottom: "5rem", maxWidth: "850px" }}>
        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            color: "var(--gold-primary)",
            marginBottom: "2rem",
            fontSize: "0.9rem",
          }}
        >
          <ArrowLeft size={16} /> Back to Home
        </Link>

        <h1 style={{ fontSize: "2.2rem", marginBottom: "1rem", color: "var(--text-primary)" }}>Privacy Policy</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "2.5rem" }}>
          Last updated: August 2026
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "2rem", color: "var(--text-secondary)", lineHeight: "1.7" }}>
          <div
            style={{
              padding: "1.2rem 1.5rem",
              borderRadius: "var(--border-radius)",
              background: "rgba(255, 255, 255, 0.02)",
              border: "1px solid var(--border-color)",
              display: "flex",
              gap: "1rem",
              alignItems: "center",
            }}
          >
            <Lock size={22} style={{ color: "var(--gold-primary)", flexShrink: 0 }} />
            <p style={{ margin: 0, fontSize: "0.9rem", color: "var(--text-primary)" }}>
              We treat your birth charts, personal questions, and consultation conversations with 100% strict confidentiality.
            </p>
          </div>

          <section>
            <h2 style={{ fontSize: "1.3rem", color: "var(--text-primary)", marginBottom: "0.8rem" }}>1. Information We Collect</h2>
            <p>
              To calculate accurate planetary charts and conduct consultations, we collect:
            </p>
            <ul style={{ paddingLeft: "1.2rem", marginTop: "0.5rem", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              <li><strong>Personal Info:</strong> Full Name, Email Address, and Phone/WhatsApp number.</li>
              <li><strong>Astrological Parameters:</strong> Date of Birth, Exact Birth Time, City & Country of Birth, Gender.</li>
              <li><strong>Consultation Focus:</strong> Specific questions, notes, or background context shared prior to the session.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: "1.3rem", color: "var(--text-primary)", marginBottom: "0.8rem" }}>2. How Your Information Is Used</h2>
            <p>
              Your information is used strictly to generate astrological charts, schedule consultation slots on Google Calendar, deliver Google Meet video invitations, and correspond with you regarding your session. We never sell, rent, or trade your personal or birth information to any third party.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: "1.3rem", color: "var(--text-primary)", marginBottom: "0.8rem" }}>3. Payment Security</h2>
            <p>
              We do not store or process your credit card or financial details on our servers. All transactions are securely tokenized and handled directly by PayPal adhering to international PCI-DSS compliance standards.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: "1.3rem", color: "var(--text-primary)", marginBottom: "0.8rem" }}>4. Data Retention and Deletion</h2>
            <p>
              You may request complete deletion of your birth records and consultation notes at any time by contacting us at <strong>astroshubhamchhabra@gmail.com</strong>.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
