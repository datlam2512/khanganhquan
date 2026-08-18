"use client";

import Image from "next/image";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import type { Locale } from "@/lib/types";
import { getDictionary } from "@/lib/i18n";
import { Button } from "@/components/ui/button";

export type HeroSlide = {
  id: string;
  image: string;
  sortOrder: number;
  published: boolean;
};

const fallbackSlides: HeroSlide[] = [
  { id: "demo-1", image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=2200&q=86", sortOrder: 1, published: true },
  { id: "demo-2", image: "https://images.unsplash.com/photo-1565610222536-ef125c59da2e?auto=format&fit=crop&w=2200&q=86", sortOrder: 2, published: true },
  { id: "demo-3", image: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=2200&q=86", sortOrder: 3, published: true },
];

export function Hero({ locale, slides = fallbackSlides }: { locale: Locale; slides?: HeroSlide[] }) {
  const t = getDictionary(locale);
  const publishedSlides = slides
    .filter((slide) => slide.published && slide.image)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  const activeSlides = publishedSlides.length > 0 ? publishedSlides : fallbackSlides;
  const [index, setIndex] = useState(0);
  const safeIndex = index >= activeSlides.length ? 0 : index;

  useEffect(() => {
    if (activeSlides.length < 2) return;

    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % activeSlides.length);
    }, 6500);

    return () => window.clearInterval(timer);
  }, [activeSlides.length]);

  return (
    <section className="relative isolate min-h-162.5 overflow-hidden bg-[#0B1D13] text-white">
      {activeSlides.map((item, itemIndex) => (
        <div
          key={item.id}
          className={`absolute inset-0 transition-opacity duration-1600 ease-out ${itemIndex === safeIndex ? "opacity-100" : "pointer-events-none opacity-0"}`}
          aria-hidden={itemIndex !== safeIndex}
        >
          <Image
            src={item.image}
            alt={locale === "vi" ? t.hero.title : t.hero.title}
            fill
            priority={itemIndex < 2}
            className="object-cover object-center scale-[1.01]"
            sizes="100vw"
          />
        </div>
      ))}

      <div className="hero-overlay absolute inset-0" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_35%,rgba(35,169,84,.22),transparent_28rem)]" />

      <div className="container-kaq relative z-10 flex min-h-162.5 items-center py-20">
        <div className="max-w-4xl">
          <div className="eyebrow text-[#A7E3BD]">{t.hero.eyebrow}</div>
          <h1 className="heading-display mt-4 max-w-4xl text-5xl font-extrabold leading-[.98] tracking-[-0.055em] sm:text-6xl lg:text-[5.4rem]">
            {t.hero.title}
          </h1>
          <p className="mt-7 max-w-2xl text-[15px] leading-7 text-white/78 sm:text-[17px]">{t.hero.desc}</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Button href={`/${locale}/products`}>
              {t.actions.products}
              <ArrowRight className="size-4" />
            </Button>
            <Button href={`/${locale}/contact#contact-form`} variant="outline" className="border-white/20 bg-white/10 text-white hover:bg-white/15 hover:text-white">
              {t.actions.contact}
              <ShieldCheck className="size-4" />
            </Button>
          </div>
          <div className="mt-12 flex flex-wrap gap-x-8 gap-y-3 border-t border-white/12 pt-5 text-[11px] font-semibold text-white/60">
            <span>{locale === "vi" ? "Thiết bị công nghiệp" : "Industrial equipment"}</span>
            <span>{locale === "vi" ? "Ống & van" : "Piping & valves"}</span>
            <span>{locale === "vi" ? "LPG & PCCC" : "LPG & fire protection"}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
