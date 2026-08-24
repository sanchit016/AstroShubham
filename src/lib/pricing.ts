// Single source of truth for consultation packages and regional pricing.
// Both the client (BookingWidget/marketing copy) and the booking API import
// from here so a price can never drift between what's displayed and what's charged.

export type CurrencyCode = "USD" | "INR" | "CAD";

export const SUPPORTED_CURRENCIES: CurrencyCode[] = ["USD", "INR", "CAD"];

export const CURRENCY_SYMBOLS: Record<CurrencyCode, string> = {
  USD: "$",
  INR: "₹",
  CAD: "CA$",
};

export interface PackageDefinition {
  id: string;
  title: string;
  description: string;
  duration: string;
  durationMinutes: number;
  prices: Record<CurrencyCode, number>; // major units, e.g. dollars/rupees
}

export const PACKAGES: PackageDefinition[] = [
  {
    id: "general",
    title: "General Consultation (Unlimited Questions)",
    description:
      "Connect for a private consultation to discuss all your life aspects (Career, Health, Family, etc.). Ask any number of questions.",
    duration: "45 Minutes",
    durationMinutes: 45,
    prices: { USD: 25, INR: 1999, CAD: 30 },
  },
  {
    id: "marriage",
    title: "Marriage Match & Couple Consultation",
    description:
      "Detailed Vedic & Lal Kitab compatibility reading for couples. Includes Gun Milan, planetary charts comparison, and Venus/7th house adjustments.",
    duration: "60 Minutes",
    durationMinutes: 60,
    prices: { USD: 40, INR: 2999, CAD: 50 },
  },
];

export function getPackage(id: string): PackageDefinition {
  return PACKAGES.find((p) => p.id === id) ?? PACKAGES[0];
}

export function isSupportedCurrency(value: unknown): value is CurrencyCode {
  return typeof value === "string" && (SUPPORTED_CURRENCIES as string[]).includes(value);
}

export interface CouponDefinition {
  code: string;
  prices: Record<CurrencyCode, number>;
  description: string;
}

export const VALID_COUPONS: Record<string, CouponDefinition> = {
  CHHABRA_ADMIN_9472X: {
    code: "CHHABRA_ADMIN_9472X",
    prices: { INR: 1, USD: 1, CAD: 1 },
    description: "Internal Verification Access (₹1 / $1)",
  },
  ASTRO_SECRET_8819P: {
    code: "ASTRO_SECRET_8819P",
    prices: { INR: 1, USD: 1, CAD: 1 },
    description: "Owner Testing Pass (₹1 / $1)",
  },
};

export function validateCoupon(code: string): CouponDefinition | null {
  if (!code) return null;
  const normalized = code.trim().toUpperCase();
  return VALID_COUPONS[normalized] || null;
}

export function getPrice(pkg: PackageDefinition, currency: CurrencyCode): number {
  return pkg.prices[currency];
}

export function getDiscountedPrice(pkg: PackageDefinition, currency: CurrencyCode, couponCode?: string): number {
  if (couponCode) {
    const coupon = validateCoupon(couponCode);
    if (coupon) {
      return coupon.prices[currency];
    }
  }
  return pkg.prices[currency];
}

export function getAmountInSubunits(pkg: PackageDefinition, currency: CurrencyCode): number {
  return Math.round(getPrice(pkg, currency) * 100);
}

export function getDiscountedAmountInSubunits(pkg: PackageDefinition, currency: CurrencyCode, couponCode?: string): number {
  return Math.round(getDiscountedPrice(pkg, currency, couponCode) * 100);
}

export function formatPrice(pkg: PackageDefinition, currency: CurrencyCode): string {
  return `${CURRENCY_SYMBOLS[currency]}${getPrice(pkg, currency).toLocaleString(currency === "INR" ? "en-IN" : "en-US")}`;
}

export function formatDiscountedPrice(pkg: PackageDefinition, currency: CurrencyCode, couponCode?: string): string {
  const price = getDiscountedPrice(pkg, currency, couponCode);
  return `${CURRENCY_SYMBOLS[currency]}${price.toLocaleString(currency === "INR" ? "en-IN" : "en-US")}`;
}
