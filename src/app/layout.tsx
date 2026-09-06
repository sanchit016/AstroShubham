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
    default: "AstroShubham | Best Vedic & Lal Kitab Astrologer – USA, Canada & India",
    template: "%s | AstroShubham",
  },
  description:
    "Consult top Vedic & Lal Kitab Astrologer Shubham Chhabra online via Google Meet. Accurate, honest guidance on career, marriage matching (Gun Milan), wealth, health, and practical planetary remedies. Serving clients across the USA, Canada, India, and worldwide with local timezone slots.",
  keywords: [
    // Brand & Astrologer Keywords
    "Shubham Chhabra",
    "Shubham Chhabra astrologer",
    "AstroShubham",
    "Astro Shubham Chhabra",
    "Chhabra astrology",
    "astrologer Shubham",
    
    // USA Regional & High-Intent Keywords
    "Indian astrologer in USA",
    "Vedic astrologer USA",
    "online astrologer USA",
    "astrology consultation USA",
    "Indian astrologer in California",
    "Indian astrologer in New York",
    "Indian astrologer in Texas",
    "Indian astrologer in New Jersey",
    "best Indian astrologer in USA",
    "Kundli matching for NRI in USA",
    "astrology consultation USA Google Meet",
    
    // Canada Regional & High-Intent Keywords
    "Indian astrologer in Canada",
    "Vedic astrologer Canada",
    "online astrologer Canada",
    "astrology consultation Canada",
    "Indian astrologer in Toronto",
    "Indian astrologer in Vancouver",
    "Indian astrologer in Calgary",
    "best Indian astrologer in Canada",
    "Kundli matching Canada",
    
    // India Regional Keywords
    "best Vedic astrologer in India",
    "top astrologer in India",
    "Lal Kitab specialist India",
    "online Kundli reading India",
    "astrology consultation Delhi Mumbai Bangalore",
    
    // Core Services & Astrology Disciplines
    "Vedic astrology consultation",
    "Lal Kitab astrology remedies",
    "Kundli matching online",
    "Gun Milan for marriage",
    "career astrology consultation",
    "marriage compatibility reading",
    "horoscope analysis",
    "birth chart reading",
    "Manglik Dosha remedies",
    "Pitra Dosha remedies",
    "Kaal Sarp Dosha analysis",
    "wealth & business astrology",
    "planetary remedies without gemstones",
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
    languages: {
      "en-US": `${siteUrl}?cur=USD`,
      "en-CA": `${siteUrl}?cur=CAD`,
      "en-IN": `${siteUrl}?cur=INR`,
      "x-default": siteUrl,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: ["en_IN", "en_CA", "en_GB"],
    url: siteUrl,
    siteName: "AstroShubham",
    title: "AstroShubham | Best Vedic & Lal Kitab Astrologer – USA, Canada & India",
    description:
      "Book an online Vedic & Lal Kitab astrology consultation with Shubham Chhabra. Accurate guidance on career, marriage compatibility (Gun Milan), health, and family with practical remedies.",
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
    title: "AstroShubham | Vedic & Lal Kitab Astrology – USA, Canada & India",
    description:
      "Private online astrology consultations with Shubham Chhabra. Career, marriage compatibility, health, and proven Lal Kitab remedies.",
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

// Complete Schema.org Multi-Graph for Google Rich Snippets & International Local Business
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${siteUrl}/#astrologer`,
      name: "Shubham Chhabra",
      jobTitle: "Vedic & Lal Kitab Astrologer",
      description:
        "Internationally recognized Vedic and Lal Kitab astrologer offering personalized consultations for clients in the United States, Canada, India, and worldwide.",
      url: siteUrl,
      sameAs: [
        "https://www.instagram.com/astroshubham",
        "https://www.youtube.com/@astroshubham",
      ],
      knowsAbout: [
        "Vedic Astrology",
        "Lal Kitab Remedies",
        "Kundli Milan & Gun Milan",
        "Horoscope Analysis",
        "Career & Business Astrology",
        "Marriage & Relationship Compatibility",
        "Planetary Remedies",
        "Manglik & Pitra Dosha Analysis",
      ],
      knowsLanguage: ["English", "Hindi", "Punjabi"],
    },
    {
      "@type": "ProfessionalService",
      "@id": `${siteUrl}/#organization`,
      name: "AstroShubham – Vedic & Lal Kitab Astrology Consultations",
      url: siteUrl,
      logo: `${siteUrl}/og-image.png`,
      image: `${siteUrl}/og-image.png`,
      description:
        "Online Vedic & Lal Kitab astrology consultations by Shubham Chhabra. Direct 1-on-1 sessions on Google Meet covering career direction, marriage compatibility, health, and life clarity for clients in the USA, Canada, India, and across the globe.",
      priceRange: "₹1,999 - ₹2,999 / $25 - $40 USD / $35 - $55 CAD",
      telephone: "+91-9876543210",
      email: "astroshubhamchhabra@gmail.com",
      address: {
        "@type": "PostalAddress",
        addressCountry: "IN",
      },
      areaServed: [
        { "@type": "Country", name: "United States" },
        { "@type": "Country", name: "Canada" },
        { "@type": "Country", name: "India" },
        { "@type": "Country", name: "United Kingdom" },
        { "@type": "Country", name: "Australia" },
        { "@type": "Country", name: "United Arab Emirates" },
        { "@type": "State", name: "California" },
        { "@type": "State", name: "New York" },
        { "@type": "State", name: "Texas" },
        { "@type": "State", name: "Ontario" },
        { "@type": "State", name: "British Columbia" },
      ],
      founder: {
        "@id": `${siteUrl}/#astrologer`,
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.9",
        reviewCount: "154",
        bestRating: "5",
        worstRating: "1",
      },
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Astrology Consultation Packages",
        itemListElement: [
          {
            "@type": "Offer",
            name: "General Vedic & Lal Kitab Consultation (Unlimited Questions)",
            description:
              "45-minute 1-on-1 private video consultation covering career, finance, health, and life guidance. Ask any number of questions with practical Lal Kitab remedies.",
            price: "25",
            priceCurrency: "USD",
            availability: "https://schema.org/InStock",
            url: `${siteUrl}/#book`,
          },
          {
            "@type": "Offer",
            name: "Marriage Match & Couple Consultation (Gun Milan)",
            description:
              "60-minute comprehensive double-chart reading with Ashtakoot Gun Milan, Manglik dosha checks, Venus placement analysis, and harmony remedies for couples in USA, Canada, and India.",
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
      description: "Official portal for Vedic & Lal Kitab Astrology Consultations by Shubham Chhabra for clients in USA, Canada, India, and worldwide.",
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
