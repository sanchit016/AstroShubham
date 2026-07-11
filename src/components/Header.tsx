"use client";

import { useState } from "react";
import Link from "next/link";
import { Sparkles, Menu, X } from "lucide-react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="header">
      <div className="container nav-container">
        <Link href="/" className="logo">
          <Sparkles size={24} style={{ color: "var(--gold-primary)" }} />
          <span>AstroShubham</span>
        </Link>

        {/* Desktop Navigation */}
        <nav style={{ display: "flex", alignItems: "center" }}>
          <ul className="nav-links">
            <li>
              <Link href="/" className="nav-link">
                Home
              </Link>
            </li>
            <li>
              <Link href="#services" className="nav-link">
                Consultations
              </Link>
            </li>
            <li>
              <Link href="#about" className="nav-link">
                About
              </Link>
            </li>
            <li>
              <Link href="#faq" className="nav-link">
                FAQ
              </Link>
            </li>
            <li>
              <Link href="#book" className="btn btn-secondary" style={{ padding: "0.5rem 1.2rem", fontSize: "0.9rem" }}>
                Book Now
              </Link>
            </li>
          </ul>
        </nav>

        {/* Burger menu for Mobile */}
        <button className="burger" onClick={toggleMenu} aria-label="Toggle menu">
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            top: "80px",
            left: 0,
            width: "100%",
            height: "calc(100vh - 80px)",
            backgroundColor: "rgba(10, 7, 20, 0.95)",
            backdropFilter: "blur(20px)",
            zIndex: 99,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "2.5rem",
            borderTop: "1px solid rgba(230, 200, 117, 0.08)",
          }}
        >
          <Link href="/" className="nav-link" style={{ fontSize: "1.5rem" }} onClick={toggleMenu}>
            Home
          </Link>
          <Link href="#services" className="nav-link" style={{ fontSize: "1.5rem" }} onClick={toggleMenu}>
            Consultations
          </Link>
          <Link href="#about" className="nav-link" style={{ fontSize: "1.5rem" }} onClick={toggleMenu}>
            About
          </Link>
          <Link href="#faq" className="nav-link" style={{ fontSize: "1.5rem" }} onClick={toggleMenu}>
            FAQ
          </Link>
          <Link href="#book" className="btn btn-primary" style={{ fontSize: "1.2rem" }} onClick={toggleMenu}>
            Book Now
          </Link>
        </div>
      )}
    </header>
  );
}
