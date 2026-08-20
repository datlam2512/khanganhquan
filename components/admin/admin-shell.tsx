"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Package, FolderTree, BriefcaseBusiness, Handshake, Building2, BarChart3, LogOut, ChevronRight, Images } from "lucide-react";
import { useState } from "react";

const items = [
  ["/admin/dashboard", "Dashboard", LayoutDashboard],
  ["/admin/homepage", "Trang chủ", Images],
  ["/admin/products", "Sản phẩm", Package],
  ["/admin/categories", "Danh mục", FolderTree],
  ["/admin/projects", "Dự án", BriefcaseBusiness],
  ["/admin/partners", "Đối tác", Handshake],
  ["/admin/company", "Công ty", Building2],
  ["/admin/analytics", "Analytics", BarChart3],
] as const;

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);
  const active = items.find(([href]) => pathname === href || pathname.startsWith(`${href}/`));
  const ActiveIcon = active?.[2] ?? LayoutDashboard;

  async function logout() {
    setLoggingOut(true);
    await fetch("/admin/api/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-[#f4f7f5] text-[var(--ink)]">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[272px] border-r border-[#dfe8e2] bg-white lg:flex lg:flex-col">
        <div className="flex h-[78px] items-center gap-3 border-b border-[#e8eee9] px-6">
          <div className="grid size-10 place-items-center rounded-xl bg-[var(--brand)] text-xs font-black text-white shadow-[0_8px_20px_rgba(11,159,74,.2)]">KAQ</div>
          <div><div className="font-display text-[15px] font-extrabold tracking-[-.02em]">Khang Anh Quân</div><div className="mt-0.5 text-[11px] font-semibold uppercase tracking-[.12em] text-[#87938c]">Admin CMS</div></div>
        </div>
        <div className="px-5 pt-7"><div className="px-2 text-[10px] font-extrabold uppercase tracking-[.16em] text-[#99a39d]">Quản trị</div></div>
        <nav className="mt-3 flex-1 space-y-1 px-4">
          {items.map(([href, label, Icon]) => {
            const isActive = pathname === href || pathname.startsWith(`${href}/`);
            return <Link key={href} href={href} className={`group flex items-center gap-3 rounded-xl px-3.5 py-3 text-[13px] font-bold transition ${isActive ? "bg-[#eaf7ef] text-[#087a3a] shadow-sm" : "text-[#5f7066] hover:bg-[#f5f8f6] hover:text-[#173826]"}`}><Icon className={`size-[17px] ${isActive ? "text-[#0b9f4a]" : "text-[#8b9890] group-hover:text-[#53665b]"}`} /><span className="flex-1">{label}</span>{isActive && <ChevronRight className="size-4 text-[#75b78c]" />}</Link>;
          })}
        </nav>
        <div className="m-4 rounded-2xl border border-[#e3ebe5] bg-[#f8fbf9] p-3.5">
          <div className="text-xs font-extrabold text-[#30473a]">Khu vực quản trị</div>
          <div className="mt-1 text-[11px] leading-5 text-[#7b8981]">Quản lý nội dung website và theo dõi hiệu quả truy cập.</div>
          <button onClick={logout} disabled={loggingOut} className="mt-3 flex w-full items-center gap-2 rounded-xl border border-[#dce6df] bg-white px-3 py-2.5 text-xs font-bold text-[#53655b] transition hover:border-[#b9d7c2] hover:text-[#087a3a]"><LogOut className="size-4" />{loggingOut ? "Đang đăng xuất…" : "Đăng xuất"}</button>
        </div>
      </aside>

      <div className="lg:ml-[272px]">
        <header className="sticky top-0 z-30 border-b border-[#dfe8e2] bg-white/90 backdrop-blur-xl">
          <div className="flex min-h-[78px] items-center justify-between gap-4 px-5 lg:px-8">
            <div className="min-w-0"><div className="flex items-center gap-2 text-xs font-semibold text-[#94a099]"><span>Admin</span><ChevronRight className="size-3" /><span className="text-[#53655b]">{active?.[1] ?? "Dashboard"}</span></div><div className="mt-1 flex items-center gap-2"><ActiveIcon className="size-4 text-[#0b9f4a]" /><span className="truncate text-sm font-extrabold text-[#173826]">{active?.[1] ?? "Dashboard"}</span></div></div>
            <div className="hidden items-center gap-3 sm:flex"><div className="rounded-full border border-[#dfe8e2] bg-[#f8fbf9] px-3 py-2 text-xs font-bold text-[#5e7065]">Quản trị viên</div><button onClick={logout} disabled={loggingOut} className="rounded-xl border border-[#dfe8e2] bg-white p-2.5 text-[#66776d] hover:border-[#bdd9c6] hover:text-[#087a3a] lg:hidden"><LogOut className="size-4" /></button></div>
          </div>
          <nav className="flex gap-1 overflow-x-auto border-t border-[#edf1ee] px-4 py-2 lg:hidden">{items.map(([href,label])=><Link key={href} href={href} className={`whitespace-nowrap rounded-lg px-3 py-2 text-xs font-bold ${pathname === href || pathname.startsWith(`${href}/`) ? "bg-[#eaf7ef] text-[#087a3a]" : "text-[#65756c]"}`}>{label}</Link>)}</nav>
        </header>
        <main className="min-h-[calc(100vh-78px)] p-5 lg:p-8 xl:p-10">{children}</main>
      </div>
    </div>
  );
}
