import { getCategories, getProducts, getProjects, hasSupabaseConfig } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";
import { AnalyticsCharts } from "@/components/admin/analytics-charts";
import { DemoAnalyticsBootstrap } from "@/components/admin/demo-analytics";
import { Package, FolderTree, BriefcaseBusiness, Users, Eye, ArrowUpRight } from "lucide-react";

function demoData() {
  return { total: 184, today: 27, last7: 184, uniqueSessions: 91,
    daily: [42,31,26,35,18,19,13].map((views,i)=>({label:["T2","T3","T4","T5","T6","T7","CN"][i],views,visitors:Math.max(5,Math.round(views*.55))})),
    pages: [{path:"/vi",views:62},{path:"/vi/san-pham",views:41},{path:"/vi/du-an",views:29},{path:"/vi/gioi-thieu",views:24},{path:"/vi/lien-he",views:18}] };
}
async function getAnalytics(){
  if(!hasSupabaseConfig()) return demoData();
  const supabase=await createClient(); const since=new Date(Date.now()-7*86400000).toISOString();
  const {data}=await supabase.from("analytics_events").select("page_path,session_id,created_at").gte("created_at",since).order("created_at",{ascending:true}).limit(10000);
  const rows=data??[]; const total=rows.length; const today=rows.filter(r=>new Date(r.created_at).getTime()>=Date.now()-86400000).length; const uniqueSessions=new Set(rows.map(r=>r.session_id).filter(Boolean)).size;
  const dayMap=new Map<string,{views:number;visitors:Set<string>}>(); const pageMap=new Map<string,number>();
  for(const row of rows){const key=new Intl.DateTimeFormat("vi-VN",{weekday:"short"}).format(new Date(row.created_at)); const x=dayMap.get(key)??{views:0,visitors:new Set<string>()}; x.views++; if(row.session_id)x.visitors.add(row.session_id); dayMap.set(key,x); if(row.page_path)pageMap.set(row.page_path,(pageMap.get(row.page_path)??0)+1);}
  const daily=Array.from(dayMap.entries()).slice(-7).map(([label,v])=>({label:label.replace("Thứ ","T"),views:v.views,visitors:v.visitors.size}));
  const pages=Array.from(pageMap.entries()).sort((a,b)=>b[1]-a[1]).slice(0,5).map(([path,views])=>({path,views}));
  const fallback=demoData(); return {total,today,last7:total,uniqueSessions,daily:daily.length?daily:fallback.daily,pages:pages.length?pages:fallback.pages};
}
const Stat=({icon:Icon,label,value,detail}:{icon:typeof Package;label:string;value:number;detail:string})=><div className="rounded-2xl border border-[#dfe8e2] bg-white p-5 shadow-[0_8px_24px_rgba(20,35,27,.035)]"><div className="flex items-start justify-between"><div className="grid size-10 place-items-center rounded-xl bg-[#eaf7ef] text-[#0b9f4a]"><Icon className="size-5"/></div><ArrowUpRight className="size-4 text-[#a1ada6]"/></div><div className="mt-5 text-[11px] font-extrabold uppercase tracking-[.13em] text-[#87938c]">{label}</div><div className="mt-1 text-3xl font-display font-extrabold tracking-[-.04em] text-[#173826]">{value.toLocaleString("vi-VN")}</div><div className="mt-1 text-xs text-[#7b8981]">{detail}</div></div>;
export default async function Dashboard(){
 const [products,categories,projects,analytics]=await Promise.all([getProducts(),getCategories(),getProjects(),getAnalytics()]);
 return <div className="mx-auto max-w-[1500px]"><DemoAnalyticsBootstrap/>
  <div className="mb-7 flex flex-col justify-between gap-4 xl:flex-row xl:items-end"><div><div className="section-label">Tổng quan</div><h1 className="heading-display mt-2 text-3xl font-extrabold tracking-[-.045em] md:text-4xl">Dashboard</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-[#718078]">Theo dõi nội dung website và hiệu quả truy cập từ một màn hình duy nhất.</p></div><div className="rounded-xl border border-[#dfe8e2] bg-white px-4 py-2.5 text-xs font-bold text-[#5d7065]">Dữ liệu 7 ngày gần nhất</div></div>
  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"><Stat icon={Package} label="Sản phẩm" value={products.length} detail="Đang có trong catalog"/><Stat icon={FolderTree} label="Danh mục" value={categories.length} detail="Nhóm sản phẩm"/><Stat icon={BriefcaseBusiness} label="Dự án" value={projects.length} detail="Dự án được công bố"/><Stat icon={Users} label="Unique visitors" value={analytics.uniqueSessions} detail="Trong 7 ngày gần nhất"/></div>
  <div className="mt-5 grid gap-4 md:grid-cols-2"><div className="rounded-2xl border border-[#dfe8e2] bg-white p-5"><div className="flex items-center gap-3"><div className="grid size-10 place-items-center rounded-xl bg-[#f0f7f2] text-[#087a3a]"><Eye className="size-5"/></div><div><div className="text-xs font-bold text-[#7b8981]">Page views</div><div className="text-xl font-display font-extrabold">{analytics.total.toLocaleString("vi-VN")}</div></div></div><div className="mt-3 text-xs text-[#87938c]">24 giờ qua: <strong className="text-[#42584b]">{analytics.today}</strong> · 7 ngày: <strong className="text-[#42584b]">{analytics.last7}</strong></div></div><div className="rounded-2xl border border-[#dfe8e2] bg-[#0f5a31] p-5 text-white"><div className="text-xs font-bold text-[#b9e2c7]">Trạng thái hệ thống</div><div className="mt-2 text-xl font-display font-extrabold">Website đang hoạt động</div><div className="mt-2 text-sm text-[#d4eadb]">{hasSupabaseConfig()?"Analytics đang lấy dữ liệu từ Supabase.":"Bạn đang ở Demo Mode; kết nối Supabase để dùng dữ liệu thật."}</div></div></div>
  <div className="mt-5"><AnalyticsCharts daily={analytics.daily} pages={analytics.pages}/></div>
 </div>;
}
