"use client";

import Link from "next/link";
import { Menu, Search, X, ChevronDown, ArrowUpRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Locale } from "@/lib/types";
import { getDictionary } from "@/lib/i18n";
import { Input } from "@/components/ui/input";
import { VN, GB } from "country-flag-icons/react/3x2";
import NextImage from "next/image";
export function Header({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [languageOpen, setLanguageOpen] = useState(false);
  const languageRef = useRef<HTMLDivElement>(null);

  const nav = [
    ["/", t.nav.home],
    ["/about", t.nav.about],
    ["/products", t.nav.products],
    ["/projects", t.nav.projects],
    ["/partners", t.nav.partners],
    ["/contact", t.nav.contact],
  ] as const;

  const localPath = path.replace(/^\/(vi|en)/, "") || "/";

  useEffect(() => {
    const onPointer = (event: MouseEvent) => {
      if (
        languageRef.current &&
        !languageRef.current.contains(event.target as Node)
      ) {
        setLanguageOpen(false);
      }
    };
    document.addEventListener("mousedown", onPointer);
    return () => document.removeEventListener("mousedown", onPointer);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-[#e6ede8]/90 bg-white/92 backdrop-blur-xl">
        <div className="container-kaq flex min-h-[82px] items-center justify-between gap-6">
          <Link
            href={`/${locale}`}
            className="group flex min-w-0 items-center gap-3.5"
          >
            <div className="relative size-15 shrink-0">
              <NextImage
                src="/logo/logo-green.png"
                alt="Khang Anh Quân"
                fill
                priority
                className="object-contain"
              />
            </div>

            <div className="hidden sm:block">
              <div className="font-display text-[13px] font-extrabold tracking-[-.02em] text-[#123b24]">
                KHANG ANH QUÂN
              </div>
              <div className="mt-1 text-[9px] font-bold tracking-[.18em] text-[#7c8982]">
                CÔNG TY TNHH
              </div>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-7">
            {nav.map(([href, label]) => {
              const active =
                (href === "/" && localPath === "/") ||
                (href !== "/" && localPath.startsWith(href));
              return (
                <Link
                  key={href}
                  href={`/${locale}${href === "/" ? "" : href}`}
                  className={`relative py-2 text-[12px] font-bold tracking-[.01em] transition ${
                    active
                      ? "text-[#0d6832]"
                      : "text-[#5d6d64] hover:text-[#0d6832]"
                  }`}
                >
                  {label}
                  <span
                    className={`absolute inset-x-0 -bottom-1 h-[2px] rounded-full bg-[#17a34a] transition ${active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`}
                  />
                </Link>
              );
            })}
          </nav>

          <div className="hidden md:flex items-center gap-2.5">
            <form action={`/${locale}/products`} className="relative w-[210px]">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#86938c]" />
              <Input
                name="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={t.search.placeholder}
                className="h-10 rounded-full border-[#dfe8e2] bg-[#fbfcfb] pl-10 pr-4 text-[12px] focus-visible:ring-[#d6ebdc]"
              />
            </form>

            <div ref={languageRef} className="relative">
              <button
                type="button"
                aria-haspopup="menu"
                aria-expanded={languageOpen}
                onClick={() => setLanguageOpen((v) => !v)}
                className="inline-flex h-10 items-center gap-2 rounded-full border border-[#dfe8e2] bg-white px-3.5 text-[11px] font-extrabold text-[#294a37] transition hover:border-[#bed7c5] hover:bg-[#f4faf6]"
              >
                <span className="flex h-5 w-7 overflow-hidden rounded-sm">
                  {locale === "vi" ? (
                    <VN title="Vietnam" className="h-full w-full" />
                  ) : (
                    <GB title="United Kingdom" className="h-full w-full" />
                  )}
                </span>

                <ChevronDown
                  className={`size-3.5 transition-transform ${
                    languageOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {languageOpen && (
                <div className="absolute right-0 top-[calc(100%+10px)] w-44 rounded-2xl border border-[#dfe8e2] bg-white p-1.5 shadow-[0_20px_50px_rgba(24,61,39,.13)]">
                  <Link
                    onClick={() => setLanguageOpen(false)}
                    href={`/vi${localPath}`}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold ${locale === "vi" ? "bg-[#edf8f1] text-[#0d6832]" : "text-[#56665d] hover:bg-[#f6f9f7]"}`}
                  >
                    <span>🇻🇳</span>
                    <span>Tiếng Việt</span>
                    {locale === "vi" && (
                      <span className="ml-auto size-1.5 rounded-full bg-[#119444]" />
                    )}
                  </Link>
                  <Link
                    onClick={() => setLanguageOpen(false)}
                    href={`/en${localPath}`}
                    className={`mt-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold ${locale === "en" ? "bg-[#edf8f1] text-[#0d6832]" : "text-[#56665d] hover:bg-[#f6f9f7]"}`}
                  >
                    <span>🇬🇧</span>
                    <span>English</span>
                    {locale === "en" && (
                      <span className="ml-auto size-1.5 rounded-full bg-[#119444]" />
                    )}
                  </Link>
                </div>
              )}
            </div>

            <Link
              href={`/${locale}/contact#contact-form`}
              className="inline-flex h-10 items-center gap-1.5 rounded-full bg-[#0f813b] px-4 text-[11px] font-extrabold !text-[#EEEEEE] shadow-[0_8px_20px_rgba(15,129,59,.18)] transition hover:bg-[#0a6c32]"
            >
              {t.actions.contact}
              <ArrowUpRight className="size-3.5" />
            </Link>
          </div>

          <button
            aria-label="Open menu"
            onClick={() => setOpen(true)}
            className="grid size-10 place-items-center rounded-full border border-[#dfe8e2] bg-white text-[#1f3e2b] lg:hidden"
          >
            <Menu className="size-5" />
          </button>
        </div>
      </header>

      {open && (
        <div
          className="fixed inset-0 z-50 bg-[#0d1a13]/40 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
        >
          <aside
            className="ml-auto flex h-full w-[92%] max-w-sm flex-col bg-white p-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="grid size-10 place-items-center rounded-xl bg-[#0f813b] text-xs font-black text-white">
                  KAQ
                </div>
                <span className="font-display text-lg font-black tracking-[-.03em] text-[#143b23]">
                  Khang Anh Quân
                </span>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="grid size-10 place-items-center rounded-full bg-[#f5f9f6]"
              >
                <X className="size-5" />
              </button>
            </div>

            <form action={`/${locale}/products`} className="relative mt-7">
              <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#718078]" />
              <Input
                name="search"
                placeholder={t.search.placeholder}
                className="h-11 rounded-xl pl-10"
              />
            </form>

            <nav className="mt-6 space-y-1">
              {nav.map(([href, label]) => (
                <Link
                  key={href}
                  onClick={() => setOpen(false)}
                  href={`/${locale}${href === "/" ? "" : href}`}
                  className="block rounded-xl px-3 py-3.5 text-[15px] font-bold text-[#274632] hover:bg-[#edf8f1]"
                >
                  {label}
                </Link>
              ))}
            </nav>

            <Link
              onClick={() => setOpen(false)}
              href={`/${locale}/contact#contact-form`}
              className="mt-5 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#0f813b] px-5 text-sm font-extrabold text-white"
            >
              {t.actions.contact}
              <ArrowUpRight className="size-4" />
            </Link>

            <div className="mt-7">
              <div className="mb-2 text-[11px] font-extrabold uppercase tracking-[.14em] text-[#7a8981]">
                Language
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Link
                  onClick={() => setOpen(false)}
                  href={`/vi${localPath}`}
                  className={`rounded-xl border px-3 py-3 text-sm font-bold ${locale === "vi" ? "border-[#bed7c5] bg-[#edf8f1] text-[#0d6832]" : "border-[#dfe8e2] text-[#234632]"}`}
                >
                  🇻🇳 Tiếng Việt
                </Link>
                <Link
                  onClick={() => setOpen(false)}
                  href={`/en${localPath}`}
                  className={`rounded-xl border px-3 py-3 text-sm font-bold ${locale === "en" ? "border-[#bed7c5] bg-[#edf8f1] text-[#0d6832]" : "border-[#dfe8e2] text-[#234632]"}`}
                >
                  🇬🇧 English
                </Link>
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
