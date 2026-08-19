import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Locale } from "@/lib/types";
import { getDictionary } from "@/lib/i18n";
import { company } from "@/data/site";
import NextImage from "next/image";
export function Footer({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  return (
    <footer className="border-t border-[#dfe8e2] bg-[#0b2817] text-white">
      <div className="container-kaq py-14 md:py-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_.7fr_.9fr]">
          <div>
            <div className="flex items-center gap-3">
                 <div className="relative size-15 shrink-0">
                           <NextImage
                             src="/logo/logo-green.png"
                             alt="Khang Anh Quân"
                             fill
                             priority
                             className="object-contain"
                           />
                         </div>
              <div>
                <div className="font-display text-lg font-extrabold tracking-[-.02em]">{locale === "vi" ? company.name : company.nameEn}</div>
                <div className="mt-1 text-[9px] font-bold tracking-[.18em] text-white/40">INDUSTRIAL EQUIPMENT</div>
              </div>
            </div>
            <p className="mt-6 max-w-xl text-sm leading-7 text-white/62">
              {locale === "vi" ? company.description : company.descriptionEn}
            </p>
            <Link href={`/${locale}/contact#contact-form`} className="mt-7 inline-flex items-center gap-2 text-sm font-extrabold text-[#b8e7c6] hover:text-white">
              {t.actions.contact}<ArrowUpRight className="size-4" />
            </Link>
          </div>

          <div>
            <div className="text-[11px] font-extrabold uppercase tracking-[.16em] text-white/35">{t.footer.quick}</div>
            <div className="mt-4 space-y-2.5">
              {([
                ["/", t.nav.home],
                ["/about", t.nav.about],
                ["/products", t.nav.products],
                ["/projects", t.nav.projects],
                ["/partners", t.nav.partners],
                ["/contact", t.nav.contact],
              ] as const).map(([h, l]) => (
                <Link key={h} href={`/${locale}${h === "/" ? "" : h}`} className="block text-sm font-semibold text-white/62 transition hover:text-white">{l}</Link>
              ))}
            </div>
          </div>

          <div>
            <div className="text-[11px] font-extrabold uppercase tracking-[.16em] text-white/35">{t.nav.contact}</div>
            <div className="mt-4 space-y-3 text-sm leading-6 text-white/62">
              <div>091373137 (Mr Lan)</div>
              <div>090959660 (Mr Thái)</div>
              <div>0963191589 (Mr Tín)</div>
              <div className="break-all">{company.email}</div>
              <div>{company.headquarters}</div>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-5 text-xs text-white/35 md:flex-row md:items-center md:justify-between">
          <div>© {new Date().getFullYear()} {company.name}. All rights reserved.</div>
          <div>VI · EN</div>
        </div>
      </div>
    </footer>
  );
}
