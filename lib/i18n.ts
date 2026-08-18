import { Locale } from "@/lib/types";

export const dictionaries = {
  vi: {
    nav: { home: "Trang chủ", about: "Giới thiệu", products: "Sản phẩm", projects: "Dự án", partners: "Đối tác", contact: "Liên hệ" },
    actions: { products: "Xem sản phẩm", contact: "Liên hệ với chúng tôi", details: "Xem chi tiết", all: "Xem tất cả", direction: "Chỉ đường", call: "Gọi ngay" },
    hero: { eyebrow: "Thiết bị & vật tư công nghiệp", title: "Giải pháp thiết bị công nghiệp đáng tin cậy", desc: "Đồng hành cùng các hệ thống công nghiệp, dầu khí, LPG, PCCC và đường ống bằng danh mục thiết bị và vật tư chuyên dụng.", badge: "Website doanh nghiệp B2B" },
    sections: { about: "Về Khang Anh Quân", categories: "Danh mục sản phẩm", featured: "Sản phẩm nổi bật", projects: "Dự án tiêu biểu", partners: "Đối tác", why: "Giá trị chúng tôi theo đuổi" },
    search: { placeholder: "Tìm kiếm sản phẩm...", results: "sản phẩm được tìm thấy", empty: "Không tìm thấy sản phẩm phù hợp.", clear: "Xóa bộ lọc", all: "Xem tất cả kết quả" },
    footer: { desc: "Thiết bị, vật tư và giải pháp công nghiệp.", quick: "Liên kết nhanh" }
  },
  en: {
    nav: { home: "Home", about: "About Us", products: "Products", projects: "Projects", partners: "Partners", contact: "Contact" },
    actions: { products: "View products", contact: "Contact us", details: "View details", all: "View all", direction: "Get directions", call: "Call now" },
    hero: { eyebrow: "Industrial equipment & materials", title: "Reliable industrial equipment solutions", desc: "Supporting industrial, oil & gas, LPG, fire protection and piping systems with professional equipment and materials.", badge: "B2B corporate website" },
    sections: { about: "About Khang Anh Quan", categories: "Product categories", featured: "Featured products", projects: "Featured projects", partners: "Partners", why: "What we focus on" },
    search: { placeholder: "Search products...", results: "products found", empty: "No products found.", clear: "Clear filters", all: "View all results" },
    footer: { desc: "Industrial equipment, materials and solutions.", quick: "Quick links" }
  }
} as const;

export function getDictionary(locale: Locale) { return dictionaries[locale]; }

export function getLocale(value?: string): Locale { return value === "en" ? "en" : "vi"; }
