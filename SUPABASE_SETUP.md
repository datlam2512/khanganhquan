# Supabase setup for KAQ

Upload hình ảnh cần Supabase Storage. Nếu chưa cấu hình, website vẫn chạy demo nhưng upload sẽ không gọi Supabase và sẽ hiển thị hướng dẫn thay vì lỗi `@supabase/ssr`.

## 1. Tạo `.env.local`

Copy `.env.example` thành `.env.local` và điền:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_xxx
```

Nếu project Supabase của bạn vẫn dùng anon key cũ, có thể dùng:

```env
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

Không đưa `SUPABASE_SERVICE_ROLE_KEY` vào frontend và không đặt nó dưới `NEXT_PUBLIC_`.

## 2. Chạy schema

Supabase Dashboard → SQL Editor → chạy `supabase/schema.sql`.

Schema tạo các bucket public:

- `product-images`
- `project-images`
- `partner-images`
- `company-images`

và policy cho admin upload/update/delete.

## 3. Tài khoản admin

Supabase Authentication → Users → tạo user.
Sau đó trong bảng `profiles`, đặt `role = admin` cho đúng user id.

## 4. Khởi động lại Next.js

Sau khi thay `.env.local`, phải restart:

```bash
npm run dev
```

Không cần `npm install` lại chỉ vì thay env.
