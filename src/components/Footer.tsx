import Link from "next/link";
import { Sparkles, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link href="/" className="logo" style={{ display: "inline-flex" }}>
              <Sparkles size={20} style={{ color: "var(--gold-primary)" }} />
              <span>AstroShubham</span>
            </Link>
            <p className="footer-description">
              Unlocking the celestial secrets to empower your journey. Specialized Vedic & Lal Kitab astrology consulting for career, relationship growth, and stellar alignment.
            </p>
          </div>

          <div>
            <h4 className="footer-col-title">Consultations</h4>
            <ul className="footer-links">
              <li>
                <Link href="#services" className="footer-link">
                  Career Blueprint
                </Link>
              </li>
              <li>
                <Link href="#services" className="footer-link">
                  Relationship Kundli Match
                </Link>
              </li>
              <li>
                <Link href="#services" className="footer-link">
                  Detailed Life Reading
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="footer-col-title">Contact</h4>
            <ul className="footer-links">
              <li style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text-secondary)" }}>
                <Mail size={16} style={{ color: "var(--gold-primary)" }} />
                <span>support@astroshubham.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-copy">
            &copy; {new Date().getFullYear()} AstroShubham. All rights reserved. Made for seekers worldwide.
          </div>
          <div className="footer-socials">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="footer-social" aria-label="Instagram">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="footer-social" aria-label="Twitter">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="footer-social" aria-label="Youtube">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17z"/><path d="m10 15 5-3-5-3z"/></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
