"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useCurrency, setGlobalCurrency } from "@/lib/useCurrency";
import type { CurrencyCode } from "@/lib/pricing";

const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/#services", label: "Consultations" },
  { href: "/#about", label: "About" },
  { href: "/reviews", label: "Reviews" },
  { href: "/#faq", label: "FAQ" },
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
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";

      return () => {
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
        document.body.style.overflow = "";
        document.documentElement.style.overflow = "";
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

  return (
    <header className={`header ${isScrolled ? "is-scrolled" : ""}`}>
      <div className="container nav-container">
        <Link href="/" className="logo">
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 28,
              height: 28,
              borderRadius: "50%",
              boxShadow: "0 0 12px rgba(234, 179, 8, 0.4)",
              overflow: "hidden",
              flexShrink: 0,
            }}
          >
            <Image
              src="/favicon.svg"
              alt="AstroShubham Logo"
              width={28}
              height={28}
              priority
            />
          </span>
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
              <Link href="/#book" className="btn btn-secondary" style={{ padding: "0.5rem 1.2rem", fontSize: "0.9rem" }}>
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
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: "fixed",
              top: "72px",
              left: 0,
              right: 0,
              bottom: 0,
              width: "100%",
              height: "calc(100dvh - 72px)",
              backgroundColor: "#fffdf5",
              zIndex: 9999,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "2rem",
              borderTop: "1px solid var(--border-color)",
              overscrollBehavior: "contain",
              touchAction: "pan-y",
              padding: "2rem 1.5rem",
            }}
          >
            {NAV_ITEMS.map((item, i) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.03 * i, duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link
                  href={item.href}
                  className="nav-link"
                  style={{ fontSize: "1.35rem", fontWeight: 500, color: "var(--text-primary)" }}
                  onClick={toggleMenu}
                >
                  {item.label}
                </Link>
              </motion.div>
            ))}

            {/* Mobile Currency Switcher */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.03 * (NAV_ITEMS.length + 1), duration: 0.25 }}
              style={{
                display: "inline-flex",
                background: "rgba(0, 0, 0, 0.04)",
                padding: "4px",
                borderRadius: "8px",
                border: "1px solid var(--border-color)",
                gap: "4px",
                marginTop: "0.5rem",
              }}
            >
              {(["INR", "USD", "CAD"] as CurrencyCode[]).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => {
                    setGlobalCurrency(c);
                  }}
                  style={{
                    padding: "6px 14px",
                    fontSize: "0.85rem",
                    fontWeight: "600",
                    borderRadius: "6px",
                    border: "none",
                    cursor: "pointer",
                    background: currency === c ? "var(--gold-primary)" : "transparent",
                    color: currency === c ? "#fff" : "var(--text-secondary)",
                    transition: "all 0.2s ease",
                  }}
                >
                  {c === "INR" ? "₹ INR" : c === "USD" ? "$ USD" : "CA$ CAD"}
                </button>
              ))}
            </motion.div>

            {/* Book Now Button */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.03 * (NAV_ITEMS.length + 2), duration: 0.25 }}
              style={{ width: "100%", maxWidth: "260px" }}
            >
              <Link
                href="/#book"
                className="btn btn-primary"
                style={{ width: "100%", justifyContent: "center", fontSize: "1.1rem", padding: "0.75rem 1.5rem" }}
                onClick={toggleMenu}
              >
                Book Now
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
