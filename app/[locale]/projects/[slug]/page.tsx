import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getLocale, getDictionary } from "@/lib/i18n";
import { getProject, getProjects } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { ProjectGallery } from "@/components/public/project-gallery";

// Cho phép Next.js cache trang này (ISR) thay vì render động 100% mỗi
// lần có request, giúp việc chuyển trang nhanh hơn nhiều.
export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const raw = await params;
  const project = await getProject(raw.slug);
  if (!project) return {};
  const locale = getLocale(raw.locale);
  const title = locale === "vi" ? project.title : project.titleEn;
  const description =
    locale === "vi" ? project.description : project.descriptionEn;
  return {
    title: `${title} | Khang Anh Quân`,
    description,
    alternates: {
      canonical: `/${locale}/projects/${project.slug}`,
      languages: {
        vi: `/vi/projects/${project.slug}`,
        en: `/en/projects/${project.slug}`,
        "x-default": `/vi/projects/${project.slug}`,
      },
    },
    openGraph: { title, description, type: "article" },
  };
}

export default async function ProjectDetail({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const raw = await params;
  const locale = getLocale(raw.locale);
  const t = getDictionary(locale);
  const project = await getProject(raw.slug);
  if (!project) notFound();

  const allProjects = await getProjects();

  const relatedProjects = allProjects
    .filter((item) => item.id !== project.id && item.published)
    .slice(0, 3);

  const title = locale === "vi" ? project.title : project.titleEn;
  const description =
    locale === "vi" ? project.description : project.descriptionEn;

  return (
    <main>
      <section className="section-pad bg-[#f7faf8] pb-10">
        <div className="container-kaq max-w-[1180px]">
          <h1 className="heading-display mt-3 max-w-4xl text-4xl font-extrabold leading-tight tracking-[-.045em] text-[#173826] md:text-6xl">
            {title}
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-[#66746d] md:text-lg">
            {description}
          </p>
          <ProjectGallery images={project.gallery} title={title} />
        </div>
      </section>

      <section className="pb-24">
        <div className="container-kaq max-w-[1180px]">
          {/* Related projects */}
          {relatedProjects.length > 0 && (
            <div className="border-t border-[#e4ebe6] pt-16">
              <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                <div>
                  <div className="eyebrow">
                    {locale === "vi" ? "Khám phá thêm" : "Explore more"}
                  </div>

                  <h2 className="heading-display mt-3 text-3xl font-extrabold tracking-[-.04em] text-[#173826] md:text-4xl">
                    {locale === "vi" ? "Các dự án khác" : "Other projects"}
                  </h2>

                  <p className="mt-3 max-w-2xl text-sm leading-7 text-[#66746d]">
                    {locale === "vi"
                      ? "Khám phá thêm những dự án khác của Khang Anh Quân."
                      : "Explore more projects completed by Khang Anh Quân."}
                  </p>
                </div>

                <Button href={`/${locale}/projects`} variant="outline">
                  {locale === "vi" ? "Xem tất cả dự án" : "View all projects"}
                </Button>
              </div>

              <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {relatedProjects.map((item) => {
                  const itemTitle = locale === "vi" ? item.title : item.titleEn;

                  const itemDescription =
                    locale === "vi" ? item.description : item.descriptionEn;

                  return (
                    <a
                      key={item.id}
                      href={`/${locale}/projects/${item.slug}`}
                      className="group overflow-hidden rounded-[24px] border border-[#dfe8e2] bg-white transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(20,35,27,.08)]"
                    >
                      <div className="relative aspect-[16/10] overflow-hidden bg-[#edf3ef]">
                        {item.coverImage && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={item.coverImage}
                            alt={itemTitle}
                            className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
                          />
                        )}

                        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent" />

                        <div className="absolute bottom-4 left-4 right-4">
                        </div>
                      </div>

                      <div className="p-5">
                        <h3 className="text-lg font-extrabold leading-tight text-[#173826]">
                          {itemTitle}
                        </h3>

                        <p className="mt-2 line-clamp-3 text-sm leading-6 text-[#68756e]">
                          {itemDescription}
                        </p>

                        <div className="mt-5 text-sm font-extrabold text-[#11823b]">
                          {locale === "vi" ? "Xem dự án →" : "View project →"}
                        </div>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
          )}

          {/* Contact */}
          <div className="mt-14">
            <Button href={`/${locale}/contact#contact-form`} className="!text-white">
              {t.actions.contact}
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
