"use client";

import { useEffect, useState } from "react";
import type { CurrencyCode } from "@/lib/pricing";

// Detects a visitor's currency from browser signals: India -> INR, Canada -> CAD, else USD.
export function detectCurrency(): CurrencyCode {
  if (typeof window === "undefined") return "USD";
  try {
    const saved = localStorage.getItem("astro_currency") as CurrencyCode;
    if (saved && (saved === "INR" || saved === "USD" || saved === "CAD")) {
      return saved;
    }

    const detectedTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const locale = navigator.language || "";

    const looksIndian =
      detectedTz === "Asia/Kolkata" ||
      detectedTz === "Asia/Calcutta" ||
      /-in$/i.test(locale);
    if (looksIndian) return "INR";

    const looksCanadian =
      /-ca$/i.test(locale) ||
      /^America\/(Toronto|Vancouver|Montreal|Edmonton|Winnipeg|Halifax|Ottawa)$/.test(detectedTz);
    if (looksCanadian) return "CAD";

    return "USD";
  } catch {
    return "USD";
  }
}

export function setGlobalCurrency(newCurrency: CurrencyCode) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("astro_currency", newCurrency);
    window.dispatchEvent(new CustomEvent("currency-change", { detail: newCurrency }));
  } catch (e) {
    console.error("Failed to save currency preference:", e);
  }
}

// Shared across the homepage and the booking widget so both show the same
// currency for a given visitor with real-time switching.
export function useCurrency(): CurrencyCode {
  const [currency, setCurrency] = useState<CurrencyCode>("USD");

  useEffect(() => {
    setCurrency(detectCurrency());

    const handleCurrencyChange = (e: Event) => {
      const customEvent = e as CustomEvent<CurrencyCode>;
      if (customEvent.detail) {
        setCurrency(customEvent.detail);
      }
    };

    window.addEventListener("currency-change", handleCurrencyChange);
    return () => window.removeEventListener("currency-change", handleCurrencyChange);
  }, []);

  return currency;
}
