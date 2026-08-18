"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import {
  ImagePlus,
  Loader2,
  Trash2,
  UploadCloud,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const MAX_BYTES = 8 * 1024 * 1024;
const ACCEPT = "image/jpeg,image/png,image/webp,image/avif";

type ImageUploaderProps = {
  value: string;
  bucket_id ?: string;
  folder?: string;
  onChange: (value: string) => void;
  label?: string;
};

export function ImageUploader({
  value,
  bucket_id  = "image-project",
  folder = "homepage",
  onChange,
  label = "Hình ảnh",
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function upload(file: File): Promise<void> {
    setError("");

    if (!file.type.startsWith("image/")) {
      setError("Vui lòng chọn một file hình ảnh.");
      return;
    }

    if (file.size > MAX_BYTES) {
      setError("Ảnh tối đa 8 MB.");
      return;
    }

    setUploading(true);

    try {
      const supabase = createClient();

      const extension =
        file.name.split(".").pop()?.toLowerCase() || "webp";

      const filePath = `${folder}/${crypto.randomUUID()}.${extension}`;

      const { error: uploadError } = await supabase.storage
        .from(bucket_id )
        .upload(filePath, file, {
          cacheControl: "31536000",
          upsert: false,
          contentType: file.type,
        });

      if (uploadError) {
        throw uploadError;
      }

      const {
        data: { publicUrl },
      } = supabase.storage
        .from(bucket_id )
        .getPublicUrl(filePath);

      if (!publicUrl) {
        throw new Error(
          "Không thể tạo URL công khai cho ảnh vừa upload.",
        );
      }

      // Lưu URL đầy đủ vào form/database.
      onChange(publicUrl);
    } catch (uploadError: unknown) {
      console.error("Image upload error:", uploadError);

      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "Không thể upload ảnh. Hãy kiểm tra bucket_id  Supabase và quyền truy cập.",
      );
    } finally {
      setUploading(false);
    }
  }

  async function remove(): Promise<void> {
    if (!value) {
      onChange("");
      return;
    }

    try {
      const supabase = createClient();

      /**
       * Database đang lưu public URL:
       * https://xxx.supabase.co/storage/v1/object/public/KAQ.co/folder/file.jpg
       *
       * Ta lấy lại path để xóa file trong Storage.
       */
      const publicMarker = `/storage/v1/object/public/${bucket_id }/`;

      if (value.startsWith("http://") || value.startsWith("https://")) {
        const markerIndex = value.indexOf(publicMarker);

        if (markerIndex !== -1) {
          const filePath = value.slice(
            markerIndex + publicMarker.length,
          );

          const { error: removeError } = await supabase.storage
            .from(bucket_id )
            .remove([filePath]);

          if (removeError) {
            console.error(
              "Remove image error:",
              removeError,
            );
          }
        }
      } else {
        const { error: removeError } = await supabase.storage
          .from(bucket_id )
          .remove([value]);

        if (removeError) {
          console.error(
            "Remove image error:",
            removeError,
          );
        }
      }
    } catch (removeError: unknown) {
      console.error("Remove image error:", removeError);
    } finally {
      // Luôn xóa URL khỏi form.
      onChange("");
    }
  }

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <label className="text-sm font-extrabold text-[#24392d]">
          {label}
        </label>

        <span className="text-[11px] text-[#87938c]">
          JPG · PNG · WebP · AVIF · tối đa 8 MB
        </span>
      </div>

      <div className="overflow-hidden rounded-2xl border border-dashed border-[#cddbd1] bg-[#f8fbf9]">
        {value ? (
          <div className="relative aspect-[16/7] overflow-hidden bg-[#eaf1ec]">
            <Image
              src={value}
              alt={label}
              fill
              className="object-cover"
              sizes="700px"
            />

            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 bg-gradient-to-t from-black/65 to-transparent p-4 pt-12">
              <span className="truncate text-xs font-semibold text-white">
                {value}
              </span>

              <button
                type="button"
                onClick={() => void remove()}
                disabled={uploading}
                aria-label="Xóa ảnh"
                className="grid size-9 shrink-0 place-items-center rounded-full bg-white/90 text-[#a13b3b] hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="flex min-h-44 w-full flex-col items-center justify-center gap-3 text-[#65756c] transition hover:bg-white hover:text-[#087a3a] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span className="grid size-12 place-items-center rounded-2xl bg-white shadow-sm">
              <ImagePlus className="size-5" />
            </span>

            <span className="text-sm font-extrabold">
              {uploading
                ? "Đang tải ảnh lên…"
                : "Chọn ảnh từ máy"}
            </span>

            <span className="text-xs">
              Bạn có thể upload trực tiếp từ Windows / macOS
            </span>

            {uploading && (
              <Loader2 className="size-4 animate-spin" />
            )}
          </button>
        )}

        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT}
          className="hidden"
          disabled={uploading}
          onChange={(event) => {
            const file = event.target.files?.[0];

            if (file) {
              void upload(file);
            }

            event.currentTarget.value = "";
          }}
        />
      </div>

      {error && (
        <p className="mt-2 rounded-lg bg-[#fff2f2] px-3 py-2 text-xs font-semibold text-[#a13b3b]">
          {error}
        </p>
      )}

      {!value && !uploading && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="mt-3 inline-flex items-center gap-2 text-xs font-extrabold text-[#087a3a] hover:underline"
        >
          <UploadCloud className="size-4" />
          Tải ảnh lên
        </button>
      )}
    </div>
  );
}