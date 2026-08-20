"use client";
import { useEffect, useState } from "react";

export function DemoAnalytics({ label = "Page views" }: { label?: string }) {
  const [views, setViews] = useState(0);
  const [sessions, setSessions] = useState(0);
  useEffect(() => {
    setViews(Number(localStorage.getItem("kaq_demo_pageviews") || 0));
    setSessions(Number(localStorage.getItem("kaq_demo_sessions") || 1));
  }, []);
  return <div><div className="text-sm font-semibold text-[#6D7971]">{label}</div><div className="mt-2 text-2xl font-black">{views}</div><div className="mt-1 text-xs text-[#718078]">{sessions} anonymous session{sessions === 1 ? "" : "s"}</div></div>;
}

export function DemoAnalyticsBootstrap() {
  useEffect(() => {
    const current = Number(localStorage.getItem("kaq_demo_pageviews") || 0);
    localStorage.setItem("kaq_demo_pageviews", String(current));
    if (!localStorage.getItem("kaq_demo_sessions")) localStorage.setItem("kaq_demo_sessions", "1");
  }, []);
  return null;
}
