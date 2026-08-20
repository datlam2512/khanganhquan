"use client";

import { useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { AnalyticsRealtime } from "@/components/admin/analytics-realtime";
function getSessionId() {
  const key = "kaq_analytics_session";

  let sessionId = sessionStorage.getItem(key);

  if (!sessionId) {
    sessionId = crypto.randomUUID();
    sessionStorage.setItem(key, sessionId);
  }

  return sessionId;
}

function getDeviceType() {
  const width = window.innerWidth;

  if (width < 768) return "mobile";
  if (width < 1024) return "tablet";

  return "desktop";
}

function getBrowser() {
  const ua = navigator.userAgent;

  if (ua.includes("Edg")) return "Edge";
  if (ua.includes("Chrome")) return "Chrome";
  if (ua.includes("Firefox")) return "Firefox";
  if (ua.includes("Safari")) return "Safari";

  return "Unknown";
}

export function AnalyticsTracker() {
  useEffect(() => {
    async function track() {
      const url =
        process.env.NEXT_PUBLIC_SUPABASE_URL;

      const key =
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

      console.log("Supabase URL:", url);
      console.log(
        "Publishable key exists:",
        Boolean(key),
      );

      if (!url || !key) {
        console.error(
          "Missing Supabase environment variables",
        );
        return;
      }

      const supabase = createBrowserClient(
        url,
        key,
      );

      const payload = {
        page_path:
          window.location.pathname +
          window.location.search,

        session_id: getSessionId(),

        device_type: getDeviceType(),

        browser: getBrowser(),

        referrer:
          document.referrer || null,
      };

      console.log(
        "📊 Analytics payload:",
        payload,
      );

      const { data, error } = await supabase
        .from("analytics_events")
        .insert(payload)
        .select()
        .single();

      if (error) {
        console.error(
          "Analytics insert failed:",
          error,
        );

        return;
      }

      console.log(
        "✅ Analytics inserted:",
        data,
      );
    }

    track();
  }, []);

  return null;
}