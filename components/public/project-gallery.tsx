"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, X, Expand } from "lucide-react";
import { useEffect, useState } from "react";

export function ProjectGallery({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  const gallery = images.filter(Boolean).length ? images.filter(Boolean) : [];
  const [index, setIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const move = (direction: 1 | -1) => {
    setIndex((value) => (value + direction + gallery.length) % gallery.length);
  };

  // Khóa scroll nền khi mở modal + hỗ trợ phím tắt (ESC đóng, mũi tên chuyển ảnh)
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
      if (e.key === "ArrowLeft") move(-1);
      if (e.key === "ArrowRight") move(1);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  if (!gallery.length) return null;
  const current = gallery[index];

  return (
    <div className="mt-8">
      <div
        onClick={() => setIsOpen(true)}
        className="group relative aspect-[16/8.5] cursor-zoom-in overflow-hidden rounded-[28px] bg-[#e8efea] shadow-[0_20px_55px_rgba(20,35,27,.10)]"
      >
        <Image
          src={current}
          alt={`${title} - ${index + 1}`}
          fill
          priority={index === 0}
          className="object-cover transition-opacity duration-500"
          sizes="(max-width:1024px) 100vw, 1100px"
        />

        {/* Gợi ý phóng to khi hover */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/0 transition group-hover:bg-black/15">
          <div className="grid size-12 place-items-center rounded-full bg-black/40 text-white opacity-0 backdrop-blur-md transition group-hover:opacity-100">
            <Expand className="size-5" />
          </div>
        </div>

        {gallery.length > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                move(-1);
              }}
              aria-label="Ảnh trước"
              className="absolute left-4 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-white/30 bg-black/30 text-white backdrop-blur-md transition hover:bg-black/50"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                move(1);
              }}
              aria-label="Ảnh tiếp theo"
              className="absolute right-4 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-white/30 bg-black/30 text-white backdrop-blur-md transition hover:bg-black/50"
            >
              <ChevronRight className="size-5" />
            </button>
            <div className="absolute bottom-4 right-4 rounded-full bg-black/45 px-3 py-1.5 text-[11px] font-bold text-white backdrop-blur-md">
              {index + 1} / {gallery.length}
            </div>
          </>
        )}
      </div>

      {gallery.length > 1 && (
        <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
          {gallery.map((image, i) => (
            <button
              type="button"
              key={`${image}-${i}`}
              onClick={() => setIndex(i)}
              className={`relative h-20 w-28 shrink-0 overflow-hidden rounded-xl border-2 transition ${i === index ? "border-[#11823b]" : "border-transparent opacity-70 hover:opacity-100"}`}
              aria-label={`Xem ảnh ${i + 1}`}
            >
              <Image
                src={image}
                alt=""
                fill
                className="object-cover"
                sizes="112px"
              />
            </button>
          ))}
        </div>
      )}

      {/* Modal xem ảnh full size */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm md:p-8"
          onClick={() => setIsOpen(false)}
        >
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            aria-label="Đóng"
            className="absolute right-4 top-4 z-20 grid size-11 place-items-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition hover:bg-white/20 md:right-8 md:top-8"
          >
            <X className="size-5" />
          </button>

          {gallery.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  move(-1);
                }}
                aria-label="Ảnh trước"
                className="absolute left-3 top-1/2 z-20 grid size-12 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition hover:bg-white/20 md:left-6"
              >
                <ChevronLeft className="size-6" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  move(1);
                }}
                aria-label="Ảnh tiếp theo"
                className="absolute right-3 top-1/2 z-20 grid size-12 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition hover:bg-white/20 md:right-6"
              >
                <ChevronRight className="size-6" />
              </button>
            </>
          )}

          {/* Ảnh gốc, không crop */}
          <div
            className="relative z-0 h-full w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={current}
              alt={`${title} - ${index + 1}`}
              fill
              className="object-contain"
              sizes="100vw"
              quality={100}
            />
          </div>

          {gallery.length > 1 && (
            <div className="absolute bottom-4 left-1/2 z-20 -translate-x-1/2 rounded-full bg-black/45 px-3 py-1.5 text-[11px] font-bold text-white backdrop-blur-md md:bottom-8">
              {index + 1} / {gallery.length}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
