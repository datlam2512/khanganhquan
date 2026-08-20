"use client";

import Image from "next/image";

type Partner = {
  id: string;
  name: string;
  logo: string;
};

type PartnersMarqueeProps = {
  partners: Partner[];
  locale: "vi" | "en";
};

export function PartnersMarquee({
  partners,
  locale,
}: PartnersMarqueeProps) {
  if (!partners.length) return null;

  const items = [...partners, ...partners];

  return (
    <section className="overflow-hidden border-y border-[#e5ebe7] bg-white py-16">
      <div className="container-kaq mb-8 flex items-end justify-between gap-6">
        <div>
          <div className="eyebrow">
            {locale === "vi" ? "Đối tác" : "Partners"}
          </div>

          <h2 className="heading-display mt-2 text-3xl font-extrabold tracking-[-.04em] text-[#173826] md:text-4xl">
            {locale === "vi"
              ? "Đối tác & khách hàng"
              : "Partners & Clients"}
          </h2>
        </div>

        <div className="hidden text-xs font-semibold text-[#87938c] md:block">
          {locale === "vi"
            ? "Những thương hiệu đồng hành cùng Khang Anh Quân"
            : "Brands partnering with Khang Anh Quân"}
        </div>
      </div>

      <div className="relative overflow-hidden">
        <div className="flex w-max animate-[marquee_38s_linear_infinite] gap-4 pr-4 hover:[animation-play-state:paused]">
          {items.map((partner, index) => (
            <div
              key={`${partner.id}-${index}`}
              className="flex h-28 w-44 shrink-0 items-center justify-center rounded-2xl border border-[#e5ebe7] bg-white px-6 transition hover:border-[#bcd8c5] hover:shadow-[0_10px_28px_rgba(20,35,27,.06)]"
            >
              <Image
                src={partner.logo}
                alt={partner.name}
                width={130}
                height={70}
                className="max-h-16 w-auto max-w-[128px] object-contain"
              />
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </section>
  );
}
