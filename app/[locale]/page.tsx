import Image from "next/image";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Handshake,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import { getLocale, getDictionary } from "@/lib/i18n";
import {
  getCategories,
  getCompany,
  getProducts,
  getProjects,
  getHeroSlides,
  getPartners,
} from "@/lib/data";
import { SectionHeading } from "@/components/public/section-heading";
import { ProductCard } from "@/components/public/product-card";
import { Hero } from "@/components/public/hero";
import { Button } from "@/components/ui/button";
import { CompanyContact } from "@/components/public/company-contact";
import { Reveal } from "@/components/public/reveal";
import { PartnersMarquee } from "@/components/public/partners-marquee";

// Cho phép Next.js cache trang này (ISR) thay vì render động 100% mỗi
// lần có request, giúp việc chuyển trang nhanh hơn nhiều.
export const revalidate = 60;

type HomeProps = { params: Promise<{ locale: string }> };

export default async function Home({ params }: HomeProps) {
  const { locale: rawLocale } = await params;
  const locale = getLocale(rawLocale);
  const t = getDictionary(locale);

  const [categories, company, products, projects, heroSlides, partners] =
    await Promise.all([
      getCategories(),
      getCompany(),
      getProducts(),
      getProjects(),
      getHeroSlides(),
      getPartners(),
    ]);

  const featuredProjects = projects.slice(0, 3);

  return (
    <main>
      <Hero locale={locale} slides={heroSlides} />

      {/* Intro */}
      <Reveal>
        <section className="section-pad py-20 md:py-24">
          <div className="container-kaq grid gap-10 lg:grid-cols-[.9fr_1.1fr] lg:items-stretch">
            <div className="">
              <div className="eyebrow">{t.sections.about}</div>
              <h2 className="heading-display mt-4 max-w-xl text-4xl font-extrabold leading-[1.03] text-[#103420] md:text-5xl">
                Kết nối thiết bị,
                <span className="text-[#11823b]"> vật tư</span> và nhu cầu kỹ
                thuật.
              </h2>
            </div>
            <div className="max-w-2xl">
              <p className="text-[17px] leading-8 text-[#66746d]">
                {locale === "vi" ? company.description : company.descriptionEn}
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Button href={`/${locale}/about`} className="!text-[#EEEEEE]">
                  {t.actions.details}
                  <ArrowRight className="size-4" />
                </Button>
                <Button href={`/${locale}/products`} variant="outline">
                  {t.actions.products}
                  <ArrowRight className="size-4" />
                </Button>
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      {/* Capabilities */}
      <Reveal>
        <section className="border-y border-[#e7eee9] bg-[#f7faf8] py-20 md:py-24">
          <div className="container-kaq grid lg:grid-cols-[.95fr_1.05fr]">
            <div className="border-b border-[#e7eee9] py-16 lg:border-b-0 lg:border-r lg:pr-14 lg:py-20">
              <div className="eyebrow">Khang Anh Quân</div>
              <h3 className="heading-display mt-4 text-3xl font-extrabold leading-tight text-[#163a26] md:text-4xl">
                Tập trung vào những gì khách hàng cần để triển khai hệ thống
                hiệu quả.
              </h3>
              <p className="mt-5 max-w-xl text-sm leading-7 text-[#6a776f]">
                Thiết bị công nghiệp, vật tư đường ống, van và giải pháp phục vụ
                các hệ thống kỹ thuật.
              </p>
            </div>

            <div className="grid sm:grid-cols-2">
              {[
                [
                  Building2,
                  "Danh mục rõ ràng",
                  "Khách hàng dễ tìm nhóm thiết bị phù hợp.",
                ],
                [
                  ShieldCheck,
                  "Thông tin minh bạch",
                  "Nội dung sản phẩm được quản lý tập trung.",
                ],
                [
                  Wrench,
                  "Hỗ trợ kỹ thuật",
                  "Thông tin được trình bày theo nhu cầu thực tế.",
                ],
                [
                  Handshake,
                  "Đồng hành dự án",
                  "Kết nối sản phẩm với nhu cầu triển khai.",
                ],
              ].map(([Icon, title, desc], idx) => {
                const C = Icon as typeof Building2;
                return (
                  <div
                    key={title as string}
                    className={`p-7 md:p-8 ${idx % 2 === 0 ? "sm:border-r sm:border-[#e7eee9]" : ""} ${idx < 2 ? "border-b border-[#e7eee9]" : ""}`}
                  >
                    <C className="size-6 text-[#11823b]" />
                    <div className="mt-6 text-[17px] font-extrabold text-[#183b28]">
                      {title as string}
                    </div>
                    <p className="mt-2 text-sm leading-6 text-[#6a776f]">
                      {desc as string}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </Reveal>

      {/* Categories */}
      <Reveal>
        <section className="section-pad py-20 md:py-24">
          <div className="container-kaq">
            <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <SectionHeading
                eyebrow={t.sections.categories}
                title={
                  locale === "vi"
                    ? "Nhóm sản phẩm cốt lõi"
                    : "Core product categories"
                }
                description={
                  locale === "vi"
                    ? "Danh mục được tổ chức rõ ràng để khách hàng tìm sản phẩm nhanh hơn."
                    : "Organized categories make it easier to discover the right products."
                }
              />
              <Button href={`/${locale}/products`} variant="outline">
                {t.actions.all}
                <ArrowRight className="size-4" />
              </Button>
            </div>

            <div className="mt-12 grid gap-5 lg:grid-cols-4">
              {categories.map((category) => (
                <a
                  key={category.id}
                  href={`/${locale}/products?category=${category.slug}`}
                  className="group"
                >
                  <div className="relative aspect-[4/5] overflow-hidden rounded-[24px] bg-[#eaf0ec]">
                    <Image
                      src={category.image}
                      alt={locale === "vi" ? category.name : category.nameEn}
                      fill
                      className="object-cover transition duration-700 group-hover:scale-[1.045]"
                      sizes="(max-width:1024px) 50vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#071e12]/92 via-[#071e12]/22 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                      <div className="mt-2 font-display text-xl font-extrabold leading-tight tracking-[-.025em]">
                        {locale === "vi" ? category.name : category.nameEn}
                      </div>
                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-white/72">
                        {locale === "vi"
                          ? category.description
                          : category.descriptionEn}
                      </p>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* Products */}
      <Reveal>
        <section className="section-pad border-y border-[#e8eee9] bg-[#f7faf8] py-20 md:py-24">
          <div className="container-kaq">
            <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <SectionHeading eyebrow="Catalog" title={t.sections.featured} />
              <Button href={`/${locale}/products`} variant="outline">
                {t.actions.all}
                <ArrowRight className="size-4" />
              </Button>
            </div>
            <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {products.slice(0, 4).map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  locale={locale}
                />
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* Projects */}
      <Reveal>
        <section className="section-pad py-20 md:py-24">
          <div className="container-kaq">
            <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <SectionHeading eyebrow="Projects" title={t.sections.projects} />
              <Button href={`/${locale}/projects`} variant="outline">
                {t.actions.all}
                <ArrowRight className="size-4" />
              </Button>
            </div>

            <div className="mt-12 grid gap-6 lg:grid-cols-[1.35fr_.85fr]">
              {featuredProjects[0] && (
                <a
                  href={`/${locale}/projects/${featuredProjects[0].slug}`}
                  className="group overflow-hidden rounded-[26px] border border-[#e1eae4] bg-white"
                >
                  <div className="relative aspect-[16/10]">
                    <Image
                      src={featuredProjects[0].coverImage}
                      alt={
                        locale === "vi"
                          ? featuredProjects[0].title
                          : featuredProjects[0].titleEn
                      }
                      fill
                      className="object-cover transition duration-700 group-hover:scale-[1.035]"
                      sizes="(max-width:1024px) 100vw, 60vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#071e12]/80 via-transparent to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                      <div className="mt-2 font-display text-2xl font-extrabold tracking-[-.03em] md:text-3xl">
                        {locale === "vi"
                          ? featuredProjects[0].title
                          : featuredProjects[0].titleEn}
                      </div>
                    </div>
                  </div>
                </a>
              )}
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
                {featuredProjects.slice(1, 3).map((project) => (
                  <a
                    key={project.id}
                    href={`/${locale}/projects/${project.slug}`}
                    className="group grid grid-cols-[.9fr_1.1fr] overflow-hidden rounded-[24px] border border-[#e1eae4] bg-white"
                  >
                    <div className="relative min-h-[210px]">
                      <Image
                        src={project.coverImage}
                        alt={locale === "vi" ? project.title : project.titleEn}
                        fill
                        className="object-cover transition duration-700 group-hover:scale-[1.04]"
                        sizes="35vw"
                      />
                    </div>
                    <div className="flex flex-col justify-center p-5">
                      <div className="mt-2 text-lg font-extrabold leading-tight text-[#173a27]">
                        {locale === "vi" ? project.title : project.titleEn}
                      </div>
                      <p className="mt-2 line-clamp-3 text-sm leading-6 text-[#6c7971]">
                        {locale === "vi"
                          ? project.description
                          : project.descriptionEn}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      {/* Why */}
      <Reveal>
        <section className="border-y border-[#e7eee9] bg-[#0d3a21] py-20 text-white md:py-24">
          <div className="container-kaq grid lg:grid-cols-[.9fr_1.1fr] lg:items-stretch">
            <div className="border-b border-white/10 py-16 lg:border-b-0 lg:border-r lg:py-20 lg:pr-14">
              <div className="eyebrow text-[#b8e7c6]">Why KAQ</div>
              <h2 className="heading-display mt-4 text-3xl font-extrabold leading-tight md:text-4xl">
                Tập trung vào những gì khách hàng cần để triển khai hệ thống
                hiệu quả.
              </h2>
              <p className="mt-5 max-w-xl text-sm leading-7 text-white/65">
                Website ưu tiên cho khách hàng tìm hiểu sản phẩm, dự án và cách
                liên hệ nhanh chóng.
              </p>
            </div>

            <div className="grid sm:grid-cols-2">
              {[
                [
                  CheckCircle2,
                  locale === "vi" ? "Danh mục đa dạng" : "Broad product range",
                ],
                [
                  Wrench,
                  locale === "vi" ? "Hỗ trợ kỹ thuật" : "Technical support",
                ],
                [
                  Handshake,
                  locale === "vi" ? "Đồng hành dự án" : "Project support",
                ],
                [
                  ShieldCheck,
                  locale === "vi" ? "Ưu tiên độ tin cậy" : "Reliability focus",
                ],
              ].map(([Icon, label], idx) => {
                const C = Icon as typeof CheckCircle2;
                return (
                  <div
                    key={label as string}
                    className={`p-7 md:p-8 ${idx % 2 === 0 ? "sm:border-r sm:border-white/10" : ""} ${idx < 2 ? "border-b border-white/10" : ""}`}
                  >
                    <C className="size-6 text-[#a9dfb8]" />
                    <div className="mt-5 text-base font-extrabold text-white">
                      {label as string}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </Reveal>

      <PartnersMarquee partners={partners} />

      <CompanyContact locale={locale} company={company} />
    </main>
  );
}
