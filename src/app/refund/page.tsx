import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Refund & Cancellation Policy | AstroShubham",
  description: "Clear refund and rescheduling policies for AstroShubham / Chhabra Astrology consultations.",
  alternates: {
    canonical: "https://astroshubhamchhabra.com/refund",
  },
};

export default function RefundPage() {
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

        <h1 style={{ fontSize: "2.2rem", marginBottom: "1rem", color: "var(--text-primary)" }}>Refund & Cancellation Policy</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "2.5rem" }}>
          Last updated: August 2026
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "2rem", color: "var(--text-secondary)", lineHeight: "1.7" }}>
          <section>
            <h2 style={{ fontSize: "1.3rem", color: "var(--text-primary)", marginBottom: "0.8rem" }}>1. Rescheduling Policy</h2>
            <p>
              We understand that unforeseen events arise. You may reschedule your consultation appointment at no cost up to <strong>24 hours</strong> prior to your scheduled time by replying directly to your confirmation email or contacting <strong>astroshubhamchhabra@gmail.com</strong>.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: "1.3rem", color: "var(--text-primary)", marginBottom: "0.8rem" }}>2. Cancellations and Refunds</h2>
            <ul style={{ paddingLeft: "1.2rem", marginTop: "0.5rem", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              <li>
                <strong>Cancellations made 24+ hours before the session:</strong> Eligible for a 100% full refund via the original payment method (PayPal).
              </li>
              <li>
                <strong>Cancellations made less than 24 hours before the session:</strong> Because chart preparation and slot reservation require prior manual work, late cancellations may be subject to a 20% administrative fee or offered a full credit toward rescheduling.
              </li>
              <li>
                <strong>Missed Appointments (No-shows):</strong> If a client does not attend the scheduled video meeting within 15 minutes of the start time without prior notice, the session is marked as completed and is non-refundable.
              </li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: "1.3rem", color: "var(--text-primary)", marginBottom: "0.8rem" }}>3. Completed Consultations</h2>
            <p>
              Once a 1-on-1 consultation session has been conducted, services are deemed fully delivered and are not eligible for a refund. We are dedicated to your clarity and satisfaction—if you have follow-up questions regarding the remedies discussed during your session, you are welcome to reach out via email.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: "1.3rem", color: "var(--text-primary)", marginBottom: "0.8rem" }}>4. Refund Processing Time</h2>
            <p>
              Approved refunds are initiated within 48 business hours via PayPal and typically reflect in your account or card statement within 3 to 7 business days depending on your bank.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
