"use client";

import { FormEvent, useState } from "react";
import { ArrowRight, CheckCircle2, Mail, Phone, Building2, MessageSquare } from "lucide-react";

export default function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.message || "Gửi thất bại");

      setOk(true);
      setResult("Yêu cầu đã được gửi. Khang Anh Quân sẽ liên hệ lại sớm.");
      form.reset();
    } catch (err) {
      setOk(false);
      setResult(err instanceof Error ? err.message : "Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="contact-form" className="relative overflow-hidden bg-[#f7faf8] py-20 md:py-24">
      <div className="absolute inset-y-0 right-0 hidden w-[34%] bg-[radial-gradient(circle_at_center,rgba(17,130,59,.10),transparent_66%)] lg:block" />
      <div className="container-kaq relative">
        <div className="mb-10 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <div className="eyebrow">Gửi yêu cầu tư vấn</div>
            <h2 className="heading-display mt-3 text-4xl font-extrabold leading-[1.02] tracking-[-.055em] text-[#0f3020] md:text-5xl">
              Kết nối với Khang Anh Quân
              <span className="text-[#11823b]"> để bắt đầu trao đổi.</span>
            </h2>
          </div>
          <p className="max-w-md text-sm leading-7 text-[#68756e]">
            Điền thông tin bên dưới. Yêu cầu của bạn sẽ được gửi tới đội ngũ phụ trách để tiếp nhận và phản hồi.
          </p>
        </div>

        <div className="grid overflow-hidden rounded-[30px] border border-[#dfe8e2] bg-white shadow-[0_28px_70px_rgba(18,47,31,.10)] lg:grid-cols-[.8fr_1.2fr]">
          <div className="relative overflow-hidden bg-[#0d3a21] p-7 text-white md:p-9 lg:p-10">
            <div className="absolute -right-20 -top-20 size-64 rounded-full border border-white/10" />
            <div className="absolute -bottom-24 -left-16 size-72 rounded-full border border-white/10" />
            <div className="relative z-10">
              <div className="text-[11px] font-extrabold uppercase tracking-[.18em] text-[#aee1bd]">Khang Anh Quân</div>
              <h3 className="heading-display mt-4 text-3xl font-extrabold leading-tight tracking-[-.04em] md:text-4xl">
                Trao đổi trực tiếp với đội ngũ của chúng tôi.
              </h3>
              <p className="mt-5 max-w-md text-sm leading-7 text-white/70">
                Để lại thông tin liên hệ và nội dung cần tư vấn. Chúng tôi sẽ tiếp nhận yêu cầu và liên hệ lại với bạn.
              </p>

              <div className="mt-8 space-y-3">
                {[
                  [Phone, "Điện thoại", "+84 28 3753 3688"],
                  [Mail, "Email", "sales@kaq.com.vn"],
                  [Building2, "Trụ sở", "TP. Hồ Chí Minh, Việt Nam"],
                ].map(([Icon, label, value]) => {
                  const C = Icon as typeof Phone;
                  return (
                    <div key={label as string} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.05] p-3.5">
                      <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-white/10">
                        <C className="size-4 text-[#b6e6c4]" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[10px] font-extrabold uppercase tracking-[.14em] text-white/50">{label as string}</div>
                        <div className="mt-1 text-sm font-bold text-white/90">{value as string}</div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-8 flex items-center gap-2 text-xs font-semibold text-white/55">
                <CheckCircle2 className="size-4 text-[#9edcb0]" />
                Thông tin được tiếp nhận và lưu trên hệ thống quản trị.
              </div>
            </div>
          </div>

          <form onSubmit={submit} className="p-6 md:p-9 lg:p-10">
            <div className="grid gap-5 md:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-[12px] font-extrabold text-[#263b30]">Họ và tên *</span>
                <input
                  name="name"
                  required
                  placeholder="Nguyễn Văn A"
                  className="h-12 w-full rounded-xl border border-[#dfe8e2] bg-[#fbfcfb] px-4 text-sm outline-none transition placeholder:text-[#a0aaa4] focus:border-[#79bc8e] focus:bg-white focus:ring-4 focus:ring-[#edf8f1]"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-[12px] font-extrabold text-[#263b30]">Công ty</span>
                <input
                  name="company"
                  placeholder="Tên doanh nghiệp"
                  className="h-12 w-full rounded-xl border border-[#dfe8e2] bg-[#fbfcfb] px-4 text-sm outline-none transition placeholder:text-[#a0aaa4] focus:border-[#79bc8e] focus:bg-white focus:ring-4 focus:ring-[#edf8f1]"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-[12px] font-extrabold text-[#263b30]">Số điện thoại *</span>
                <input
                  name="phone"
                  type="tel"
                  required
                  placeholder="090 123 4567"
                  className="h-12 w-full rounded-xl border border-[#dfe8e2] bg-[#fbfcfb] px-4 text-sm outline-none transition placeholder:text-[#a0aaa4] focus:border-[#79bc8e] focus:bg-white focus:ring-4 focus:ring-[#edf8f1]"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-[12px] font-extrabold text-[#263b30]">Email *</span>
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="you@company.com"
                  className="h-12 w-full rounded-xl border border-[#dfe8e2] bg-[#fbfcfb] px-4 text-sm outline-none transition placeholder:text-[#a0aaa4] focus:border-[#79bc8e] focus:bg-white focus:ring-4 focus:ring-[#edf8f1]"
                />
              </label>

              <label className="block md:col-span-2">
                <span className="mb-2 block text-[12px] font-extrabold text-[#263b30]">Nội dung yêu cầu *</span>
                <div className="relative">
                  <MessageSquare className="pointer-events-none absolute left-4 top-4 size-4 text-[#8c9992]" />
                  <textarea
                    name="message"
                    required
                    rows={6}
                    placeholder="Mô tả sản phẩm, thiết bị hoặc nhu cầu dự án bạn đang quan tâm..."
                    className="min-h-36 w-full resize-y rounded-xl border border-[#dfe8e2] bg-[#fbfcfb] py-3.5 pl-11 pr-4 text-sm outline-none transition placeholder:text-[#a0aaa4] focus:border-[#79bc8e] focus:bg-white focus:ring-4 focus:ring-[#edf8f1]"
                  />
                </div>
              </label>

              <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

              <div className="md:col-span-2 flex flex-col gap-3 border-t border-[#edf1ee] pt-5 sm:flex-row sm:items-center sm:justify-between">
                <div className={`min-h-5 text-sm ${ok ? "text-[#0d7a36]" : "text-[#b13b3b]"}`}>{result}</div>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#0f813b] px-6 text-sm font-extrabold text-white shadow-[0_8px_22px_rgba(15,129,59,.18)] transition hover:bg-[#0a6c32] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Đang gửi..." : "Gửi yêu cầu"}
                  {!loading && <ArrowRight className="size-4" />}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
