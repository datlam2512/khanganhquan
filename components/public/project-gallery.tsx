"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect, useState } from "react";

export function ProjectGallery({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  const gallery = images.filter(Boolean);

  const [index, setIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const currentImage = gallery[index];

  // =========================================================
  // LOCK BODY SCROLL WHEN LIGHTBOX IS OPEN
  // =========================================================
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  // =========================================================
  // KEYBOARD CONTROLS
  // =========================================================
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        return;
      }

      if (e.key === "ArrowRight" && gallery.length > 1) {
        setIndex((prev) => (prev + 1) % gallery.length);
      }

      if (e.key === "ArrowLeft" && gallery.length > 1) {
        setIndex(
          (prev) => (prev - 1 + gallery.length) % gallery.length
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, gallery.length]);

  // =========================================================
  // NO IMAGES
  // =========================================================
  if (!gallery.length) {
    return null;
  }

  // =========================================================
  // OPEN
  // =========================================================
  const openFullscreen = () => {
    setIsOpen(true);
  };

  // =========================================================
  // CLOSE
  // =========================================================
  const closeFullscreen = () => {
    setIsOpen(false);
  };

  // =========================================================
  // NEXT
  // =========================================================
  const nextImage = () => {
    if (gallery.length <= 1) return;

    setIndex((prev) => (prev + 1) % gallery.length);
  };

  // =========================================================
  // PREVIOUS
  // =========================================================
  const prevImage = () => {
    if (gallery.length <= 1) return;

    setIndex(
      (prev) => (prev - 1 + gallery.length) % gallery.length
    );
  };

  // =========================================================
  // SELECT THUMBNAIL
  // =========================================================
  const selectImage = (imageIndex: number) => {
    setIndex(imageIndex);
  };

  return (
    <>
      {/* =====================================================
          MAIN IMAGE
      ===================================================== */}
      <div className="mt-10 overflow-hidden rounded-[28px] bg-[#edf3ef]">
        <button
          type="button"
          onClick={openFullscreen}
          className="group relative block aspect-[16/9] w-full cursor-zoom-in"
          aria-label={`Xem ảnh ${title} toàn màn hình`}
        >
          <Image
            src={currentImage}
            alt={title}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 1180px"
            className="object-cover transition duration-500 group-hover:scale-[1.02]"
          />

          {/* Hover overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition duration-300 group-hover:bg-black/20">
            <span className="translate-y-2 rounded-full bg-black/60 px-5 py-2.5 text-sm font-semibold text-white opacity-0 backdrop-blur-sm transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
              Nhấn để xem ảnh đầy đủ
            </span>
          </div>
        </button>
      </div>

      {/* =====================================================
          THUMBNAILS
      ===================================================== */}
      {gallery.length > 1 && (
        <div className="mt-4 grid grid-cols-4 gap-3 md:grid-cols-6">
          {gallery.map((image, imageIndex) => (
            <button
              key={`${image}-${imageIndex}`}
              type="button"
              onClick={() => selectImage(imageIndex)}
              className={`relative aspect-[16/10] overflow-hidden rounded-xl border-2 transition ${
                index === imageIndex
                  ? "border-[#11823b]"
                  : "border-transparent hover:border-[#b8cfc0]"
              }`}
              aria-label={`Xem ảnh ${imageIndex + 1}`}
            >
              <Image
                src={image}
                alt={`${title} ${imageIndex + 1}`}
                fill
                sizes="(max-width: 768px) 25vw, 16vw"
                className="object-cover transition duration-300 hover:scale-105"
              />
            </button>
          ))}
        </div>
      )}

      {/* =====================================================
          LIGHTBOX
      ===================================================== */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 p-3 md:p-6"
          onClick={closeFullscreen}
          role="dialog"
          aria-modal="true"
          aria-label={`Xem ảnh ${title}`}
        >
          {/* =================================================
              CLOSE
          ================================================= */}
          <button
            type="button"
            onClick={closeFullscreen}
            className="absolute right-3 top-3 z-[10002] rounded-full bg-white/10 p-3 text-white backdrop-blur-md transition hover:bg-white/20 md:right-6 md:top-6"
            aria-label="Đóng"
          >
            <X size={24} />
          </button>

          {/* =================================================
              PREVIOUS
          ================================================= */}
          {gallery.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              className="absolute left-3 top-1/2 z-[10002] -translate-y-1/2 rounded-full bg-white/10 p-3 text-white backdrop-blur-md transition hover:bg-white/20 md:left-6"
              aria-label="Ảnh trước"
            >
              <ChevronLeft size={28} />
            </button>
          )}

          {/* =================================================
              FULL IMAGE

              Giới hạn 90% màn hình.
              Ảnh tự co lại để nhìn thấy TOÀN BỘ.
          ================================================= */}
          <div
            className="flex max-h-[90vh] max-w-[90vw] items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={currentImage}
              alt={title}
              className="block max-h-[90vh] max-w-[90vw] object-contain"
            />
          </div>

          {/* =================================================
              NEXT
          ================================================= */}
          {gallery.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              className="absolute right-3 top-1/2 z-[10002] -translate-y-1/2 rounded-full bg-white/10 p-3 text-white backdrop-blur-md transition hover:bg-white/20 md:right-6"
              aria-label="Ảnh tiếp theo"
            >
              <ChevronRight size={28} />
            </button>
          )}

          {/* =================================================
              COUNTER
          ================================================= */}
          {gallery.length > 1 && (
            <div className="absolute bottom-4 left-1/2 z-[10002] -translate-x-1/2 rounded-full bg-black/60 px-4 py-2 text-sm font-medium text-white backdrop-blur-md">
              {index + 1} / {gallery.length}
            </div>
          )}
        </div>
      )}
    </>
  );
}