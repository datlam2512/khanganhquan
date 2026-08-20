import type { Metadata } from "next";
import { Mail, MapPin, Phone, Globe2 } from "lucide-react";
import { getLocale, getDictionary } from "@/lib/i18n";
import { getCompany } from "@/lib/data";
import { SectionHeading } from "@/components/public/section-heading";
import { Button } from "@/components/ui/button";

// Cho phép Next.js cache trang này (ISR) thay vì render động 100% mỗi
// lần có request, giúp việc chuyển trang nhanh hơn nhiều.
export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = getLocale((await params).locale);
  const t = getDictionary(locale).meta.contact;
  return {
    title: t.title,
    description: t.description,
    alternates: {
      canonical: `/${locale}/contact`,
      languages: { vi: "/vi/contact", en: "/en/contact", "x-default": "/vi/contact" },
    },
    openGraph: { title: t.title, description: t.description, type: "website" },
  };
}

export default async function Contact({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = getLocale((await params).locale);
  const t = getDictionary(locale);
  const company = await getCompany();

  return (
    <main>
      <section className="section-pad border-b border-[#e5ebe7] bg-[#f7faf8]">
        <div className="container-kaq">
          <SectionHeading
            eyebrow="Contact"
            title={t.nav.contact}
            description={
              locale === "vi"
                ? "Kết nối trực tiếp với Khang Anh Quân qua địa chỉ, điện thoại và email của công ty."
                : "Connect directly with Khang Anh Quan through the company address, phone and email."
            }
          />
        </div>
      </section>

      <section className="section-pad" id="contact-form">
        <div className="container-kaq grid gap-7 lg:grid-cols-[1.05fr_.95fr]">
          <div className="rounded-[28px] border border-[#e1eae4] bg-white p-7 shadow-[0_20px_55px_rgba(20,35,27,.06)] md:p-9">
            <div className="eyebrow">
              {locale === "vi" ? "Thông tin công ty" : "Company contact"}
            </div>
            <h2 className="heading-display mt-3 text-3xl font-extrabold tracking-[-.04em] text-[#173826] md:text-4xl">
              {company.name}
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#66746d]">
              {locale === "vi" ? company.description : company.descriptionEn}
            </p>

            <div className="mt-8 space-y-3">
              <a
                href={`tel:${company.phone.replace(/\s/g, "")}`}
                className="flex items-start gap-3 rounded-2xl border border-[#e4ece7] p-4 transition hover:border-[#b9d7c3] hover:bg-[#f8fcf9]"
              >
                <div className="grid size-10 place-items-center rounded-xl bg-[#eaf7ef] text-[#11823b]">
                  <Phone className="size-4" />
                </div>
                <div>
                  <div className="text-[10px] font-extrabold uppercase tracking-[.15em] text-[#87938c]">
                    HotLine
                  </div>
                  <div className="mt-1 text-sm font-extrabold text-[#193b27]">
                    0913731376 (Mr Lan)
                  </div>
                  <div className="mt-1 text-sm font-extrabold text-[#193b27]">
                    0909596960 (Mr Thái)
                  </div>
                  <div className="mt-1 text-sm font-extrabold text-[#193b27]">
                    0963191589 (Mr Tín)
                  </div>
                </div>
              </a>
              <a
                href={`mailto:${company.email}`}
                className="flex items-start gap-3 rounded-2xl border border-[#e4ece7] p-4 transition hover:border-[#b9d7c3] hover:bg-[#f8fcf9]"
              >
                <div className="grid size-10 place-items-center rounded-xl bg-[#eaf7ef] text-[#11823b]">
                  <Mail className="size-4" />
                </div>
                <div>
                  <div className="text-[10px] font-extrabold uppercase tracking-[.15em] text-[#87938c]">
                    Email
                  </div>
                  <div className="mt-1 text-sm font-extrabold text-[#193b27]">
                    {company.email}
                  </div>
                </div>
              </a>
              <a
                href={`https://${company.website.replace(/^https?:\/\//, "")}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-start gap-3 rounded-2xl border border-[#e4ece7] p-4 transition hover:border-[#b9d7c3] hover:bg-[#f8fcf9]"
              >
                <div className="grid size-10 place-items-center rounded-xl bg-[#eaf7ef] text-[#11823b]">
                  <Globe2 className="size-4" />
                </div>
                <div>
                  <div className="text-[10px] font-extrabold uppercase tracking-[.15em] text-[#87938c]">
                    Website
                  </div>
                  <div className="mt-1 text-sm font-extrabold text-[#193b27]">
                    {company.website}
                  </div>
                </div>
              </a>
            </div>
          </div>

          <div className="rounded-[28px] border border-[#e1eae4] bg-white p-7 shadow-[0_20px_55px_rgba(20,35,27,.06)] md:p-9">
            <div className="flex items-start gap-3">
              <div className="grid size-10 place-items-center rounded-xl bg-[#eaf7ef] text-[#11823b]">
                <MapPin className="size-4" />
              </div>
              <div>
                <div className="text-[10px] font-extrabold uppercase tracking-[.15em] text-[#87938c]">
                  {locale === "vi" ? "Trụ sở chính" : "Head office"}
                </div>
                <h2 className="mt-1 text-xl font-extrabold text-[#173826]">
                  39/1 Nguyễn Cửu Đàm
                </h2>
                <p className="mt-2 text-sm leading-7 text-[#66746d]">
                  {company.headquarters}
                </p>
              </div>
            </div>
            <div className="mt-7 overflow-hidden rounded-2xl border border-[#e4ece7] bg-[#f4f8f5] shadow-sm">
              <iframe
                title={
                  locale === "vi" ? "Bản đồ trụ sở chính" : "Head office map"
                }
                src="https://www.google.com/maps?q=39%2F1%20Nguyen%20Cuu%20Dam%2C%20Tan%20Son%20Nhi%2C%20Tan%20Phu%2C%20Ho%20Chi%20Minh%2C%20Vietnam&output=embed"
                className="h-80 w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <a
              href="https://www.google.com/maps/search/?api=1&query=39%2F1%20Nguyen%20Cuu%20Dam%20Tan%20Phu%20Chi%20Minh"
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex items-center justify-center rounded-xl bg-[#11823b] px-5 py-3 text-sm font-semibold !text-white transition hover:bg-[#0d6832]"
            >
              {t.actions.direction}
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
