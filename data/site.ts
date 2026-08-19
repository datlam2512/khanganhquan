import { Category, Product, Project } from "@/lib/types";

const industrial = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=80`;

export const categories: Category[] = [
  {
    id: "c1",
    slug: "ong-thep-phu-kien",
    name: "Ống thép và phụ kiện ống",
    nameEn: "Steel Pipes & Fittings",
    description: "Ống và phụ kiện phục vụ hệ thống đường ống công nghiệp.",
    descriptionEn: "Pipes and fittings for industrial piping systems.",
    image: industrial("photo-1518770660439-4636190af475"),
    published: true,
  },
  {
    id: "c2",
    slug: "van-cong-nghiep",
    name: "Van cơ khí và van điều khiển",
    nameEn: "Industrial & Control Valves",
    description: "Các dòng van công nghiệp cho nhiều ứng dụng vận hành.",
    descriptionEn: "Industrial valves for a range of operating applications.",
    image: industrial("photo-1504917595217-d4dc5ebe6122"),
    published: true,
  },
  {
    id: "c3",
    slug: "thiet-bi-bon-xang-dau",
    name: "Van an toàn và thiết bị bồn xăng dầu",
    nameEn: "Tank Safety Equipment",
    description: "Thiết bị bảo vệ, an toàn cho bồn chứa và hệ thống phụ trợ.",
    descriptionEn:
      "Protection and safety equipment for storage tanks and systems.",
    image: industrial("photo-1581092160607-ee22621dd758"),
    published: true,
  },
  {
    id: "c4",
    slug: "thiet-bi-do",
    name: "Thiết bị đo và giảm áp",
    nameEn: "Measurement & Pressure Control",
    description: "Thiết bị đo lường và kiểm soát áp suất.",
    descriptionEn: "Instrumentation and pressure control equipment.",
    image: industrial("photo-1581092919535-7146ff1a5906"),
    published: true,
  },
  {
    id: "c5",
    slug: "thiet-bi-pccc",
    name: "Thiết bị báo cháy",
    nameEn: "Fire Detection Equipment",
    description: "Thiết bị phục vụ hệ thống cảnh báo và PCCC.",
    descriptionEn: "Equipment for fire detection and protection systems.",
    image: industrial("photo-1604014237800-1c9102c219da"),
    published: true,
  },
  {
    id: "c6",
    slug: "bom-may-nen",
    name: "Bơm và máy nén khí",
    nameEn: "Pumps & Compressors",
    description: "Giải pháp bơm và khí nén cho môi trường công nghiệp.",
    descriptionEn:
      "Pumping and compressed-air solutions for industrial environments.",
    image: industrial("photo-1581094794329-c8112a89af12"),
    published: true,
  },
  {
    id: "c7",
    slug: "lpg",
    name: "Ống mềm và máy nạp LPG",
    nameEn: "LPG Hoses & Filling Equipment",
    description: "Thiết bị phục vụ hệ thống LPG và nạp khí.",
    descriptionEn: "Equipment for LPG systems and filling applications.",
    image: industrial("photo-1532601224476-15c79f2f7a51"),
    published: true,
  },
  {
    id: "c8",
    slug: "vong-dem",
    name: "Vòng đệm",
    nameEn: "Gaskets",
    description: "Vòng đệm và vật tư làm kín cho thiết bị, đường ống.",
    descriptionEn: "Gaskets and sealing materials for equipment and piping.",
    image: industrial("photo-1517048676732-d65bc937f952"),
    published: true,
  },
];

export const products: Product[] = [
  {
    id: "p1",
    slug: "carbon-steel-pipe",
    code: "CS-P-001",
    categoryId: "c1",

    name: "Ống thép carbon",
    nameEn: "Carbon Steel Pipe",

    short: "Ống thép carbon dùng cho hệ thống đường ống công nghiệp.",
    shortEn: "Carbon steel pipe for industrial piping systems.",

    description:
      "Dòng ống thép carbon dành cho các hệ thống đường ống. Thông tin kỹ thuật chi tiết được quản trị từ CMS.",
    descriptionEn:
      "Carbon steel pipe for industrial piping systems. Detailed technical information is managed through the CMS.",

    material: "Carbon Steel",
    materialEn: "Carbon Steel",

    specGroupsVi: [
      {
        title: "Tiêu chuẩn",
        type: "text",
        content: "ASME B36.10 / API 5L / DIN / JIS",
      },
      {
        title: "Ứng dụng",
        type: "text",
        content: "Đường ống công nghiệp, dầu khí, LPG",
      },
    ],

    specGroupsEn: [
      {
        title: "Standards",
        type: "text",
        content: "ASME B36.10 / API 5L / DIN / JIS",
      },
      {
        title: "Applications",
        type: "text",
        content: "Industrial piping, oil & gas, LPG",
      },
    ],

    images: [
      {
        id: "p1-img-1",
        productId: "p1",
        imageUrl: industrial("photo-1518770660439-4636190af475"),
        altVi: "Ống thép carbon",
        altEn: "Carbon Steel Pipe",
        sortOrder: 0,
        isPrimary: true,
      },
    ],

    published: true,
  },

  {
    id: "p2",
    slug: "stainless-steel-pipe",
    code: "SS-P-002",
    categoryId: "c1",

    name: "Ống thép không gỉ",
    nameEn: "Stainless Steel Pipe",

    short: "Ống inox cho hệ thống yêu cầu khả năng chống ăn mòn.",
    shortEn: "Stainless steel pipe for corrosion-sensitive systems.",

    description:
      "Ống thép không gỉ cho nhiều hệ thống kỹ thuật và công nghiệp.",
    descriptionEn:
      "Stainless steel pipe for a wide range of technical and industrial systems.",

    material: "Stainless Steel",
    materialEn: "Stainless Steel",

    specGroupsVi: [
      {
        title: "Tiêu chuẩn",
        type: "text",
        content: "Theo cấu hình và tiêu chuẩn đặt hàng",
      },
      {
        title: "Ứng dụng",
        type: "text",
        content: "Đường ống công nghiệp và hệ thống kỹ thuật",
      },
    ],

    specGroupsEn: [
      {
        title: "Standards",
        type: "text",
        content: "According to configuration and ordering standard",
      },
      {
        title: "Applications",
        type: "text",
        content: "Industrial piping and technical systems",
      },
    ],

    images: [
      {
        id: "p2-img-1",
        productId: "p2",
        imageUrl: industrial("photo-1504917595217-d4dc5ebe6122"),
        altVi: "Ống thép không gỉ",
        altEn: "Stainless Steel Pipe",
        sortOrder: 0,
        isPrimary: true,
      },
    ],

    published: true,
  },

  {
    id: "p3",
    slug: "gate-valve",
    code: "VAL-G-001",
    categoryId: "c2",

    name: "Van cổng",
    nameEn: "Gate Valve",

    short: "Van đóng mở cho đường ống công nghiệp.",
    shortEn: "On/off valve for industrial piping.",

    description:
      "Van cổng sử dụng trong các hệ thống đường ống với nhiều cấu hình khác nhau.",
    descriptionEn:
      "Gate valve available in different configurations for industrial piping systems.",

    material: "Carbon Steel / Stainless Steel",
    materialEn: "Carbon Steel / Stainless Steel",

    specGroupsVi: [
      {
        title: "Tiêu chuẩn",
        type: "text",
        content: "Theo cấu hình sản phẩm",
      },
      {
        title: "Ứng dụng",
        type: "text",
        content: "Dầu khí, nước, khí và hệ thống công nghiệp",
      },
    ],

    specGroupsEn: [
      {
        title: "Standards",
        type: "text",
        content: "According to product configuration",
      },
      {
        title: "Applications",
        type: "text",
        content: "Oil & gas, water, gas and industrial systems",
      },
    ],

    images: [
      {
        id: "p3-img-1",
        productId: "p3",
        imageUrl: industrial("photo-1581092160607-ee22621dd758"),
        altVi: "Van cổng",
        altEn: "Gate Valve",
        sortOrder: 0,
        isPrimary: true,
      },
    ],

    published: true,
  },

  {
    id: "p4",
    slug: "ball-valve",
    code: "VAL-B-002",
    categoryId: "c2",

    name: "Van bi",
    nameEn: "Ball Valve",

    short: "Van bi cho đóng mở nhanh và tin cậy.",
    shortEn: "Ball valve for reliable and fast shutoff.",

    description: "Van bi cho các hệ thống cần giải pháp đóng mở nhanh.",
    descriptionEn: "Ball valve for systems requiring quick shutoff.",

    material: "Carbon Steel / Stainless Steel",
    materialEn: "Carbon Steel / Stainless Steel",

    specGroupsVi: [
      {
        title: "Tiêu chuẩn",
        type: "text",
        content: "Theo cấu hình sản phẩm",
      },
      {
        title: "Ứng dụng",
        type: "text",
        content: "LPG, gas, process piping",
      },
    ],

    specGroupsEn: [
      {
        title: "Standards",
        type: "text",
        content: "According to product configuration",
      },
      {
        title: "Applications",
        type: "text",
        content: "LPG, gas, process piping",
      },
    ],

    images: [
      {
        id: "p4-img-1",
        productId: "p4",
        imageUrl: industrial("photo-1581092795360-fd1ca04f0952"),
        altVi: "Van bi",
        altEn: "Ball Valve",
        sortOrder: 0,
        isPrimary: true,
      },
    ],

    published: true,
  },

  {
    id: "p5",
    slug: "api-safety-valve",
    code: "SAF-001",
    categoryId: "c3",

    name: "Van an toàn API",
    nameEn: "API Safety Valve",

    short: "Thiết bị bảo vệ áp suất cho hệ thống công nghiệp.",
    shortEn: "Pressure protection device for industrial systems.",

    description:
      "Van an toàn dành cho hệ thống cần bảo vệ quá áp theo cấu hình phù hợp.",
    descriptionEn:
      "Safety valve for pressure protection in suitable industrial applications.",

    material: "Theo cấu hình",
    materialEn: "Per configuration",

    specGroupsVi: [
      {
        title: "Tiêu chuẩn",
        type: "text",
        content: "API / tiêu chuẩn theo model",
      },
      {
        title: "Ứng dụng",
        type: "text",
        content: "Bồn chứa và hệ thống áp lực",
      },
    ],

    specGroupsEn: [
      {
        title: "Standards",
        type: "text",
        content: "API / standard according to model",
      },
      {
        title: "Applications",
        type: "text",
        content: "Storage tanks and pressure systems",
      },
    ],

    images: [
      {
        id: "p5-img-1",
        productId: "p5",
        imageUrl: industrial("photo-1581091870622-3e6a4d07c12f"),
        altVi: "Van an toàn API",
        altEn: "API Safety Valve",
        sortOrder: 0,
        isPrimary: true,
      },
    ],

    published: true,
  },

  {
    id: "p6",
    slug: "gas-meter",
    code: "MTR-001",
    categoryId: "c4",

    name: "Đồng hồ đo khí",
    nameEn: "Gas Meter",

    short: "Thiết bị đo lưu lượng/khối lượng khí tùy cấu hình.",
    shortEn: "Gas measurement device depending on configuration.",

    description:
      "Thiết bị đo khí cho các ứng dụng phù hợp trong hệ thống kỹ thuật.",
    descriptionEn:
      "Gas measurement equipment for suitable technical applications.",

    material: "Theo model",
    materialEn: "Per model",

    specGroupsVi: [
      {
        title: "Tiêu chuẩn",
        type: "text",
        content: "Theo model",
      },
      {
        title: "Ứng dụng",
        type: "text",
        content: "Khí gas và hệ thống LPG",
      },
    ],

    specGroupsEn: [
      {
        title: "Standards",
        type: "text",
        content: "According to model",
      },
      {
        title: "Applications",
        type: "text",
        content: "Gas and LPG systems",
      },
    ],

    images: [
      {
        id: "p6-img-1",
        productId: "p6",
        imageUrl: industrial("photo-1581091226825-a6a2a5aee158"),
        altVi: "Đồng hồ đo khí",
        altEn: "Gas Meter",
        sortOrder: 0,
        isPrimary: true,
      },
    ],

    published: true,
  },

  {
    id: "p7",
    slug: "gas-detector",
    code: "FIR-001",
    categoryId: "c5",

    name: "Thiết bị báo rò khí",
    nameEn: "Gas Detector",

    short: "Thiết bị cảnh báo khí cho hệ thống an toàn.",
    shortEn: "Gas detection device for safety systems.",

    description:
      "Thiết bị phát hiện khí trong các môi trường và hệ thống phù hợp.",
    descriptionEn:
      "Gas detection equipment for suitable environments and safety systems.",

    material: "Theo model",
    materialEn: "Per model",

    specGroupsVi: [
      {
        title: "Tiêu chuẩn",
        type: "text",
        content: "Theo model",
      },
      {
        title: "Ứng dụng",
        type: "text",
        content: "PCCC, LPG, khu vực kỹ thuật",
      },
    ],

    specGroupsEn: [
      {
        title: "Standards",
        type: "text",
        content: "According to model",
      },
      {
        title: "Applications",
        type: "text",
        content: "Fire protection, LPG and technical areas",
      },
    ],

    images: [
      {
        id: "p7-img-1",
        productId: "p7",
        imageUrl: industrial("photo-1581091012184-5c5f2c1f2b0b"),
        altVi: "Thiết bị báo rò khí",
        altEn: "Gas Detector",
        sortOrder: 0,
        isPrimary: true,
      },
    ],

    published: true,
  },

  {
    id: "p8",
    slug: "lpg-hose",
    code: "LPG-001",
    categoryId: "c7",

    name: "Ống mềm LPG",
    nameEn: "LPG Hose",

    short: "Ống mềm chuyên dụng cho hệ thống LPG.",
    shortEn: "Flexible hose for LPG systems.",

    description:
      "Ống mềm phục vụ các kết nối trong hệ thống LPG theo cấu hình yêu cầu.",
    descriptionEn:
      "Flexible hose for connections in LPG systems based on required configuration.",

    material: "Theo model",
    materialEn: "Per model",

    specGroupsVi: [
      {
        title: "Tiêu chuẩn",
        type: "text",
        content: "Theo model",
      },
      {
        title: "Ứng dụng",
        type: "text",
        content: "Hệ thống LPG",
      },
    ],

    specGroupsEn: [
      {
        title: "Standards",
        type: "text",
        content: "According to model",
      },
      {
        title: "Applications",
        type: "text",
        content: "LPG systems",
      },
    ],

    images: [
      {
        id: "p8-img-1",
        productId: "p8",
        imageUrl: industrial("photo-1532601224476-15c79f2f7a51"),
        altVi: "Ống mềm LPG",
        altEn: "LPG Hose",
        sortOrder: 0,
        isPrimary: true,
      },
    ],

    published: true,
  },
];

export const projects: Project[] = [
  {
    id: "pr1",
    slug: "du-an-he-thong-lpg",
    title: "Hệ thống LPG",
    titleEn: "LPG System Project",
    description: "Dự án tiêu biểu sử dụng thiết bị và vật tư cho hệ thống LPG.",
    descriptionEn:
      "A representative project using equipment and materials for an LPG system.",
    location: "TP. Hồ Chí Minh",
    year: 2025,
    coverImage: industrial("photo-1532601224476-15c79f2f7a51"),
    equipment: "Van, ống mềm LPG, thiết bị đo",
    scope: "Cung cấp vật tư và thiết bị theo phạm vi dự án.",
    gallery: [
      industrial("photo-1532601224476-15c79f2f7a51"),
      industrial("photo-1581094794329-c8112a89af12"),
    ],
    published: true,
  },
  {
    id: "pr2",
    slug: "du-an-he-thong-duong-ong",
    title: "Hệ thống đường ống công nghiệp",
    titleEn: "Industrial Piping System",
    description: "Dự án đường ống công nghiệp với vật tư đường ống và van.",
    descriptionEn:
      "Industrial piping project using piping materials and valves.",
    location: "Đồng Nai",
    year: 2024,
    coverImage: industrial("photo-1518770660439-4636190af475"),
    equipment: "Ống thép, fittings, valves",
    scope: "Cung cấp vật tư đường ống và thiết bị liên quan.",
    gallery: [
      industrial("photo-1518770660439-4636190af475"),
      industrial("photo-1504917595217-d4dc5ebe6122"),
    ],
    published: true,
  },
  {
    id: "pr3",
    slug: "du-an-pccc",
    title: "Hệ thống PCCC",
    titleEn: "Fire Protection System",
    description: "Hạng mục thiết bị phục vụ hệ thống báo cháy và bảo vệ.",
    descriptionEn:
      "Equipment package for fire detection and protection systems.",
    location: "Bà Rịa - Vũng Tàu",
    year: 2023,
    coverImage: industrial("photo-1604014237800-1c9102c219da"),
    equipment: "Gas detector, smoke detector, nozzles",
    scope: "Cung cấp thiết bị theo danh mục kỹ thuật.",
    gallery: [
      industrial("photo-1604014237800-1c9102c219da"),
      industrial("photo-1581092160607-ee22621dd758"),
    ],
    published: true,
  },
];

export const company = {
  name: "CÔNG TY TNHH KHANG ANH QUÂN",
  nameEn: "KHANG ANH QUAN CO., LTD.",
  description:
    "Khang Anh Quân chuyên cung cấp thiết bị, vật tư và giải pháp phục vụ các ngành công nghiệp, dầu khí, LPG, PCCC và hệ thống đường ống.",
  descriptionEn:
    "Khang Anh Quan supplies equipment, materials and solutions for industrial, oil & gas, LPG, fire protection and piping systems.",
  email: "sales@kaq.com.vn",
  phone: "+84 28 3753 3688",
  website: "www.khanganhquan.com",
  headquarters:
    "39/1 Nguyễn Cửu Đàm, Phường Tân Sơn Nhì, Quận Tân Phú, TP. Hồ Chí Minh, Việt Nam",
  branch:
    "Số 5, Đường 4A, Khu K300, Phường 12, Quận Tân Bình, TP. Hồ Chí Minh, Việt Nam",
};
