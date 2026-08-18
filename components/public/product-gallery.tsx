"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

export function ProductGallery({ images, title }: { images: string[]; title: string }) {
  const gallery = images.filter(Boolean);
  const [index, setIndex] = useState(0);

  if (!gallery.length) return null;
  const safeIndex = Math.min(index, gallery.length - 1);
  const current = gallery[safeIndex];

  const move = (direction: 1 | -1) => {
    setIndex((value) => (value + direction + gallery.length) % gallery.length);
  };

  return (
    <div>
      <div className="relative aspect-[4/3] overflow-hidden rounded-[28px] border border-[#e1e9e4] bg-white shadow-[0_20px_55px_rgba(20,35,27,.08)]">
        <Image src={current} alt={`${title} - ${index + 1}`} fill priority={safeIndex === 0} className="object-contain p-3 transition-opacity duration-500" sizes="(max-width:1024px) 100vw, 600px" />
        {gallery.length > 1 && (
          <>
            <button type="button" onClick={() => move(-1)} aria-label="Previous image" className="absolute left-4 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-white/30 bg-[#0c2a19]/65 text-white shadow-lg backdrop-blur-md transition hover:bg-[#0c2a19]/85"><ChevronLeft className="size-5" /></button>
            <button type="button" onClick={() => move(1)} aria-label="Next image" className="absolute right-4 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-white/30 bg-[#0c2a19]/65 text-white shadow-lg backdrop-blur-md transition hover:bg-[#0c2a19]/85"><ChevronRight className="size-5" /></button>
            <div className="absolute bottom-4 right-4 rounded-full bg-[#0c2a19]/70 px-3 py-1.5 text-[11px] font-bold text-white backdrop-blur-md">{safeIndex + 1} / {gallery.length}</div>
          </>
        )}
      </div>
      {gallery.length > 1 && (
        <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
          {gallery.map((image, i) => (
            <button type="button" key={`${image}-${i}`} onClick={() => setIndex(i)} className={`relative h-20 w-24 shrink-0 overflow-hidden rounded-xl border-2 bg-white transition ${i === safeIndex ? "border-[#11823b] shadow-[0_6px_18px_rgba(17,130,59,.15)]" : "border-[#e0e8e3] opacity-70 hover:opacity-100"}`} aria-label={`View image ${i + 1}`}>
              <Image src={image} alt="" fill className="object-contain p-1" sizes="96px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
