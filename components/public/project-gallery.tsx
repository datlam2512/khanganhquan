"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

export function ProjectGallery({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  const gallery = images.filter(Boolean).length ? images.filter(Boolean) : [];
  const [index, setIndex] = useState(0);

  if (!gallery.length) return null;
  const current = gallery[index];

  const move = (direction: 1 | -1) => {
    setIndex((value) => (value + direction + gallery.length) % gallery.length);
  };

  return (
    <div className="mt-8">
      <div className="relative aspect-[16/8.5] overflow-hidden rounded-[28px] bg-[#e8efea] shadow-[0_20px_55px_rgba(20,35,27,.10)]">
        <Image
          src={current}
          alt={`${title} - ${index + 1}`}
          fill
          priority={index === 0}
          className="object-cover transition-opacity duration-500"
          sizes="(max-width:1024px) 100vw, 1100px"
        />
        {gallery.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => move(-1)}
              aria-label="Ảnh trước"
              className="absolute left-4 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-white/30 bg-black/30 text-white backdrop-blur-md transition hover:bg-black/50"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              onClick={() => move(1)}
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
    </div>
  );
}
