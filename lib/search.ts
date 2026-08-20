import { products } from "@/data/site";

function normalize(input: string) {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function specGroupsToText(
  groups: typeof products[number]["specGroupsVi"],
) {
  return groups
    .map((group) => {
      const rows = (group.rows ?? []).flatMap((row) =>
        Array.isArray(row) ? row : [row],
      );

      const nestedGroups = (group.groups ?? []).flatMap(
        (nestedGroup) => [
          nestedGroup.name ?? "",
          ...(nestedGroup.items ?? []).flatMap((item) =>
            Array.isArray(item) ? item : [item],
          ),
        ],
      );

      return [
        group.title ?? "",
        group.content ?? "",
        ...(group.columns ?? []),
        ...rows,
        ...nestedGroups,
      ].join(" ");
    })
    .join(" ");
}

export function searchProducts(query: string) {
  const q = normalize(query);

  if (!q) return products;

  return products.filter((p) => {
    const specText = [
      specGroupsToText(p.specGroupsVi),
      specGroupsToText(p.specGroupsEn),
    ].join(" ");

    const hay = normalize(
      [
        p.name,
        p.nameEn,
        p.code,
        p.short,
        p.shortEn,
        p.description,
        p.descriptionEn,
        p.material,
        p.materialEn,
        specText,
      ].join(" "),
    );

    return hay.includes(q);
  });
}