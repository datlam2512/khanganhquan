"use client";

import { useEffect, useState } from "react";
import { GripVertical, Save, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { ImageUploader } from "@/components/admin/image-uploader";
import { Button } from "@/components/ui/button";

type Slide = {
  id: string;
  image_path: string;
  sort_order: number;
  published: boolean;
};

const empty = (): Slide => ({
  id: crypto.randomUUID(),
  image_path: "",
  sort_order: 0,
  published: true,
});

export default function HomepageAdmin() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => { void load(); }, []);

  async function load() {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("hero_slides")
      .select("id,image_path,sort_order,published")
      .order("sort_order", { ascending: true });

    if (error) setMessage(error.message);
    setSlides((data ?? []) as Slide[]);
    setLoading(false);
  }

  function update(id: string, key: keyof Slide, value: string | number | boolean) {
    setSlides((items) => items.map((item) => item.id === id ? { ...item, [key]: value } : item));
  }

  function add() {
    setSlides((items) => [...items, { ...empty(), sort_order: items.length + 1 }]);
  }

  async function save() {
    setSaving(true);
    setMessage("");
    const supabase = createClient();
    const valid = slides
      .filter((slide) => slide.image_path)
      .map((slide, index) => ({
        id: slide.id,
        image_path: slide.image_path,
        sort_order: index + 1,
        published: slide.published,
      }));

    if (valid.length === 0) {
      setSaving(false);
      setMessage("Hãy thêm ít nhất một hình ảnh cho banner.");
      return;
    }

    const { data: current } = await supabase.from("hero_slides").select("id");
    const ids = new Set(valid.map((slide) => slide.id));
    const removeIds = (current ?? []).map((row) => row.id).filter((id) => !ids.has(id));
    if (removeIds.length) await supabase.from("hero_slides").delete().in("id", removeIds);

    const { error } = await supabase.from("hero_slides").upsert(valid);
    setSaving(false);
    setMessage(error ? error.message : "Đã lưu hình ảnh banner.");
    if (!error) setSlides(valid);
  }

  async function remove(id: string) {
    if (!confirm("Xóa hình ảnh này khỏi banner trang chủ?")) return;
    const slide = slides.find((item) => item.id === id);
    const supabase = createClient();
    if (slide?.image_path && !slide.image_path.startsWith("http")) {
      await supabase.storage.from("company-images").remove([slide.image_path]);
    }
    setSlides((items) => items.filter((item) => item.id !== id));
  }

  return (
    <div className="mx-auto max-w-[1100px]">
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <div className="section-label">Trang chủ</div>
          <h1 className="heading-display mt-2 text-3xl font-extrabold tracking-[-.045em] md:text-4xl">Hình ảnh banner</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#718078]">
            Chỉ quản lý hình ảnh. Nội dung chữ trên banner được cố định theo nội dung website và sẽ không thay đổi khi chuyển ảnh.
          </p>
        </div>
        <Button type="button" onClick={add}>Thêm hình ảnh</Button>
      </div>

      <div className="mb-5 rounded-2xl border border-[#dfe8e2] bg-[#eef8f1] px-5 py-4 text-sm text-[#456252]">
        <strong className="text-[#087a3a]">Lưu ý:</strong> banner tự động chuyển ảnh mỗi 6,5 giây, không có nút điều khiển hoặc dots trên website.
      </div>

      {loading ? (
        <div className="rounded-2xl border border-[#dfe8e2] bg-white p-8 text-sm text-[#718078]">Đang tải hình ảnh…</div>
      ) : (
        <div className="space-y-5">
          {slides.length === 0 && (
            <div className="rounded-[24px] border border-dashed border-[#cfdcd3] bg-white p-12 text-center text-sm text-[#718078]">
              Chưa có hình ảnh banner. Bấm “Thêm hình ảnh” để upload từ máy.
            </div>
          )}
          {slides.map((slide, index) => (
            <div key={slide.id} className="rounded-[24px] border border-[#dfe8e2] bg-white p-5 shadow-[0_8px_24px_rgba(20,35,27,.035)] md:p-6">
              <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="grid size-9 place-items-center rounded-xl bg-[#f1f6f3] text-[#87938c]"><GripVertical className="size-4" /></div>
                  <div>
                    <div className="text-sm font-extrabold text-[#173826]">Hình {index + 1}</div>
                    <div className="text-xs text-[#87938c]">Thứ tự {index + 1}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 text-xs font-bold text-[#5f7066]">
                    <input type="checkbox" checked={slide.published} onChange={(e) => update(slide.id, "published", e.target.checked)} /> Hiển thị
                  </label>
                  <button type="button" onClick={() => void remove(slide.id)} className="grid size-9 place-items-center rounded-xl border border-[#e6dede] text-[#a05a5a] hover:bg-[#fff6f6]" aria-label="Xóa hình">
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
              <ImageUploader value={slide.image_path} onChange={(path) => update(slide.id, "image_path", path)} />
            </div>
          ))}
        </div>
      )}

      <div className="sticky bottom-4 mt-6 flex items-center justify-between gap-4 rounded-2xl border border-[#dfe8e2] bg-white/95 p-4 shadow-[0_14px_40px_rgba(20,35,27,.12)] backdrop-blur">
        <span className="text-sm text-[#718078]">{message || `${slides.length} hình banner`}</span>
        <Button type="button" onClick={() => void save()} disabled={saving}>{saving ? "Đang lưu…" : "Lưu hình ảnh"}<Save className="size-4" /></Button>
      </div>
    </div>
  );
}
