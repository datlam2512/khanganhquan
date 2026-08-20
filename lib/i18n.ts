import { Locale } from "@/lib/types";

export const dictionaries = {
  vi: {
    nav: {
      home: "Trang chủ",
      about: "Giới thiệu",
      products: "Sản phẩm",
      projects: "Dự án",
      partners: "Đối tác",
      contact: "Liên hệ",
    },
    actions: {
      products: "Xem sản phẩm",
      contact: "Liên hệ với chúng tôi",
      details: "Xem chi tiết",
      all: "Xem tất cả",
      direction: "Chỉ đường",
      call: "Gọi ngay",
    },
    hero: {
      eyebrow: "Thiết bị & vật tư công nghiệp",
      title: "Giải pháp thiết bị công nghiệp đáng tin cậy",
      desc: "Đồng hành cùng các hệ thống công nghiệp, dầu khí, LPG, PCCC và đường ống bằng danh mục thiết bị và vật tư chuyên dụng.",
      badge: "Website doanh nghiệp B2B",
    },
    sections: {
      about: "Về Khang Anh Quân",
      categories: "Danh mục sản phẩm",
      featured: "Sản phẩm nổi bật",
      projects: "Dự án tiêu biểu",
      partners: "Đối tác",
      why: "Giá trị chúng tôi theo đuổi",
    },
    search: {
      placeholder: "Tìm kiếm sản phẩm...",
      results: "sản phẩm được tìm thấy",
      empty: "Không tìm thấy sản phẩm phù hợp.",
      clear: "Xóa bộ lọc",
      all: "Xem tất cả kết quả",
    },
    footer: {
      desc: "Thiết bị, vật tư và giải pháp công nghiệp.",
      quick: "Liên kết nhanh",
    },
    meta: {
      about: {
        title: "Giới thiệu công ty | Khang Anh Quân",
        description:
          "Khang Anh Quân chuyên cung cấp thiết bị, vật tư và giải pháp phục vụ các ngành công nghiệp, dầu khí, LPG, PCCC và hệ thống đường ống tại Việt Nam.",
      },
      products: {
        title: "Sản phẩm | Khang Anh Quân",
        description:
          "Danh mục thiết bị công nghiệp: ống thép & phụ kiện, van công nghiệp, thiết bị PCCC, bơm và máy nén khí, thiết bị LPG và nhiều nhóm sản phẩm khác.",
      },
      partners: {
        title: "Đối tác & khách hàng | Khang Anh Quân",
        description:
          "Khang Anh Quân đồng hành cùng các đối tác lớn trong ngành dầu khí, gas và năng lượng như PV GAS, PTSC, Petrolimex, Saigon Petro, BSR.",
      },
      contact: {
        title: "Liên hệ | Khang Anh Quân",
        description:
          "Liên hệ Công ty TNHH Khang Anh Quân qua điện thoại, email hoặc tại trụ sở chính 39/1 Nguyễn Cửu Đàm, Tân Phú, TP. Hồ Chí Minh.",
      },
    },
  },
  en: {
    nav: {
      home: "Home",
      about: "About Us",
      products: "Products",
      projects: "Projects",
      partners: "Partners",
      contact: "Contact",
    },
    actions: {
      products: "View products",
      contact: "Contact us",
      details: "View details",
      all: "View all",
      direction: "Get directions",
      call: "Call now",
    },
    hero: {
      eyebrow: "Industrial equipment & materials",
      title: "Reliable industrial equipment solutions",
      desc: "Supporting industrial, oil & gas, LPG, fire protection and piping systems with professional equipment and materials.",
      badge: "B2B corporate website",
    },
    sections: {
      about: "About Khang Anh Quan",
      categories: "Product categories",
      featured: "Featured products",
      projects: "Featured projects",
      partners: "Partners",
      why: "What we focus on",
    },
    search: {
      placeholder: "Search products...",
      results: "products found",
      empty: "No products found.",
      clear: "Clear filters",
      all: "View all results",
    },
    footer: {
      desc: "Industrial equipment, materials and solutions.",
      quick: "Quick links",
    },
    meta: {
      about: {
        title: "About Us | Khang Anh Quan",
        description:
          "Khang Anh Quan supplies equipment, materials and solutions for industrial, oil & gas, LPG, fire protection and piping systems in Vietnam.",
      },
      products: {
        title: "Products | Khang Anh Quan",
        description:
          "Industrial equipment catalog: steel pipes & fittings, industrial valves, fire protection equipment, pumps & air compressors, LPG equipment and more.",
      },
      partners: {
        title: "Partners & Clients | Khang Anh Quan",
        description:
          "Khang Anh Quan works alongside major oil & gas and energy partners including PV GAS, PTSC, Petrolimex, Saigon Petro, BSR.",
      },
      contact: {
        title: "Contact | Khang Anh Quan",
        description:
          "Contact Khang Anh Quan Co., Ltd. by phone, email or at our head office, 39/1 Nguyen Cuu Dam, Tan Phu, Ho Chi Minh City.",
      },
    },
  },
} as const;

export function getDictionary(locale: Locale) {
  return dictionaries[locale];
}

export function getLocale(value?: string): Locale {
  return value === "en" ? "en" : "vi";
}
