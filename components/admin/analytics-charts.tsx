import type { ReactNode } from "react";

type DailyPoint = { label: string; views: number; visitors: number };
type PagePoint = { path: string; views: number };

function MiniLineChart({ data }: { data: DailyPoint[] }) {
  const width = 760;
  const height = 250;
  const padX = 34;
  const padY = 24;
  const max = Math.max(1, ...data.map((d) => d.views));
  const step = data.length > 1 ? (width - padX * 2) / (data.length - 1) : 0;
  const points = data.map((d, i) => `${padX + i * step},${height - padY - (d.views / max) * (height - padY * 2)}`).join(" ");
  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--line)] bg-white p-4 sm:p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm font-extrabold text-[var(--ink)]">Lượt xem trong 7 ngày</div>
          <div className="mt-1 text-xs text-[var(--muted)]">Xu hướng page views theo ngày</div>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold text-[#4f6559]"><span className="h-2.5 w-2.5 rounded-full bg-[var(--brand)]" /> Page views</div>
      </div>
      <div className="mt-5 overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="h-[230px] min-w-[650px] w-full" role="img" aria-label="Biểu đồ lượt xem trong 7 ngày">
          {[0, 1, 2, 3].map((i) => {
            const y = padY + (i * (height - padY * 2)) / 3;
            return <line key={i} x1={padX} x2={width - padX} y1={y} y2={y} stroke="#e9efeb" strokeWidth="1" />;
          })}
          <polyline points={points} fill="none" stroke="#0b9f4a" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          {data.map((d, i) => {
            const x = padX + i * step;
            const y = height - padY - (d.views / max) * (height - padY * 2);
            return <g key={d.label}><circle cx={x} cy={y} r="5" fill="#fff" stroke="#0b9f4a" strokeWidth="3" /><text x={x} y={height - 5} textAnchor="middle" fontSize="11" fill="#718078">{d.label}</text></g>;
          })}
        </svg>
      </div>
    </div>
  );
}

function RankedPages({ data }: { data: PagePoint[] }) {
  const max = Math.max(1, ...data.map((d) => d.views));
  return (
    <div className="rounded-2xl border border-[var(--line)] bg-white p-5">
      <div className="text-sm font-extrabold">Trang được xem nhiều nhất</div>
      <div className="mt-1 text-xs text-[var(--muted)]">Top pages trong dữ liệu analytics</div>
      <div className="mt-5 space-y-4">
        {data.map((item, index) => (
          <div key={item.path}>
            <div className="flex items-center justify-between gap-3 text-sm">
              <div className="flex min-w-0 items-center gap-3"><span className="grid size-7 shrink-0 place-items-center rounded-lg bg-[#edf7f0] text-xs font-black text-[#087a3a]">{index + 1}</span><span className="truncate font-semibold text-[#30473a]">{item.path}</span></div>
              <span className="shrink-0 font-black text-[#173826]">{item.views}</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#edf2ee]"><div className="h-full rounded-full bg-[#0b9f4a]" style={{ width: `${Math.max(4, (item.views / max) * 100)}%` }} /></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AnalyticsCharts({ daily, pages }: { daily: DailyPoint[]; pages: PagePoint[] }): ReactNode {
  return <div className="grid gap-5 xl:grid-cols-[1.5fr_.9fr]"><MiniLineChart data={daily} /><RankedPages data={pages} /></div>;
}
