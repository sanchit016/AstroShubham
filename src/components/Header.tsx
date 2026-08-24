"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Menu, X } from "lucide-react";
import { useCurrency, setGlobalCurrency } from "@/lib/useCurrency";
import type { CurrencyCode } from "@/lib/pricing";

const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "#services", label: "Consultations" },
  { href: "#about", label: "About" },
  { href: "#testimonials", label: "Reviews" },
  { href: "#faq", label: "FAQ" },
];

export default function Header() {
  const currency = useCurrency();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const toggleMenu = () => setIsOpen((prev) => !prev);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 12);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <header className={`header ${isScrolled ? "is-scrolled" : ""}`}>
      <div className="container nav-container">
        <Link href="/" className="logo">
          <motion.span
            style={{ display: "inline-flex", color: "var(--gold-primary)" }}
            animate={{ rotate: [0, 15, -10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            <Sparkles size={24} />
          </motion.span>
          <span>AstroShubham</span>
        </Link>

        {/* Desktop Navigation */}
        <nav style={{ display: "flex", alignItems: "center" }}>
          <ul className="nav-links">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="nav-link">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <div style={{ display: "inline-flex", background: "rgba(255, 255, 255, 0.05)", padding: "2px", borderRadius: "6px", border: "1px solid var(--border-color)", gap: "2px" }}>
                {(["INR", "USD", "CAD"] as CurrencyCode[]).map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setGlobalCurrency(c)}
                    style={{
                      padding: "4px 8px",
                      fontSize: "0.75rem",
                      fontWeight: "600",
                      borderRadius: "4px",
                      border: "none",
                      cursor: "pointer",
                      background: currency === c ? "var(--gold-primary)" : "transparent",
                      color: currency === c ? "#000" : "var(--text-secondary)",
                      transition: "all 0.2s ease",
                    }}
                  >
                    {c === "INR" ? "₹ INR" : c === "USD" ? "$ USD" : "CA$"}
                  </button>
                ))}
              </div>
            </li>
            <li>
              <Link href="#book" className="btn btn-secondary" style={{ padding: "0.5rem 1.2rem", fontSize: "0.9rem" }}>
                Book Now
              </Link>
            </li>
          </ul>
        </nav>

        {/* Burger menu for Mobile */}
        <button className="burger" onClick={toggleMenu} aria-label="Toggle menu" aria-expanded={isOpen}>
          <AnimatePresence mode="wait" initial={false}>
            {isOpen ? (
              <motion.span
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
                style={{ display: "flex" }}
              >
                <X size={28} />
              </motion.span>
            ) : (
              <motion.span
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
                style={{ display: "flex" }}
              >
                <Menu size={28} />
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: "fixed",
              top: "72px",
              left: 0,
              width: "100%",
              height: "calc(100vh - 72px)",
              backgroundColor: "rgba(255, 253, 245, 0.97)",
              backdropFilter: "blur(20px)",
              zIndex: 99,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "2.5rem",
              borderTop: "1px solid rgba(180, 150, 50, 0.15)",
            }}
          >
            {NAV_ITEMS.map((item, i) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * i, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link href={item.href} className="nav-link" style={{ fontSize: "1.5rem" }} onClick={toggleMenu}>
                  {item.label}
                </Link>
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * NAV_ITEMS.length, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link href="#book" className="btn btn-primary" style={{ fontSize: "1.2rem" }} onClick={toggleMenu}>
                Book Now
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
