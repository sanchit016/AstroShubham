"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, Mail } from "lucide-react";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/motion";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <motion.div
          className="footer-grid"
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={staggerContainer(0.1)}
        >
          <motion.div className="footer-brand" variants={fadeUp}>
            <Link href="/" className="logo" style={{ display: "inline-flex" }}>
              <Sparkles size={20} style={{ color: "var(--gold-primary)" }} />
              <span>AstroShubham</span>
            </Link>
            <p className="footer-description">
              Unlocking the celestial secrets to empower your journey. Specialized Vedic & Lal Kitab astrology consulting for career, relationship growth, and stellar alignment.
            </p>
          </motion.div>

          <motion.div variants={fadeUp}>
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
          </motion.div>

          <motion.div variants={fadeUp}>
            <h4 className="footer-col-title">Legal & Policies</h4>
            <ul className="footer-links">
              <li>
                <Link href="/terms" className="footer-link">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="footer-link">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/refund" className="footer-link">
                  Refund & Cancellation
                </Link>
              </li>
            </ul>
          </motion.div>

          <motion.div variants={fadeUp}>
            <h4 className="footer-col-title">Contact</h4>
            <ul className="footer-links">
              <li style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text-secondary)" }}>
                <Mail size={16} style={{ color: "var(--gold-primary)" }} />
                <span>astroshubhamchhabra@gmail.com</span>
              </li>
            </ul>
          </motion.div>
        </motion.div>

        <motion.div
          className="footer-bottom"
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={fadeUp}
        >
          <div className="footer-copy">
            &copy; {new Date().getFullYear()} AstroShubham. All rights reserved. Made for seekers worldwide.
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
