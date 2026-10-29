"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Language = "en" | "ar";

const dictionaries = {
  en: {
    nav: {
      home: "Home",
      about: "About",
      services: "Services",
      projects: "Showcase",
      contact: "Contact",
      getStarted: "Get Started",
    },
    hero: {
      badge: "Oman · Consultancy · Assets",
      title: "Your Trusted Property Consultant & Real Estate Partner in Oman",
      subtitle:
        "Delivering professional, reliable, and tailored solutions to maximize the value of your assets.",
      explore: "Explore Services",
      contact: "Contact Us",
    },
    about: {
      eyebrow: "About Us",
      title: "Consultancy-grade real estate for a precision market.",
      body: "GARDENCITY PROPERTIES is a trusted real estate consultancy in Oman. We are committed to delivering professional, reliable, and tailored solutions that meet the diverse needs of property owners, investors, developers, and corporate clients.",
      stats: [
        { value: "Oman", label: "Market focus" },
        { value: "360°", label: "Asset advisory" },
        { value: "Bespoke", label: "Client solutions" },
      ],
      principleLabel: "Operating principle",
      principle:
        "Maximize asset value with disciplined, client-first execution.",
      leadershipEyebrow: "Management",
      leadershipTitle: "Leadership",
      managingDirector: "Managing Director",
      generalManager: "General Manager",
      leaders: [
        {
          src: "/MD.png",
          name: "Mr Mohamed al harthi",
          title: "Managing Director",
          bio: "As the Managing Director of Garden City Properties Oman, I bring extensive expertise in real estate brokerage, property management, asset valuation, and quantity surveying. With a strategic vision and in-depth understanding of the Omani real estate market, I focus on identifying valuable investment opportunities and delivering tailored property solutions. My commitment to professionalism, integrity, and client satisfaction drives me to provide reliable, innovative, and results-oriented services that create long-term value for our clients and partners.",
          email: "gardencityin@gmail.com",
          phone: "+968 97300200",
          phoneHref: "tel:+96897300200",
        },
        {
          src: "/GM.png",
          name: "Mr Adam al harthi",
          title: "General Manager",
          bio: "At Garden City Properties Oman, we are committed to delivering exceptional real estate brokerage, property management, asset valuation, and quantity surveying services. With our in-depth understanding of the Omani property market and broad experience in real estate, we provide tailored solutions to meet the diverse needs of our clients. Our goal is to help investors make informed property decisions, identify valuable investment opportunities, and achieve sustainable, long-term returns through professional advice, reliable service, and a commitment to excellence.",
          email: "gardencityin@gmail.com",
          phone: "+968 77304446",
          phoneHref: "tel:+96877304446",
        },
      ],
    },
    services: {
      eyebrow: "Our Services",
      title: "End-to-end property capability.",
      subtitle:
        "A consultancy-led suite designed for owners, investors, developers, and corporate occupiers.",
      core: "Core practice",
      items: [
        {
          title: "Property Consultant",
          description:
            "Independent advisory for acquisitions, disposals, and portfolio strategy across Oman’s residential and commercial markets.",
        },
        {
          title: "Real Estate Brokerage",
          description:
            "Discreet, high-touch brokerage connecting qualified buyers, sellers, and occupiers with the right opportunities.",
        },
        {
          title: "Property Management",
          description:
            "Operational oversight that protects yield, tenant experience, and the long-term condition of your assets.",
        },
        {
          title: "Property Valuation",
          description:
            "Defensible valuations for investment, financing, and corporate reporting—grounded in local market intelligence.",
        },
        {
          title: "Quantity Surveying",
          description:
            "Cost planning, procurement support, and commercial control for development and fit-out programmes.",
        },
      ],
    },
    projects: {
      eyebrow: "Portfolio",
      title: "Showcase of Our Projects",
      subtitle:
        "Explore our exclusive portfolio of premium properties and strategic developments.",
      getDetails: "Get More Details",
      paymentPlan: "Payment Plan",
      startingArea: "Starting Area",
      developer: "Developer",
      loading: "Loading projects…",
      empty: "No projects are listed at the moment.",
      error: "Projects could not be loaded. Please try again shortly.",
      whatsapp: "Chat on WhatsApp",
    },
    contact: {
      eyebrow: "Contact",
      title: "Start a conversation.",
      subtitle:
        "Share a brief on your property, investment, or development mandate and our consultants will follow up.",
      name: "Name",
      namePlaceholder: "Your full name",
      email: "Email",
      phone: "Phone",
      message: "Message",
      messagePlaceholder: "Tell us about the property or mandate.",
      send: "Send enquiry",
      thanks: "Thank you. Your enquiry has been recorded in this session.",
      direct: "Direct lines",
      directBody:
        "Reach the GardencityProperties desk for consultancy, brokerage, and asset mandates in Oman.",
      location: "Muscat · Sultanate of Oman",
    },
    footer: {
      rights: "All rights reserved.",
    },
  },
  ar: {
    nav: {
      home: "الرئيسية",
      about: "من نحن",
      services: "خدماتنا",
      projects: "المشاريع",
      contact: "تواصل معنا",
      getStarted: "ابدأ الآن",
    },
    hero: {
      badge: "عمان · استشارات · أصول",
      title: "مستشارك العقاري وشريكك الموثوق في سلطنة عمان",
      subtitle:
        "نقدم حلولاً مهنية وموثوقة ومخصصة لتعظيم قيمة أصولك.",
      explore: "استكشف الخدمات",
      contact: "تواصل معنا",
    },
    about: {
      eyebrow: "من نحن",
      title: "استشارات عقارية بمعايير احترافية لسوق دقيق.",
      body: "جاردن سيتي بروبرتيز شركة استشارات عقارية موثوقة في سلطنة عمان. نلتزم بتقديم حلول مهنية وموثوقة ومخصصة تلبي احتياجات ملاك العقارات والمستثمرين والمطورين والعملاء من الشركات.",
      stats: [
        { value: "عمان", label: "تركيز السوق" },
        { value: "360°", label: "استشارات الأصول" },
        { value: "مخصص", label: "حلول العملاء" },
      ],
      principleLabel: "مبدأ العمل",
      principle: "تعظيم قيمة الأصول بتنفيذ منضبط يضع العميل أولاً.",
      leadershipEyebrow: "الإدارة",
      leadershipTitle: "فريق القيادة",
      managingDirector: "العضو المنتدب",
      generalManager: "المدير العام",
      leaders: [
        {
          src: "/MD.png",
          name: "الفاضل محمد الحارثي",
          title: "العضو المنتدب",
          bio: "بصفتي العضو المنتدب لشركة جاردن سيتي بروبرتيز عمان، أقدم خبرة واسعة في الوساطة العقارية، وإدارة العقارات، وتقييم الأصول، ومسح الكميات. وبفضل الرؤية الاستراتيجية والفهم العميق لسوق العقارات العماني، أركز على تحديد الفرص الاستثمارية القيمة وتقديم حلول عقارية مخصصة. إن التزامي بالمهنية والنزاهة ورضا العملاء يدفعني لتقديم خدمات موثوقة ومبتكرة وفعالة تحقق قيمة طويلة الأجل لعملائنا وشركائنا.",
          email: "gardencityin@gmail.com",
          phone: "+968 97300200",
          phoneHref: "tel:+96897300200",
        },
        {
          src: "/GM.png",
          name: "الفاضل آدم الحارثي",
          title: "المدير العام",
          bio: "في جاردن سيتي بروبرتيز عمان، نلتزم بتقديم خدمات استثنائية في الوساطة العقارية، وإدارة الأملاك، وتقييم الأصول، ومسح الكميات. بفضل فهمنا الدقيق لسوق العقارات العماني وخبرتنا الواسعة في المجال العقاري، نوفر حلولاً مصممة خصيصاً لتلبية الاحتياجات المتنوعة لعملائنا. هدفنا هو مساعدة المستثمرين على اتخاذ قرارات عقارية مدروسة، وتحديد فرص استثمارية قيمة، وتحقيق عوائد مستدامة طويلة الأجل من خلال المشورة المهنية والخدمة الموثوقة والالتزام بالتميز.",
          email: "gardencityin@gmail.com",
          phone: "+968 77304446",
          phoneHref: "tel:+96877304446",
        },
      ],
    },
    services: {
      eyebrow: "خدماتنا",
      title: "قدرات عقارية متكاملة.",
      subtitle:
        "مجموعة استشارية مصممة للملاك والمستثمرين والمطورين والشركات المستأجرة.",
      core: "الممارسة الأساسية",
      items: [
        {
          title: "الاستشارات العقارية",
          description:
            "استشارات مستقلة للاستحواذ والتصرف واستراتيجية المحفظة عبر الأسواق السكنية والتجارية في عمان.",
        },
        {
          title: "الوساطة العقارية",
          description:
            "وساطة راقية وسرية تربط المشترين والبائعين والمستأجرين المؤهلين بالفرص المناسبة.",
        },
        {
          title: "إدارة العقارات",
          description:
            "إشراف تشغيلي يحمي العائد وتجربة المستأجر والحالة طويلة الأمد لأصولك.",
        },
        {
          title: "تقييم العقارات",
          description:
            "تقييمات موثوقة للاستثمار والتمويل والتقارير المؤسسية استناداً إلى معرفة السوق المحلية.",
        },
        {
          title: "مسح الكميات",
          description:
            "تخطيط التكاليف ودعم التوريد والرقابة التجارية لبرامج التطوير والتشطيب.",
        },
      ],
    },
    projects: {
      eyebrow: "محفظة المشاريع",
      title: "عرض المشاريع",
      subtitle:
        "استكشف محفظتنا الحصرية من العقارات المتميزة والمشاريع الاستراتيجية.",
      getDetails: "المزيد من التفاصيل",
      paymentPlan: "خطة السداد",
      startingArea: "المساحة الابتدائية",
      developer: "المطور",
      loading: "جاري تحميل المشاريع…",
      empty: "لا توجد مشاريع معروضة حالياً.",
      error: "تعذر تحميل المشاريع. يرجى المحاولة بعد قليل.",
      whatsapp: "تواصل عبر واتساب",
    },
    contact: {
      eyebrow: "تواصل",
      title: "ابدأ محادثة.",
      subtitle:
        "أرسل موجزاً عن عقارك أو استثمارك أو مشروع التطوير وسيتواصل معك مستشارونا.",
      name: "الاسم",
      namePlaceholder: "الاسم الكامل",
      email: "البريد الإلكتروني",
      phone: "الهاتف",
      message: "الرسالة",
      messagePlaceholder: "أخبرنا عن العقار أو المهمة.",
      send: "إرسال الاستفسار",
      thanks: "شكراً لك. تم تسجيل استفسارك في هذه الجلسة.",
      direct: "خطوط مباشرة",
      directBody:
        "تواصل مع مكتب جاردن سيتي بروبرتيز للاستشارات والوساطة وإدارة الأصول في عمان.",
      location: "مسقط · سلطنة عمان",
    },
    footer: {
      rights: "جميع الحقوق محفوظة.",
    },
  },
} as const;

export type Dictionary = (typeof dictionaries)[Language];

type LanguageContextValue = {
  language: Language;
  dir: "ltr" | "rtl";
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
  dictionary: Dictionary;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

function getInitialLanguage(): Language {
  return "en";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(getInitialLanguage);

  // Sync saved preference from localStorage on mount to prevent hydration mismatch
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem("gcp-language");
      if (stored === "ar" || stored === "en") {
        queueMicrotask(() => {
          setLanguageState(stored);
        });
      }
    } catch {
      // Ignore
    }
  }, []);

  useEffect(() => {
    try {
      const html = document.documentElement;
      html.lang = language;
      html.dir = language === "ar" ? "rtl" : "ltr";
      window.localStorage.setItem("gcp-language", language);
    } catch {
      // Ignore in SSR
    }
  }, [language]);

  const setLanguage = useCallback((next: Language) => {
    setLanguageState(next);
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguageState((current) => (current === "en" ? "ar" : "en"));
  }, []);

  const value = useMemo<LanguageContextValue>(
    () => ({
      language,
      dir: language === "ar" ? "rtl" : "ltr",
      setLanguage,
      toggleLanguage,
      dictionary: dictionaries[language],
    }),
    [language, setLanguage, toggleLanguage],
  );

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}
