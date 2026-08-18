"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, Loader2, Trash2, UploadCloud } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const MAX_BYTES = 8 * 1024 * 1024;
const ACCEPT = "image/jpeg,image/png,image/webp,image/avif";

export function ImageUploader({ value, bucket = "company-images", folder = "homepage", onChange, label = "Hình ảnh" }: { value: string; bucket?: string; folder?: string; onChange: (path: string) => void; label?: string }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function upload(file: File) {
    setError("");
    if (!file.type.startsWith("image/")) return setError("Vui lòng chọn một file hình ảnh.");
    if (file.size > MAX_BYTES) return setError("Ảnh tối đa 8 MB.");
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseKey) {
      setError("Chưa cấu hình Supabase. Hãy tạo file .env.local và điền NEXT_PUBLIC_SUPABASE_URL cùng NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (hoặc NEXT_PUBLIC_SUPABASE_ANON_KEY), sau đó khởi động lại npm run dev.");
      return;
    }
    setUploading(true);
    try {
      const supabase = createClient();
      const ext = file.name.split(".").pop()?.toLowerCase() || "webp";
      const path = `${folder}/${crypto.randomUUID()}.${ext}`;
      const { error: uploadError } = await supabase.storage.from(bucket).upload(path, file, { cacheControl: "31536000", upsert: false, contentType: file.type });
      if (uploadError) throw uploadError;
      onChange(path);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Không thể upload ảnh. Hãy kiểm tra Supabase Storage và quyền admin.");
    } finally { setUploading(false); }
  }

  async function remove() {
    if (!value || value.startsWith("http")) { onChange(""); return; }
    try { const supabase = createClient(); await supabase.storage.from(bucket).remove([value]); } catch { /* DB value can still be cleared */ }
    onChange("");
  }

  const publicUrl = value.startsWith("http") ? value : (process.env.NEXT_PUBLIC_SUPABASE_URL ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucket}/${value}` : "");

  return <div>
    <div className="mb-2 flex items-center justify-between"><label className="text-sm font-extrabold text-[#24392d]">{label}</label><span className="text-[11px] text-[#87938c]">JPG · PNG · WebP · AVIF · tối đa 8 MB</span></div>
    <div className="overflow-hidden rounded-2xl border border-dashed border-[#cddbd1] bg-[#f8fbf9]">
      {publicUrl ? <div className="relative aspect-[16/7] overflow-hidden bg-[#eaf1ec]"><Image src={publicUrl} alt="Preview" fill className="object-cover" sizes="700px" /><div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 bg-gradient-to-t from-black/65 to-transparent p-4 pt-12"><span className="truncate text-xs font-semibold text-white">{value}</span><button type="button" onClick={remove} className="grid size-9 shrink-0 place-items-center rounded-full bg-white/90 text-[#a13b3b] hover:bg-white"><Trash2 className="size-4" /></button></div></div> : <button type="button" onClick={() => inputRef.current?.click()} disabled={uploading} className="flex min-h-44 w-full flex-col items-center justify-center gap-3 text-[#65756c] transition hover:bg-white hover:text-[#087a3a]"><span className="grid size-12 place-items-center rounded-2xl bg-white shadow-sm"><ImagePlus className="size-5" /></span><span className="text-sm font-extrabold">{uploading ? "Đang tải ảnh lên…" : "Chọn ảnh từ máy"}</span><span className="text-xs">Bạn có thể upload trực tiếp từ Windows / macOS</span>{uploading && <Loader2 className="size-4 animate-spin" />}</button>}
      <input ref={inputRef} type="file" accept={ACCEPT} className="hidden" onChange={(e) => { const file = e.target.files?.[0]; if (file) void upload(file); e.currentTarget.value = ""; }} />
    </div>
    {error && <p className="mt-2 rounded-lg bg-[#fff2f2] px-3 py-2 text-xs font-semibold text-[#a13b3b]">{error}</p>}
    {!value && !uploading && <button type="button" onClick={() => inputRef.current?.click()} className="mt-3 inline-flex items-center gap-2 text-xs font-extrabold text-[#087a3a] hover:underline"><UploadCloud className="size-4" /> Tải ảnh lên</button>}
  </div>;
}
