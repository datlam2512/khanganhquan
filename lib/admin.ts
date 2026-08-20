import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { hasSupabaseConfig } from "@/lib/data";

export const DEMO_ADMIN_EMAIL =
  process.env.DEMO_ADMIN_EMAIL || "admin@kaq.local";
export const DEMO_ADMIN_PASSWORD =
  process.env.DEMO_ADMIN_PASSWORD || "KAQ@2026Admin";
const DEMO_COOKIE = "kaq_demo_admin";

export async function isDemoAdmin() {
  const store = await cookies();
  return store.get(DEMO_COOKIE)?.value === "1";
}

export async function loginDemoAdmin(email: string, password: string) {
  if (email !== DEMO_ADMIN_EMAIL || password !== DEMO_ADMIN_PASSWORD)
    return false;
  const store = await cookies();
  store.set(DEMO_COOKIE, "1", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
  return true;
}

export async function logoutDemoAdmin() {
  const store = await cookies();
  store.set(DEMO_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

export async function requireAdmin() {
  if (!hasSupabaseConfig()) {
    if (!(await isDemoAdmin())) {
      redirect("/admin/login");
    }

    return null;
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const adminEmail = process.env.ADMIN_EMAIL;

  if (!adminEmail || user.email !== adminEmail) {
    redirect("/admin/login");
  }

  return supabase;
}
