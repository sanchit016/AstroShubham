"use client";

import { useEffect, useState } from "react";
import type { CurrencyCode } from "@/lib/pricing";

// Detects a visitor's currency from browser signals: India -> INR, Canada -> CAD, else USD.
export function detectCurrency(): CurrencyCode {
  if (typeof window === "undefined") return "USD";
  try {
    const detectedTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const locale = navigator.language || "";
    const looksIndian = detectedTz === "Asia/Kolkata" || detectedTz === "Asia/Calcutta" || /-in$/i.test(locale);
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

// Shared across the homepage and the booking widget so both show the same
// currency for a given visitor without any manual selector.
export function useCurrency(): CurrencyCode {
  const [currency, setCurrency] = useState<CurrencyCode>("USD");

  useEffect(() => {
    setCurrency(detectCurrency());
  }, []);

  return currency;
}
