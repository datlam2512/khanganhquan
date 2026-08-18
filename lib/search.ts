import { products } from "@/data/site";

function normalize(input: string) {
  return input.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
}

export function searchProducts(query: string) {
  const q = normalize(query);
  if (!q) return products;
  return products.filter((p) => {
    const hay = normalize([p.name, p.nameEn, p.code, p.short, p.shortEn, p.description, p.descriptionEn, p.material, p.materialEn, p.standards, p.applications, p.applicationsEn].join(" "));
    return hay.includes(q);
  });
}
