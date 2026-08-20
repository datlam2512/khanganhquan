import Image from "next/image";
import { getLocale, getDictionary } from "@/lib/i18n";
import { getProjects } from "@/lib/data";
import { SectionHeading } from "@/components/public/section-heading";

// Cho phép Next.js cache trang này (ISR) thay vì render động 100% mỗi
// lần có request, giúp việc chuyển trang nhanh hơn nhiều.
export const revalidate = 60;
export default async function Projects({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = getLocale((await params).locale);
  const t = getDictionary(locale);
  const projects = await getProjects();
  return (
    <main>
      <section className="section-pad bg-[#F7FAF8] border-b border-[#E5EBE7]">
        <div className="container-kaq">
          <SectionHeading
            eyebrow="Projects"
            title={t.nav.projects}
            description={
              locale === "vi"
                ? "Một số dự án tiêu biểu"
                : "Some outstanding projects "
            }
          />
        </div>
      </section>
      <section className="section-pad">
        <div className="container-kaq grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <a
              key={p.id}
              href={`/${locale}/projects/${p.slug}`}
              className="overflow-hidden rounded-2xl border border-[#E5EBE7] group"
            >
              <div className="relative aspect-[16/10]">
                <Image
                  src={p.coverImage}
                  alt={locale === "vi" ? p.title : p.titleEn}
                  fill
                  className="object-cover transition group-hover:scale-105"
                />
              </div>
              <div className="p-5">
                <h2 className="mt-2 text-xl font-black">
                  {locale === "vi" ? p.title : p.titleEn}
                </h2>
                <p className="mt-2 text-sm leading-6 text-[#69776F]">
                  {locale === "vi" ? p.description : p.descriptionEn}
                </p>
              </div>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
