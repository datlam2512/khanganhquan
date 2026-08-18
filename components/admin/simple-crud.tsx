"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImageUploader } from "@/components/admin/image-uploader";

type Field = {
  key: string;
  label: string;
  placeholder: string;
  required?: boolean;
  textarea?: boolean;
  image?: boolean;
  bucket_id ?: string;
  folder?: string;
};
export function SimpleCrud({
  title,
  endpoint,
  initialItems,
  fields,
  idKey = "id",
  nameKey = "name",
}: {
  title: string;
  endpoint: string;
  initialItems: Record<string, unknown>[];
  fields: Field[];
  idKey?: string;
  nameKey?: string;
}) {
  const [items, setItems] = useState(initialItems);
  const [form, setForm] = useState<Record<string, string | boolean>>({
    published: true,
  });
  const [editing, setEditing] = useState<string>("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  function edit(item: Record<string, unknown>) {
    setEditing(String(item[idKey] ?? ""));
    const next: Record<string, string | boolean> = {};
    fields.forEach((f) => (next[f.key] = String(item[f.key] ?? "")));
    next.published = Boolean(item.published ?? true);
    setForm(next);
  }
  function reset() {
    setEditing("");
    setForm({ published: true });
  }
  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const payload = { ...form };
    if (!editing) delete (payload as Record<string, unknown>).id;
    const res = await fetch(endpoint + (editing ? `?id=${editing}` : ""), {
      method: editing ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editing ? { ...payload, id: editing } : payload),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) {
      setMessage(data.error ?? "Không thể lưu");
      return;
    }
    setMessage("Đã lưu.");
    if (editing)
      setItems((list) =>
        list.map((x) => (String(x[idKey]) === editing ? data.data : x)),
      );
    else setItems((list) => [data.data, ...list]);
    reset();
  }
  async function remove(id: string) {
    if (!confirm("Xóa mục này?")) return;
    const res = await fetch(endpoint, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      setItems((list) => list.filter((x) => String(x[idKey]) !== id));
      setMessage("Đã xóa.");
    }
  }
  return (
    <div>
      <div className="grid gap-6 xl:grid-cols-[1.15fr_.85fr]">
        <div className="overflow-hidden rounded-[22px] border border-[#dfe8e2] bg-white shadow-[0_8px_24px_rgba(20,35,27,.035)]">
          <div className="flex items-center justify-between border-b border-[#e8eee9] px-5 py-4">
            <div>
              <h2 className="text-sm font-extrabold">Danh sách</h2>
              <p className="mt-1 text-xs text-[#8a978f]">
                Quản lý và chỉnh sửa nội dung.
              </p>
            </div>
            <span className="rounded-full bg-[#f1f8f3] px-2.5 py-1 text-[11px] font-bold text-[#4d6b59]">
              {items.length} mục
            </span>
          </div>
          <div className="space-y-2 p-3">
            {items.length ? (
              items.map((item) => (
                <div
                  key={String(item[idKey])}
                  className="flex items-center justify-between gap-4 rounded-xl border border-[#e8eee9] bg-white p-3.5 transition hover:border-[#cfe3d5] hover:bg-[#fbfdfc]"
                >
                  <div>
                    <div className="font-bold">
                      {String(item[nameKey] ?? "—")}
                    </div>
                    <div className="mt-1 text-xs text-[#7A877F]">
                      {String(item.slug ?? "")}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => edit(item)}
                    >
                      Sửa
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => remove(String(item[idKey]))}
                    >
                      Xóa
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-xl bg-[#F7FAF8] p-8 text-center text-sm text-[#718078]">
                Chưa có dữ liệu. Tạo mục đầu tiên.
              </div>
            )}
          </div>
        </div>
        <form
          onSubmit={save}
          className="rounded-[22px] border border-[#dfe8e2] bg-white p-5 shadow-[0_8px_24px_rgba(20,35,27,.035)]"
        >
          <div className="flex items-center justify-between">
            <h2 className="font-black">{editing ? "Chỉnh sửa" : "Tạo mới"}</h2>
            {editing && (
              <button
                type="button"
                onClick={reset}
                className="text-xs font-bold text-[#087A3A]"
              >
                Hủy
              </button>
            )}
          </div>
          <div className="mt-4 space-y-3">
            {fields.map((f) =>
              f.image ? (
                <ImageUploader
                  key={f.key}
                  value={String(form[f.key] ?? "")}
                  bucket_id ={f.bucket_id }
                  folder={f.folder}
                  label={f.label || f.placeholder}
                  onChange={(v) => setForm((x) => ({ ...x, [f.key]: v }))}
                />
              ) : f.textarea ? (
                <textarea
                  key={f.key}
                  required={f.required}
                  placeholder={f.placeholder}
                  value={String(form[f.key] ?? "")}
                  onChange={(e) =>
                    setForm((x) => ({ ...x, [f.key]: e.target.value }))
                  }
                  className="min-h-28 w-full rounded-xl border border-[#d9e4dd] bg-[#fbfcfb] p-3.5 text-sm outline-none transition focus:border-[#86c69a] focus:bg-white focus:ring-4 focus:ring-[#eaf7ef]"
                />
              ) : (
                <Input
                  key={f.key}
                  required={f.required}
                  placeholder={f.placeholder}
                  value={String(form[f.key] ?? "")}
                  onChange={(e) =>
                    setForm((x) => ({ ...x, [f.key]: e.target.value }))
                  }
                />
              ),
            )}
          </div>
          <label className="mt-4 flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={Boolean(form.published)}
              onChange={(e) =>
                setForm((x) => ({ ...x, published: e.target.checked }))
              }
            />{" "}
            Published
          </label>
          <Button disabled={saving} type="submit" className="mt-5 w-full">
            {saving ? "Đang lưu…" : "Lưu"}
          </Button>
          {message && (
            <div className="mt-3 rounded-lg bg-[#EAF7EF] p-3 text-sm text-[#1A5A36]">
              {message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
