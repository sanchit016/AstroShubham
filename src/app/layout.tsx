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
    default: "AstroShubham | Vedic & Lal Kitab Astrology Consultations by Shubham Chhabra",
    template: "%s | AstroShubham",
  },
  description:
    "Book an online Vedic & Lal Kitab astrology consultation with Shubham Chhabra. Practical, honest guidance on career, marriage compatibility (Gun Milan), health, and family with proven astrological remedies.",
  keywords: [
    "Vedic astrology consultation",
    "Lal Kitab astrology remedies",
    "online astrologer India",
    "Kundli matching online",
    "Gun Milan for marriage",
    "career astrology consultation",
    "marriage compatibility reading",
    "horoscope analysis",
    "astrological remedies",
    "birth chart analysis",
    "Manglik Dosha remedies",
    "Pitra Dosha remedies",
    "astrology consultation online Google Meet",
    "best Vedic astrologer",
    "Shubham Chhabra astrologer",
    "Chhabra astrology",
    "AstroShubham",
    "astrology consultation USA",
    "astrology consultation Canada",
  ],
  authors: [{ name: "Shubham Chhabra", url: siteUrl }],
  creator: "Shubham Chhabra",
  publisher: "AstroShubham",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: ["en_IN", "en_GB", "en_CA"],
    url: siteUrl,
    siteName: "AstroShubham",
    title: "AstroShubham | Vedic & Lal Kitab Astrology Consultations",
    description:
      "Book a private online consultation with Shubham Chhabra. Get honest, actionable Vedic & Lal Kitab guidance on career, marriage, health, and family.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "AstroShubham – Vedic & Lal Kitab Astrology Consultations with Shubham Chhabra",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AstroShubham | Vedic & Lal Kitab Astrology Consultations",
    description:
      "Book a private astrology consultation with Shubham Chhabra. Expert guidance on career, marriage compatibility, health & family.",
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
  category: "Astrology & Spiritual Guidance",
};

// Complete Schema.org Multi-Graph for Google Rich Snippets
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${siteUrl}/#astrologer`,
      name: "Shubham Chhabra",
      jobTitle: "Vedic & Lal Kitab Astrologer",
      description:
        "Renowned Vedic and Lal Kitab astrologer specializing in marriage compatibility (Gun Milan), career direction, and practical planetary remedies.",
      url: siteUrl,
      knowsAbout: [
        "Vedic Astrology",
        "Lal Kitab Remedies",
        "Kundli Milan",
        "Horoscope Analysis",
        "Career Astrology",
        "Marriage Matching",
        "Planetary Remedies",
      ],
    },
    {
      "@type": "ProfessionalService",
      "@id": `${siteUrl}/#organization`,
      name: "AstroShubham",
      url: siteUrl,
      logo: `${siteUrl}/og-image.png`,
      image: `${siteUrl}/og-image.png`,
      description:
        "Online Vedic & Lal Kitab astrology consultations by Shubham Chhabra. Personalized career, marriage, health, and family guidance with actionable remedies.",
      priceRange: "₹1,999 - ₹2,999 / $25 - $40",
      telephone: "+91-9876543210",
      email: "astroshubhamchhabra@gmail.com",
      address: {
        "@type": "PostalAddress",
        addressCountry: "IN",
      },
      areaServed: [
        { "@type": "Country", name: "India" },
        { "@type": "Country", name: "United States" },
        { "@type": "Country", name: "Canada" },
        { "@type": "Country", name: "United Kingdom" },
        { "@type": "Country", name: "Australia" },
      ],
      founder: {
        "@id": `${siteUrl}/#astrologer`,
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.9",
        reviewCount: "128",
        bestRating: "5",
        worstRating: "1",
      },
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Astrology Consultation Packages",
        itemListElement: [
          {
            "@type": "Offer",
            name: "General Consultation (Unlimited Questions)",
            description:
              "45-minute private session covering career, health, family, and life guidance. Ask any number of questions with practical Lal Kitab remedies.",
            price: "25",
            priceCurrency: "USD",
            availability: "https://schema.org/InStock",
            url: `${siteUrl}/#book`,
          },
          {
            "@type": "Offer",
            name: "Marriage Match & Couple Consultation",
            description:
              "60-minute double-chart reading with Gun Milan, planetary compatibility analysis, and Venus/7th house adjustments.",
            price: "40",
            priceCurrency: "USD",
            availability: "https://schema.org/InStock",
            url: `${siteUrl}/#book`,
          },
        ],
      },
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "AstroShubham",
      description: "Official portal for Vedic & Lal Kitab Astrology Consultations by Shubham Chhabra",
      publisher: {
        "@id": `${siteUrl}/#organization`,
      },
    },
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
