import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { LanguageProvider, type Language } from "@/context/LanguageContext";
import LanguageShell from "@/components/LanguageShell";

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "ar" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isAr = locale === "ar";
  const baseUrl = "https://www.gardencityproperties.net";

  return {
    title: isAr
      ? "جاردن سيتي بروبرتيز | شريكك العقاري الموثوق في سلطنة عمان"
      : "Garden City Properties | Trusted Real Estate & Property Consultants in Oman",
    description: isAr
      ? "شركة الاستشارات العقارية الرائدة في سلطنة عمان. نقدم خدمات وساطة عقارية، تقييم أصول، وإدارة عقارات معتمدة لمساعدتك في تحقيق أهدافك الاستثمارية."
      : "Oman's leading real estate consultancy offering expert property valuation, brokerage, management, and quantity surveying. Maximize your asset value with Garden City Properties.",
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: isAr ? `${baseUrl}/ar` : `${baseUrl}/en`,
      languages: {
        "en-OM": `${baseUrl}/en`,
        "ar-OM": `${baseUrl}/ar`,
        "x-default": `${baseUrl}/en`,
      },
    },
    openGraph: {
      title: isAr
        ? "جاردن سيتي بروبرتيز | شريكك العقاري الموثوق في سلطنة عمان"
        : "Garden City Properties | Trusted Real Estate & Property Consultants in Oman",
      description: isAr
        ? "شركة الاستشارات العقارية الرائدة في سلطنة عمان. نقدم خدمات وساطة عقارية، تقييم أصول، وإدارة عقارات معتمدة."
        : "Oman's leading real estate consultancy offering expert property valuation, brokerage, management, and quantity surveying.",
      url: isAr ? `${baseUrl}/ar` : `${baseUrl}/en`,
      type: "website",
      locale: isAr ? "ar_OM" : "en_OM",
      alternateLocale: [isAr ? "en_OM" : "ar_OM"],
      siteName: "Garden City Properties",
      images: [
        {
          url: "/Logo.jpeg",
          width: 1280,
          height: 532,
          alt: "Garden City Properties",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: isAr
        ? "جاردن سيتي بروبرتيز | شريكك العقاري الموثوق في سلطنة عمان"
        : "Garden City Properties | Trusted Real Estate & Property Consultants in Oman",
      description: isAr
        ? "شركة الاستشارات العقارية الرائدة في سلطنة عمان. نقدم خدمات وساطة عقارية، تقييم أصول، وإدارة عقارات معتمدة."
        : "Oman's leading real estate consultancy offering expert property valuation, brokerage, management, and quantity surveying.",
      images: ["/Logo.jpeg"],
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (locale !== "en" && locale !== "ar") {
    notFound();
  }

  const lang: Language = locale as Language;
  const isAr = lang === "ar";

  return (
    <LanguageProvider initialLanguage={lang}>
      <LanguageShell locale={lang}>
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.lang="${lang}";document.documentElement.dir="${isAr ? "rtl" : "ltr"}";`,
          }}
        />
        {children}
      </LanguageShell>
    </LanguageProvider>
  );
}
