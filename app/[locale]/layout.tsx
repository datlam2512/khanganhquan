import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { getLocale } from "@/lib/i18n";
import { PageViewTracker } from "@/components/analytics/pageview";
import type { Locale } from "@/lib/types";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = getLocale((await params).locale);
  const isVi = locale === "vi";
  return {
    title: isVi ? "Công ty TNHH Khang Anh Quân | Thiết bị công nghiệp" : "Khang Anh Quan Co., Ltd. | Industrial Equipment",
    description: isVi ? "Thiết bị, vật tư và giải pháp cho hệ thống công nghiệp, dầu khí, LPG, PCCC và đường ống." : "Equipment, materials and solutions for industrial, oil & gas, LPG, fire protection and piping systems.",
    alternates: {
      canonical: `/${locale}`,
      languages: { vi: "/vi", en: "/en", "x-default": "/vi" },
    },
    openGraph: {
      title: isVi ? "Khang Anh Quân | Thiết bị công nghiệp" : "Khang Anh Quan | Industrial Equipment",
      description: isVi ? "Corporate website Khang Anh Quân." : "Khang Anh Quan corporate website.",
      locale: isVi ? "vi_VN" : "en_US",
      type: "website",
    },
  };
}

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const p = await params;
  if (!["vi", "en"].includes(p.locale)) notFound();
  const locale: Locale = getLocale(p.locale);
  return <><Header locale={locale} /><PageViewTracker />{children}<Footer locale={locale} /></>;
}
