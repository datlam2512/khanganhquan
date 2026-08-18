import { notFound } from "next/navigation";
import Image from "next/image";
import { getLocale, getDictionary } from "@/lib/i18n";
import { getCategories, getProduct, getProducts } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/public/product-card";

export default async function ProductDetail({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: rawLocale, slug } = await params;
  const locale = getLocale(rawLocale);
  const t = getDictionary(locale);
  const [product, categories, allProducts] = await Promise.all([getProduct(slug), getCategories(), getProducts()]);
  if (!product) notFound();
  const category = categories.find((c) => c.slug === product.categorySlug);
  const name = locale === "vi" ? product.name : product.nameEn;
  const related = allProducts.filter((x) => x.id !== product.id && x.categorySlug === product.categorySlug).slice(0, 4);
  return (
    <main>
      <section className="section-pad bg-[#F7FAF8]"><div className="container-kaq grid gap-10 lg:grid-cols-[1.05fr_.95fr] lg:items-start">
        <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-[#E4EBE6] bg-white"><Image src={product.image} alt={name} fill className="object-cover" priority /></div>
        <div><div className="eyebrow">{category ? (locale === "vi" ? category.name : category.nameEn) : "Product"}</div><h1 className="mt-3 text-4xl font-black tracking-tight text-[#173826] md:text-5xl">{name}</h1><p className="mt-5 text-lg leading-8 text-[#66746C]">{locale === "vi" ? product.description : product.descriptionEn}</p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2"><div className="rounded-xl border border-[#E0E8E3] bg-white p-4"><div className="text-xs font-bold uppercase text-[#75837B]">Product code</div><div className="mt-1 font-extrabold">{product.code || "—"}</div></div><div className="rounded-xl border border-[#E0E8E3] bg-white p-4"><div className="text-xs font-bold uppercase text-[#75837B]">Material</div><div className="mt-1 font-extrabold">{locale === "vi" ? product.material : product.materialEn}</div></div></div>
          <Button href={`/${locale}/contact#contact-form`} className="mt-7">{t.actions.contact}</Button>
        </div>
      </div></section>
      <section className="section-pad"><div className="container-kaq grid gap-8 lg:grid-cols-3"><div className="lg:col-span-2 space-y-6">
        <div className="rounded-2xl border border-[#E5EBE7] p-6"><h2 className="text-xl font-black">{locale === "vi" ? "Tiêu chuẩn" : "Standards"}</h2><p className="mt-3 text-sm leading-7 text-[#68766F]">{locale === "vi" ? product.standards : product.standards}</p></div>
        <div className="rounded-2xl border border-[#E5EBE7] p-6"><h2 className="text-xl font-black">{locale === "vi" ? "Ứng dụng" : "Applications"}</h2><p className="mt-3 text-sm leading-7 text-[#68766F]">{locale === "vi" ? product.applications : product.applicationsEn}</p></div>
      </div><div className="rounded-2xl bg-[#EAF7EF] p-6"><div className="eyebrow">Need details?</div><h3 className="mt-3 text-2xl font-black text-[#163B26]">{locale === "vi" ? "Trao đổi với đội ngũ của chúng tôi." : "Talk to our team."}</h3><Button href={`/${locale}/contact#contact-form`} className="mt-6">{t.actions.contact}</Button></div></div></section>
      {related.length > 0 && <section className="pb-20"><div className="container-kaq"><h2 className="text-2xl font-black">{locale === "vi" ? "Sản phẩm liên quan" : "Related products"}</h2><div className="mt-7 grid gap-5 md:grid-cols-2 lg:grid-cols-4">{related.map((x) => <ProductCard key={x.id} product={x} locale={locale} categories={categories} />)}</div></div></section>}
    </main>
  );
}
