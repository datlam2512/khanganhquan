import { ArrowUpRight, Globe2, Mail, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Locale } from "@/lib/types";

type CompanyContactProps = {
  locale: Locale;
  company: {
    name: string;
    email: string;
    phone: string;
    website: string;
    headquarters: string;
  };
};

export function CompanyContact({ locale, company }: CompanyContactProps) {
  const websiteUrl = `https://${company.website.replace(/^https?:\/\//, "")}`;

  const phoneUrl = `tel:${company.phone.replace(/\s/g, "")}`;

  const mapUrl =
    "https://www.google.com/maps/search/?api=1&query=39%2F1%20Nguyen%20Cuu%20Dam%20Tan%20Phu%20Ho%20Chi%20Minh";

  return (
    <section className="border-y border-[#e2ebe5] bg-[#f7faf8] py-20 md:py-24">
      <div className="container-kaq">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-stretch">
          {/* Company introduction */}
          <div className="rounded-[28px] bg-[#0d3a21] p-8 text-white shadow-[0_20px_55px_rgba(12,42,25,0.12)] md:p-10">
            <div className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#aee1bd]">
              {locale === "vi" ? "Thông tin liên hệ" : "Company contact"}
            </div>

            <h2 className="heading-display mt-3 text-3xl font-extrabold leading-tight tracking-[-0.04em] md:text-4xl">
              {company.name}
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-7 text-white/65">
              {locale === "vi"
                ? "Liên hệ trực tiếp với Khang Anh Quân qua điện thoại, email hoặc tại trụ sở chính."
                : "Reach Khang Anh Quan directly by phone, email or at our head office."}
            </p>

            <Button
              href={`/${locale}/contact`}
              variant="outline"
              className="mt-7 !border-white !bg-white !text-[#0D3A21]"
            >
              {locale === "vi"
                ? "Xem thông tin liên hệ"
                : "View contact details"}

              <ArrowUpRight className="size-4" />
            </Button>
          </div>

          {/* Contact information */}
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Phone */}
            <a
              href={phoneUrl}
              className="rounded-3xl border border-[#e0e9e3] bg-white p-6 transition hover:border-[#b9d7c3] hover:shadow-[0_12px_30px_rgba(20,35,27,0.05)]"
            >
              <Phone className="size-5 text-kaq-600" />

              <div className="mt-5 text-[10px] font-extrabold uppercase tracking-[0.15em] text-[#87938c]">
                Phone
              </div>

              <div className="mt-2 text-base font-extrabold text-[#193b27]">
                {company.phone}
              </div>
            </a>

            {/* Email */}
            <a
              href={`mailto:${company.email}`}
              className="rounded-3xl border border-[#e0e9e3] bg-white p-6 transition hover:border-[#b9d7c3] hover:shadow-[0_12px_30px_rgba(20,35,27,0.05)]"
            >
              <Mail className="size-5 text-kaq-600" />

              <div className="mt-5 text-[10px] font-extrabold uppercase tracking-[0.15em] text-[#87938c]">
                Email
              </div>

              <div className="mt-2 break-all text-base font-extrabold text-[#193b27]">
                {company.email}
              </div>
            </a>

            {/* Website */}
            <a
              href={websiteUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-3xl border border-[#e0e9e3] bg-white p-6 transition hover:border-[#b9d7c3] hover:shadow-[0_12px_30px_rgba(20,35,27,0.05)]"
            >
              <Globe2 className="size-5 text-kaq-600" />

              <div className="mt-5 text-[10px] font-extrabold uppercase tracking-[0.15em] text-[#87938c]">
                Website
              </div>

              <div className="mt-2 break-all text-base font-extrabold text-[#193b27]">
                {company.website}
              </div>
            </a>

            {/* Head office */}
            <a
              href={mapUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-3xl border border-[#e0e9e3] bg-white p-6 transition hover:border-[#b9d7c3] hover:shadow-[0_12px_30px_rgba(20,35,27,0.05)]"
            >
              <MapPin className="size-5 text-kaq-600" />

              <div className="mt-5 text-[10px] font-extrabold uppercase tracking-[0.15em] text-[#87938c]">
                {locale === "vi" ? "Trụ sở chính" : "Head office"}
              </div>

              <div className="mt-2 text-sm font-extrabold leading-6 text-[#193b27]">
                {company.headquarters}
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
