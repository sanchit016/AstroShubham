import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { ArrowLeft, ShieldAlert } from "lucide-react";

export const metadata = {
  title: "Terms & Conditions | AstroShubham",
  description: "Terms and conditions and Vedic consultation advisory disclaimer for AstroShubham / Chhabra Astrology.",
  alternates: {
    canonical: "https://astroshubhamchhabra.com/terms",
  },
};

export default function TermsPage() {
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

        <h1 style={{ fontSize: "2.2rem", marginBottom: "1rem", color: "var(--text-primary)" }}>Terms and Conditions</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "2.5rem" }}>
          Last updated: August 2026
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "2rem", color: "var(--text-secondary)", lineHeight: "1.7" }}>
          <div
            style={{
              padding: "1.2rem 1.5rem",
              borderRadius: "var(--border-radius)",
              background: "rgba(245, 158, 11, 0.05)",
              border: "1px solid rgba(245, 158, 11, 0.2)",
              display: "flex",
              gap: "1rem",
              alignItems: "flex-start",
            }}
          >
            <ShieldAlert size={24} style={{ color: "var(--gold-primary)", flexShrink: 0, marginTop: "0.2rem" }} />
            <div>
              <h3 style={{ color: "var(--text-primary)", fontSize: "1rem", marginBottom: "0.4rem" }}>
                Important Astrological Advisory Disclaimer
              </h3>
              <p style={{ fontSize: "0.88rem", margin: 0 }}>
                All consultations, natal chart readings, horoscopes, and remedial recommendations offered by AstroShubham (Chhabra Astrology) are provided for spiritual, philosophical, and personal guidance based on traditional Vedic and Lal Kitab principles. Astrological consultations do not constitute and should never substitute for professional legal, medical, psychological, or certified financial advice.
              </p>
            </div>
          </div>

          <section>
            <h2 style={{ fontSize: "1.3rem", color: "var(--text-primary)", marginBottom: "0.8rem" }}>1. Services Overview</h2>
            <p>
              AstroShubham provides 1-on-1 virtual astrology consultations and natal chart analysis conducted remotely via secure video links (e.g., Google Meet). Services are booked and scheduled online based on client-provided birth parameters (Date, Exact Time, and Place of Birth).
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: "1.3rem", color: "var(--text-primary)", marginBottom: "0.8rem" }}>2. Accuracy of Birth Information</h2>
            <p>
              Vedic astrological calculations depend heavily on precise birth data. The client is responsible for supplying the most accurate birth time, date, and location available. While we make every effort to rectify minor discrepancies, AstroShubham is not liable for inaccuracies resulting from erroneous client-submitted data.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: "1.3rem", color: "var(--text-primary)", marginBottom: "0.8rem" }}>3. Payments and Billing</h2>
            <p>
              All international consultations are processed securely in US Dollars (USD) or Canadian Dollars (CAD) via PayPal. Payment is required in full at the time of booking to reserve and lock your consultation slot.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: "1.3rem", color: "var(--text-primary)", marginBottom: "0.8rem" }}>4. Rescheduling and Cancellations</h2>
            <p>
              Clients may reschedule their scheduled appointment up to 24 hours before the session time at no additional charge. For detailed terms regarding refunds, please refer to our <Link href="/refund" style={{ color: "var(--gold-primary)" }}>Refund & Cancellation Policy</Link>.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: "1.3rem", color: "var(--text-primary)", marginBottom: "0.8rem" }}>5. Contact Information</h2>
            <p>
              For any questions regarding these Terms, please reach out directly to <strong>astroshubhamchhabra@gmail.com</strong>.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
