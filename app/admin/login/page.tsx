"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const supabaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
);

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (!supabaseConfigured) {
        const res = await fetch("/admin/api/demo-login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        if (!res.ok) {
          setError("Sai tài khoản hoặc mật khẩu demo.");
          return;
        }
        router.replace("/admin/dashboard");
        router.refresh();
        return;
      }
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (authError) {
        setError(authError.message);
        return;
      }
      router.replace("/admin/dashboard");
      router.refresh();
    } catch {
      setError(
        "Không thể đăng nhập. Hãy kiểm tra cấu hình Supabase hoặc thử lại.",
      );
    } finally {
      setLoading(false);
    }

  }

  return (
    <main className="grid min-h-screen place-items-center bg-[#f3f7f4] p-5">
      <form
        onSubmit={submit}
        className="w-full max-w-[440px] rounded-[26px] border border-[#dfe8e2] bg-white p-7 shadow-[0_22px_65px_rgba(20,35,27,.09)] md:p-9"
      >
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[var(--brand)] font-black text-white shadow-[0_10px_24px_rgba(11,159,74,.22)]">
          KAQ
        </div>
        <h1 className="heading-display mt-6 text-3xl font-extrabold">
          Đăng nhập quản trị
        </h1>
        <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
          Quản lý sản phẩm, dự án, hình ảnh, nội dung công ty và thống kê
          website.
        </p>
        {!supabaseConfigured && (
          <div className="mt-5 rounded-2xl border border-[#cfead9] bg-[#f1fbf5] p-4 text-sm leading-6 text-[#365243]">
            <div className="font-extrabold text-[#0d6d34]">
              Tài khoản demo local
            </div>
            <div className="mt-2">
              Email:{" "}
              <code className="rounded bg-white px-1.5 py-0.5">
                admin@kaq.local
              </code>
            </div>
            <div>
              Mật khẩu:{" "}
              <code className="rounded bg-white px-1.5 py-0.5">
                KAQ@2026Admin
              </code>
            </div>
            <div className="mt-2 text-xs text-[#5c6f64]">
              Chỉ dùng để preview khi chưa cấu hình Supabase. Khi deploy thật,
              hãy dùng Supabase Auth.
            </div>
          </div>
        )}
        <div className="mt-6 space-y-4">
          <Input
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            required
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </Button>
          {error && (
            <div className="rounded-xl bg-red-50 p-3 text-sm leading-6 text-red-700">
              {error}
            </div>
          )}
        </div>
      </form>
    </main>
  );
}
