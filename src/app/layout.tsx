import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const siteUrl = "https://astroshubhamchhabra.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "AstroShubham | Vedic & Lal Kitab Astrology Consultations",
    template: "%s | AstroShubham",
  },
  description:
    "Book a private Vedic & Lal Kitab astrology consultation with Shubham Chhabra. Get expert guidance on career, marriage compatibility (Gun Milan), health, and family. Personalized remedies and life readings.",
  keywords: [
    "Vedic astrology consultation",
    "Lal Kitab astrology",
    "online astrologer",
    "Kundli matching",
    "Gun Milan",
    "career astrology",
    "marriage compatibility",
    "horoscope reading",
    "astrology remedies",
    "birth chart analysis",
    "Manglik Dosha",
    "Pitra Dosha",
    "astrology consultation online",
    "best astrologer India",
    "Shubham Chhabra astrologer",
  ],
  authors: [{ name: "Shubham Chhabra", url: siteUrl }],
  creator: "AstroShubham",
  publisher: "AstroShubham",
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "AstroShubham",
    title: "AstroShubham | Vedic & Lal Kitab Astrology Consultations",
    description:
      "Book a private astrology session with Shubham Chhabra. Expert Vedic & Lal Kitab guidance on career, marriage, health, and family. Personalized remedies included.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "AstroShubham – Vedic & Lal Kitab Astrology Consultations",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AstroShubham | Vedic & Lal Kitab Astrology Consultations",
    description:
      "Book a private astrology session with Shubham Chhabra. Expert guidance on career, marriage, health & family.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Add your Google Search Console verification code here once available
    // google: "your-verification-code",
  },
};

// JSON-LD Structured Data for Google Rich Results
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "AstroShubham",
  url: siteUrl,
  logo: `${siteUrl}/og-image.png`,
  image: `${siteUrl}/shubham.jpg`,
  description:
    "Expert Vedic & Lal Kitab astrology consultations by Shubham Chhabra. Personalized career, marriage, health, and family guidance with actionable remedies.",
  priceRange: "$25 - $40",
  address: {
    "@type": "PostalAddress",
    addressCountry: "IN",
  },
  founder: {
    "@type": "Person",
    name: "Shubham Chhabra",
    jobTitle: "Vedic & Lal Kitab Astrologer",
    url: siteUrl,
  },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Astrology Consultation Packages",
    itemListElement: [
      {
        "@type": "Offer",
        name: "General Consultation (Unlimited Questions)",
        description:
          "45-minute private session covering career, health, family, and life guidance. Ask any number of questions.",
        price: "25",
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
      },
      {
        "@type": "Offer",
        name: "Marriage Match & Couple Consultation",
        description:
          "60-minute double-chart reading with Gun Milan, planetary charts comparison, and Venus/7th house adjustments.",
        price: "40",
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
      },
    ],
  },
  sameAs: [
    "https://instagram.com",
    "https://twitter.com",
    "https://youtube.com",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} ${inter.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body>
        <div className="nebula-glow" />
        {children}
      </body>
    </html>
  );
}
