import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Client dùng cho các truy vấn công khai (trang public, không phụ thuộc
 * người dùng đăng nhập). Khác với `lib/supabase/server.ts`, client này
 * KHÔNG đụng tới `cookies()` — nhờ vậy các trang gọi nó có thể được Next.js
 * tiền dựng tĩnh / ISR thay vì bị ép render động (SSR) trên mọi request,
 * vốn là nguyên nhân chính khiến việc chuyển trang luôn cảm giác chậm.
 *
 * Quyền truy cập dữ liệu vẫn y hệt client cũ: cả hai đều dùng anon key và
 * đều bị Row Level Security giới hạn ở các bản ghi published = true, nên
 * đổi client này không làm lộ thêm dữ liệu nào.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let cached: ReturnType<typeof createSupabaseClient<any>> | null = null;

export function createPublicClient() {
  if (cached) return cached;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY/NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable.",
    );
  }

  cached = createSupabaseClient<any>(url, key, { // eslint-disable-line @typescript-eslint/no-explicit-any
    auth: { persistSession: false, autoRefreshToken: false },
  });

  return cached;
}
