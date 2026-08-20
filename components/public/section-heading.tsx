export function SectionHeading({ eyebrow, title, description, align = "left" }: { eyebrow: string; title: string; description?: string; align?: "left" | "center" }) {
  const centered = align === "center";
  return (
    <div className={centered ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      <div className="section-label">{eyebrow}</div>
      <h2 className="heading-display mt-3 text-[2.15rem] font-extrabold leading-[1.06] text-[#173626] sm:text-[2.55rem] lg:text-[3.1rem]">
        {title}
      </h2>
      {description && <p className="body-copy mt-5 max-w-2xl text-[15px] leading-7 text-[#66756C] sm:text-base">{description}</p>}
    </div>
  );
}
