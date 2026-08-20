"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImageUploader } from "@/components/admin/image-uploader";

const initial = {
  company_name_vi: "CÔNG TY TNHH KHANG ANH QUÂN",
  company_name_en: "KHANG ANH QUAN CO., LTD.",
  description_vi:
    "Khang Anh Quân chuyên cung cấp thiết bị, vật tư và giải pháp phục vụ các ngành công nghiệp, dầu khí, LPG, PCCC và hệ thống đường ống.",
  description_en:
    "Khang Anh Quan supplies equipment, materials and solutions for industrial, oil & gas, LPG, fire protection and piping systems.",
  email: "sales@kaq.com.vn",
  phone: "+84 28 3753 3688",
  website: "www.khanganhquan.com",
  address_vi:
    "39/1 Nguyễn Cửu Đàm, Phường Tân Sơn Nhì, Quận Tân Phú, TP. Hồ Chí Minh, Việt Nam",
  address_en:
    "39/1 Nguyen Cuu Dam, Tan Son Nhi Ward, Tan Phu District, Ho Chi Minh City, Vietnam",
  logo_path: "",
  about_vi: "",
  about_en: "",
  business_hours_vi: "",
  business_hours_en: "",
};
export default function Company() {
  const [form, setForm] = useState(initial);
  const [msg, setMsg] = useState("");
  useEffect(() => {
    (async () => {
      const r = await fetch("/api/admin/company");
      if (r.ok) {
        const j = await r.json();
        if (j.data) setForm((x) => ({ ...x, ...j.data }));
      }
    })();
  }, []);
  const update = (k: string, v: string) => setForm((x) => ({ ...x, [k]: v }));
  async function save(e: React.FormEvent) {
    e.preventDefault();
    const r = await fetch("/api/admin/company", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const j = await r.json();
    setMsg(r.ok ? "Đã lưu thông tin công ty." : (j.error ?? "Không thể lưu."));
  }
  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-7">
        <h1 className="heading-display text-3xl font-extrabold tracking-[-.045em] md:text-4xl">
          Thông tin công ty
        </h1>
        <p className="mt-2 text-sm leading-6 text-[#718078]">
          Quản lý nội dung Giới thiệu và toàn bộ thông tin liên hệ hiển thị trên
          website.
        </p>
      </div>
      <form
        onSubmit={save}
        className="space-y-6 rounded-[24px] border border-[#dfe8e2] bg-white p-6 shadow-[0_8px_24px_rgba(20,35,27,.035)] md:p-8"
      >
        <div className="grid gap-6 lg:grid-cols-[.8fr_1.2fr]">
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              value={form.company_name_vi}
              onChange={(e) => update("company_name_vi", e.target.value)}
              placeholder="Company name VI"
            />
            <Input
              value={form.company_name_en}
              onChange={(e) => update("company_name_en", e.target.value)}
              placeholder="Company name EN"
            />
          </div>
        </div>
        <textarea
          value={form.description_vi}
          onChange={(e) => update("description_vi", e.target.value)}
          placeholder="Description VI"
          className="min-h-32 w-full rounded-xl border border-[#d9e4dd] bg-[#fbfcfb] p-3.5 text-sm outline-none focus:border-[#86c69a] focus:ring-4 focus:ring-[#eaf7ef]"
        />
        <textarea
          value={form.about_vi}
          onChange={(e) => update("about_vi", e.target.value)}
          placeholder="Thông tin giới thiệu đầy đủ VI"
          className="min-h-36 w-full rounded-xl border border-[#d9e4dd] bg-[#fbfcfb] p-3.5 text-sm outline-none focus:border-[#86c69a] focus:ring-4 focus:ring-[#eaf7ef]"
        />
        <textarea
          value={form.about_en}
          onChange={(e) => update("about_en", e.target.value)}
          placeholder="Full company introduction EN"
          className="min-h-36 w-full rounded-xl border border-[#d9e4dd] bg-[#fbfcfb] p-3.5 text-sm outline-none focus:border-[#86c69a] focus:ring-4 focus:ring-[#eaf7ef]"
        />
        <textarea
          value={form.description_en}
          onChange={(e) => update("description_en", e.target.value)}
          placeholder="Description EN"
          className="min-h-32 w-full rounded-xl border border-[#d9e4dd] bg-[#fbfcfb] p-3.5 text-sm outline-none focus:border-[#86c69a] focus:ring-4 focus:ring-[#eaf7ef]"
        />
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            type="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            placeholder="Email"
          />
          <Input
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
            placeholder="Phone"
          />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            value={form.address_vi}
            onChange={(e) => update("address_vi", e.target.value)}
            placeholder="Địa chỉ VI"
          />
          <Input
            value={form.address_en}
            onChange={(e) => update("address_en", e.target.value)}
            placeholder="Address EN"
          />
        </div>
        <Input
          value={form.website}
          onChange={(e) => update("website", e.target.value)}
          placeholder="Website"
        />
        <div>
          <Button type="submit">Lưu thông tin</Button>
          {msg && <span className="ml-3 text-sm text-[#246D43]">{msg}</span>}
        </div>
      </form>
    </div>
  );
}
