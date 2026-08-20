import Image from "next/image";
import type { Metadata } from "next";
import { getLocale, getDictionary } from "@/lib/i18n";
import { getPartners } from "@/lib/data";
import { SectionHeading } from "@/components/public/section-heading";

// Cho phép Next.js cache trang này (ISR) thay vì render động 100% mỗi
// lần có request, giúp việc chuyển trang nhanh hơn nhiều.
export const revalidate = 60;

const localLogos = [
  ["PV GAS", "/partners/pvgas.png"],
  ["PTSC", "/partners/ptsc.png"],
  ["PVC", "/partners/pvc.png"],
  ["PVC-PT", "/partners/pvc-pt.png"],
  ["PV OIL", "/partners/pvoil.png"],
  ["PV GAS North", "/partners/gas-north.png"],
  ["PV GAS South", "/partners/gas-south.png"],
  ["BSR", "/partners/bsr.png"],
  ["Saigon Petro", "/partners/saigon-petro.png"],
  ["Petrolimex", "/partners/petrolimex.png"],
] as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = getLocale((await params).locale);
  const t = getDictionary(locale).meta.partners;
  return {
    title: t.title,
    description: t.description,
    alternates: {
      canonical: `/${locale}/partners`,
      languages: {
        vi: "/vi/partners",
        en: "/en/partners",
        "x-default": "/vi/partners",
      },
    },
    openGraph: { title: t.title, description: t.description, type: "website" },
  };
}

export default async function Partners({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = getLocale((await params).locale);
  const partners = await getPartners();
  const dbLogos = partners
    .filter((p) => p.logo)
    .map((p) => [p.name, p.logo] as const);
  const logos = dbLogos.length ? dbLogos : localLogos;
  const isVi = locale === "vi";
  return (
    <main>
      <section className="section-pad pb-12">
        <div className="container-kaq max-w-[1180px]">
          <SectionHeading
            eyebrow={isVi ? "Đối tác & khách hàng" : "Partners & customers"}
            title={
              isVi
                ? "Những thương hiệu đồng hành cùng Khang Anh Quân"
                : "Brands working alongside Khang Anh Quan"
            }
            description={
              isVi
                ? "Mạng lưới nhà sản xuất và khách hàng trong các lĩnh vực công nghiệp, dầu khí, LPG, PCCC và hệ thống đường ống."
                : "A network of manufacturers and customers across industrial, oil & gas, LPG, fire protection and piping applications."
            }
          />
        </div>
      </section>
      <section className="pb-20">
        <div className="container-kaq max-w-[1180px]">
          <div className="overflow-hidden rounded-[28px] border border-[#dfe8e2] bg-[#f4faf6] shadow-[0_18px_45px_rgba(20,35,27,.05)]">
            <div className="grid items-center gap-8 px-7 py-8 md:grid-cols-[.85fr_1.15fr] md:px-10 md:py-10">
              <div>
                <div className="eyebrow">
                  {isVi ? "Nhà sản xuất" : "Manufacturer"}
                </div>
                <h2 className="heading-display mt-3 text-4xl font-extrabold tracking-[-.05em] md:text-5xl">
                  Itron
                </h2>
                <p className="mt-4 max-w-md text-sm leading-7 text-[#65756c]">
                  {isVi
                    ? "Thương hiệu công nghệ được Khang Anh Quân giới thiệu trong hệ sinh thái thiết bị và giải pháp kỹ thuật."
                    : "A technology brand represented within Khang Anh Quân's equipment and engineering solutions ecosystem."}
                </p>
              </div>
              <div className="grid min-h-[170px] place-items-center rounded-[22px] border border-[#d9e8dd] bg-white">
                <Image
                  src="/partners/itron.png"
                  alt="Itron"
                  width={260}
                  height={130}
                  className="h-auto w-[170px] object-contain md:w-[210px]"
                  priority
                />
              </div>
            </div>
          </div>
          <div className="mt-14">
            <div className="flex items-end justify-between gap-5 border-b border-[#e0e8e3] pb-4">
              <div>
                <div className="eyebrow">
                  {isVi
                    ? "Khách hàng & đơn vị tiêu biểu"
                    : "Selected customers"}
                </div>
                <h2 className="heading-display mt-2 text-2xl font-extrabold md:text-3xl">
                  {isVi ? "Các thương hiệu đồng hành" : "Trusted brands"}
                </h2>
              </div>
              <span className="hidden text-xs font-bold text-[#8a978f] sm:block">
                {logos.length} {isVi ? "thương hiệu" : "brands"}
              </span>
            </div>
            <div className="mt-2 grid grid-cols-2 divide-x divide-y divide-[#e6ece8] border-l border-t border-[#e6ece8] sm:grid-cols-3 lg:grid-cols-5">
              {logos.map(([name, src]) => (
                <div
                  key={name}
                  className="group flex min-h-[138px] items-center justify-center bg-white px-5 py-7 transition hover:bg-[#f8fbf9]"
                >
                  <Image
                    src={src}
                    alt={name}
                    width={190}
                    height={90}
                    className="max-h-20 w-auto max-w-[150px] object-contain opacity-100 transition duration-300 group-hover:scale-[1.04]"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
