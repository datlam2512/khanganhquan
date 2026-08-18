import Link from "next/link";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  href?: string;
  variant?: "primary" | "outline" | "ghost";
};

export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  { className, href, variant = "primary", children, ...props },
  ref,
) {
  const styles = cn(
    "group inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold tracking-[-0.01em] transition-all duration-200 active:translate-y-px",
    {
      "bg-[#0B9F4A] text-white shadow-[0_10px_25px_rgba(11,159,74,.22)] hover:-translate-y-0.5 hover:bg-[#087A3A] hover:shadow-[0_14px_30px_rgba(11,159,74,.28)]": variant === "primary",
      "border border-[#CFE0D4] bg-white/90 text-[#17462C] hover:-translate-y-0.5 hover:border-[#8FC8A2] hover:bg-[#F1FBF5]": variant === "outline",
      "text-[#244A34] hover:bg-[#EAF7EF]": variant === "ghost",
    },
    className,
  );

  if (href) return <Link href={href} className={styles}>{children}</Link>;
  return <button ref={ref} className={styles} {...props}>{children}</button>;
});
