"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

function getDevice() {
  const width = window.innerWidth;
  return width < 768 ? "mobile" : width < 1024 ? "tablet" : "desktop";
}
function getBrowser() {
  const ua = navigator.userAgent;
  if (ua.includes("Edg")) return "Edge";
  if (ua.includes("Chrome")) return "Chrome";
  if (ua.includes("Firefox")) return "Firefox";
  if (ua.includes("Safari")) return "Safari";
  return "Other";
}
export function PageViewTracker() {
  const pathname = usePathname();
  useEffect(() => {
    let sessionId = localStorage.getItem("kaq_session_id");
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      localStorage.setItem("kaq_session_id", sessionId);
    }
    if (typeof window !== "undefined") {
      const count = Number(localStorage.getItem("kaq_demo_pageviews") || 0);
      localStorage.setItem("kaq_demo_pageviews", String(count + 1));
      localStorage.setItem("kaq_demo_sessions", "1");
    }
    void fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        page_path: pathname,
        session_id: sessionId,
        device_type: getDevice(),
        browser: getBrowser(),
        referrer: document.referrer || null,
      }),
    });
  }, [pathname]);
  return null;
}
