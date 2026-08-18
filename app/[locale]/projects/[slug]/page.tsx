import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getLocale, getDictionary } from "@/lib/i18n";
import { getProject } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { ProjectGallery } from "@/components/public/project-gallery";

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

      <section className="pb-20">
        <div className="container-kaq max-w-[1180px]">
          <div className="grid gap-6 md:grid-cols-2"></div>
          <div className="mt-8 !text-[#EEEEEE]">
            <Button href={`/${locale}/contact#contact-form`}>
              {t.actions.contact}
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
