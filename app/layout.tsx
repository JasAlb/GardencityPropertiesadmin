/* eslint-disable @next/next/no-page-custom-font */
import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import LanguageShell from "@/components/LanguageShell";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#050816",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Garden City Properties | Real Estate Consultancy Oman",
  description:
    "Trusted real estate consultancy in Oman specializing in brokerage, property management, asset valuation, and quantity surveying for investors and developers.",
  icons: {
    icon: [
      { url: "/logo-main.jpeg", type: "image/jpeg" },
    ],
    shortcut: "/logo-main.jpeg",
    apple: "/logo-main.jpeg",
  },
  keywords: [
    "Real estate Oman",
    "property consultancy Muscat",
    "property valuation Oman",
    "real estate brokerage",
    "property management Sultanate of Oman",
    "quantity surveying",
  ],
  authors: [{ name: "Garden City Properties" }],
  creator: "Garden City Properties",
  publisher: "Garden City Properties",
  metadataBase: new URL("https://gardencityproperties.om"),
  alternates: {
    canonical: "/",
    languages: {
      "en": "/?lang=en",
      "ar": "/?lang=ar",
    },
  },
  openGraph: {
    title: "Garden City Properties | Real Estate Consultancy Oman",
    description:
      "Trusted real estate consultancy in Oman specializing in brokerage, property management, asset valuation, and quantity surveying for investors and developers.",
    type: "website",
    locale: "en_OM",
    alternateLocale: ["ar_OM"],
    siteName: "Garden City Properties",
    images: [
      {
        url: "/logo-main.jpeg",
        width: 1200,
        height: 630,
        alt: "Garden City Properties | Real Estate Consultancy Oman",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Garden City Properties | Real Estate Consultancy Oman",
    description:
      "Trusted real estate consultancy in Oman specializing in brokerage, property management, asset valuation, and quantity surveying for investors and developers.",
    images: ["/logo-main.jpeg"],
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
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      dir="ltr"
      suppressHydrationWarning
      className="dark h-full antialiased"
    >
      <head>
        <link rel="icon" href="/logo-main.jpeg" type="image/jpeg" />
        <link rel="shortcut icon" href="/logo-main.jpeg" type="image/jpeg" />
        <link rel="apple-touch-icon" href="/logo-main.jpeg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800&family=Outfit:wght@300;400;500;600;700;800&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){
              try {
                var lang = localStorage.getItem('gcp-language') || 'en';
                document.documentElement.lang = lang;
                document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
              } catch(e) {}
            })();`,
          }}
        />
      </head>
      <body className="min-h-full bg-background font-sans text-foreground">
        <LanguageShell>{children}</LanguageShell>
      </body>
    </html>
  );
}
