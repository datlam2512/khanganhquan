"use client";

import { useEffect, useRef, type ReactNode } from "react";

export function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      node.style.opacity = "1";
      node.style.transform = "none";
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          node.style.transition =
            "opacity .72s cubic-bezier(.22,.8,.2,1), transform .72s cubic-bezier(.22,.8,.2,1)";
          node.style.opacity = "1";
          node.style.transform = "translateY(0)";
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    node.style.opacity = "0";
    node.style.transform = "translateY(18px)";
    node.style.transitionDelay = `${delay}ms`;
    observer.observe(node);

    return () => observer.disconnect();
  }, [delay]);

  return <div ref={ref} className={className}>{children}</div>;
}
