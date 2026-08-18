import { getLocale, getDictionary } from "@/lib/i18n";
import { getCompany } from "@/lib/data";

const vi = {
  greeting:
    "CÔNG TY TNHH KHANG ANH QUÂN xin gửi tới Quý khách hàng lời chào trân trọng nhất.",
  thanks:
    "Chúng tôi xin chân thành cảm ơn Quý khách hàng đã dành thời gian quan tâm đến các sản phẩm và dịch vụ của công ty chúng tôi.",
  intro:
    "Cùng với sự hội nhập quốc tế của đất nước, công ty chúng tôi mang các sản phẩm với các công nghệ tiên tiến, kỹ thuật cao và an toàn cao của các nước thuộc nhóm G7, châu Âu, các nước công nghiệp phát triển...vào thị trường Việt Nam, góp phần thúc đẩy công nghiệp hóa và hiện đại hóa đất nước.",
  company:
    "Công ty TNHH Khang Anh Quân có tên viết tắt là KAQ, trụ sở chính đặt tại thành phố Hồ Chí Minh. Với đội ngũ nhân viên giàu kinh nghiệm, năng động, nhiệt huyết và sáng tạo chúng tôi luôn mang tới cho khách hàng các sản phẩm và dịch vụ tốt nhất.",
  fieldsTitle: "KAQ kinh doanh trong lĩnh vực:",
  fields: [
    "Công nghiệp Dầu Khí",
    "Công nghiệp đóng tàu",
    "Công Nghiệp Phụ Trợ",
    "Công nghiệp nặng, công nghiệp hóa chất",
  ],
  activitiesTitle: "Các hoạt động kinh doanh của chúng tôi bao gồm:",
  activities: [
    "Cung cấp vật tư và thiết bị chuyên dụng cho công nghiệp dầu khí (onshore và offshore).",
    "Cung cấp VTTB và thi công lắp đặt các kho trung chuyển, tổng kho chứa xăng dầu, chứa LPG...",
    "Cung cấp vật tư và thiết bị các nhà máy thuộc các khu công nghiệp.",
    "Cung cấp vật tư và thiết bị cho ngành công nghiệp đóng tàu.",
    "Cung cấp các loại thiết bị đo lường và điều khiển.",
    "Cung cấp và thi công, lắp đặt các tuyến ống dẫn khí công nghiệp, khí đốt, nhiên liệu xăng dầu và hóa chất các loại.",
    "Cung cấp và thi công lắp đặt các VTTB và tuyến ống cho hệ thống cung cấp khí đốt cho tòa nhà, căn hộ, nhà hàng, khách sạn...",
    "Tư vấn thiết kế, mua sắm VTTB và thi công lắp đặt các trạm Chiết Nạp LPG, trạm phân phối Khí Thấp Áp (Natural Gas), trạm cấp khí CNG, trạm hóa hơi LPG, trạm LPG / Air Mixer...",
    "Tư vấn thiết kế, mua sắm VTTB và thi công lắp đặt các hệ thống báo cháy, chữa cháy, hệ thống Fire & Gas,...",
    "Tư vấn thiết kế, mua sắm VTTB và thi công lắp đặt các hệ thống điều khiển, hệ thống truyền và xử lý tín hiệu...",
  ],
  closing:
    "Chúng tôi rất mong muốn được hợp tác và cùng với Quý khách hàng phát triển.",
  thanks2:
    "Xin chân thành cảm ơn và kính chúc Quý khách hàng sức khỏe và thịnh vượng.",
  sign: "Thay mặt ban lãnh đạo công ty.",
  role: "Giám đốc",
};

const en = {
  greeting:
    "KHANG ANH QUAN CO., LTD. respectfully sends our sincere greetings to our valued customers.",
  thanks:
    "We sincerely thank our customers for taking the time to learn about our products and services.",
  intro:
    "Along with Vietnam’s international integration, our company brings advanced technology, high-engineering and high-safety products from G7 countries, Europe and developed industrial nations into the Vietnamese market, contributing to industrialization and modernization.",
  company:
    "Khang Anh Quan Co., Ltd., abbreviated as KAQ, is headquartered in Ho Chi Minh City. With an experienced, dynamic, enthusiastic and creative team, we strive to provide customers with quality products and services.",
  fieldsTitle: "KAQ operates in the following fields:",
  fields: [
    "Oil & Gas Industry",
    "Shipbuilding Industry",
    "Supporting Industries",
    "Heavy Industry & Chemical Industry",
  ],
  activitiesTitle: "Our business activities include:",
  activities: [
    "Supply of specialized materials and equipment for the oil & gas industry (onshore and offshore).",
    "Supply and installation of equipment for transfer terminals, petroleum storage depots and LPG storage systems.",
    "Supply of materials and equipment for factories in industrial parks.",
    "Supply of materials and equipment for the shipbuilding industry.",
    "Supply of measuring and control equipment.",
    "Supply and installation of industrial gas, fuel, petroleum and chemical pipeline systems.",
    "Supply and installation of equipment and pipelines for gas supply systems serving buildings, apartments, restaurants and hotels.",
    "Consulting, procurement and installation of LPG filling stations, natural gas distribution stations, CNG stations, LPG vaporization stations and LPG / Air Mixer systems.",
    "Consulting, procurement and installation of fire alarm, fire fighting and Fire & Gas systems.",
    "Consulting, procurement and installation of control, transmission and signal-processing systems.",
  ],
  closing:
    "We look forward to cooperating with our customers and growing together.",
  thanks2:
    "Thank you sincerely, and we wish our customers health and prosperity.",
  sign: "On behalf of the company's management.",
  role: "Director",
};

export default async function About({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = getLocale((await params).locale);
  const t = getDictionary(locale);
  const content = locale === "vi" ? vi : en;
  const company = await getCompany();

  return (
    <main>
      <section className="relative overflow-hidden border-b border-(--line) bg-[linear-gradient(120deg,#f2fbf5_0%,#ffffff_56%,#eef8f2_100%)] py-20 md:py-28">
        <div className="container-kaq relative">
          <div className="max-w-4xl">
            <div className="eyebrow">
              {locale === "vi" ? "Về Khang Anh Quân" : "About Khang Anh Quan"}
            </div>
            <h1 className="heading-display mt-4 text-4xl font-extrabold tracking-tight text-(--ink) md:text-6xl">
              {locale === "vi"
                ? "Kinh nghiệm kỹ thuật. Năng lực cung ứng. Đồng hành lâu dài."
                : "Engineering experience. Supply capability. Long-term partnership."}
            </h1>
            <p className="mt-7 max-w-3xl text-base leading-8 text-(--muted) md:text-lg">
              {locale === "vi"
                ? "Giữ lại toàn bộ nội dung giới thiệu doanh nghiệp hiện có, nhưng trình bày theo cách dễ đọc, có cấu trúc và phù hợp với hình ảnh một công ty kỹ thuật hiện đại."
                : "The company introduction is preserved in full while being presented with a clearer, more structured experience for a modern engineering company."}
            </p>
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-kaq grid gap-10 lg:grid-cols-[.72fr_1.28fr]">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <div className="section-label">KAQ</div>
            <h2 className="heading-display mt-3 text-3xl font-extrabold md:text-4xl">
              {t.sections.about}
            </h2>
            <div className="mt-6 h-px w-20 bg-(--brand)" />
            <p className="mt-6 text-sm leading-7 text-(--muted)">
              {locale === "vi"
                ? "Thông tin dưới đây được biên tập từ nội dung giới thiệu doanh nghiệp hiện có."
                : "The content below is adapted from the existing company introduction."}
            </p>
          </div>

          <article className="surface-card rounded-[28px] p-6 md:p-10">
            <div className="space-y-6 text-[15px] leading-8 text-[#3d4c43] md:text-base">
              <p>
                <strong className="font-extrabold text-(--ink)">
                  {locale === "vi"
                    ? "CÔNG TY TNHH KHANG ANH QUÂN"
                    : "KHANG ANH QUAN CO., LTD."}
                </strong>{" "}
                {locale === "vi"
                  ? "xin gửi tới Quý khách hàng lời chào trân trọng nhất."
                  : "respectfully sends our sincere greetings to our valued customers."}
              </p>
              <p>{content.thanks}</p>
              <p>
                {locale === "vi"
                  ? company.description || content.intro
                  : company.descriptionEn || content.intro}
              </p>
              <p>{content.company}</p>
            </div>

            <div className="my-10 grid gap-6 lg:grid-cols-2">
              <section className="rounded-2xl bg-(--brand-soft) p-6">
                <h3 className="font-display text-lg font-extrabold text-(--ink)">
                  {content.fieldsTitle}
                </h3>
                <ul className="mt-4 space-y-3 text-sm leading-7 text-[#415248]">
                  {content.fields.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className="mt-3 size-1.5 shrink-0 rounded-full bg-(--brand)" />
                      {item}
                    </li>
                  ))}
                </ul>
              </section>
              <section className="rounded-2xl border border-(--line) bg-white p-6">
                <div className="eyebrow">
                  {locale === "vi" ? "Định hướng hoạt động" : "Business scope"}
                </div>
                <p className="mt-4 text-sm leading-7 text-(--muted)">
                  {locale === "vi"
                    ? "Danh mục hoạt động được trình bày thành từng nhóm để khách hàng dễ đọc và nhanh chóng xác định lĩnh vực phù hợp."
                    : "Business activities are grouped into clear items so visitors can quickly understand the relevant scope."}
                </p>
              </section>
            </div>

            <section>
              <h3 className="heading-display text-2xl font-extrabold text-(--ink) md:text-3xl">
                {content.activitiesTitle}
              </h3>
              <div className="mt-6 grid gap-3">
                {content.activities.map((item, index) => (
                  <div
                    key={item}
                    className="group flex gap-4 rounded-2xl border border-(--line) bg-white p-4 transition hover:border-[#bfe8ce] hover:bg-[#fbfefc]"
                  >
                    <div className="grid size-8 shrink-0 place-items-center rounded-lg bg-(--brand-soft) text-xs font-extrabold text-(--brand-dark)">
                      {String(index + 1).padStart(2, "0")}
                    </div>
                    <p className="text-sm leading-7 text-[#405047]">{item}</p>
                  </div>
                ))}
              </div>
            </section>

            <div className="mt-10 border-t border-(--line) pt-8">
              <p className="font-semibold text-(--ink)">
                {content.closing}
              </p>
              <p className="mt-3 text-[#506059]">{content.thanks2}</p>
              <div className="mt-10 text-right text-sm text-(--muted)">
                <div>{content.sign}</div>
                <div className="mt-1 font-extrabold text-(--ink)">
                  {content.role}
                </div>
                <div className="mt-2 italic">(đã ký)</div>
              </div>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}
