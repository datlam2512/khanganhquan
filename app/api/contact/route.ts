import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Honeypot: silently accept bot submissions.
    if (body.website) {
      return NextResponse.json({ ok: true });
    }

    const name = String(body.name ?? "").trim();
    const company = String(body.company ?? "").trim();
    const phone = String(body.phone ?? "").trim();
    const email = String(body.email ?? "").trim();
    const message = String(body.message ?? "").trim();

    if (!name || !phone || !email || !message) {
      return NextResponse.json(
        { ok: false, message: "Vui lòng điền đầy đủ các trường bắt buộc." },
        { status: 400 }
      );
    }

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailOk) {
      return NextResponse.json(
        { ok: false, message: "Email không hợp lệ." },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { error } = await supabase.from("contact_submissions").insert({
      name,
      company: company || null,
      phone,
      email,
      message,
      status: "new",
    });

    if (error) {
      console.error("contact_submissions insert error:", error);
      return NextResponse.json(
        { ok: false, message: "Không thể gửi yêu cầu lúc này." },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("contact API error:", error);
    return NextResponse.json(
      { ok: false, message: "Có lỗi xảy ra. Vui lòng thử lại." },
      { status: 500 }
    );
  }
}
