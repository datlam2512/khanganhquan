# Khang Anh Quân - Contact Form Fixed

This patch is based on the previously working company-contact-info version.

## Install
npm install
npm run dev

## Supabase
1. Configure .env.local:
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
   (or NEXT_PUBLIC_SUPABASE_ANON_KEY)
2. Run supabase/contact_submissions.sql in Supabase SQL Editor.
3. Make sure your admin user has profiles.role = 'admin'.

## Contact form
The reusable form is at:
components/public/contact-form.tsx

API:
app/api/contact/route.ts

The API stores submissions in public.contact_submissions.
It does not expose the submissions to public users.


## Integrated placement
The contact form has been inserted into the locale homepage before its closing main section (when the existing homepage structure exposed a <main> element). If your homepage uses a different wrapper, the reusable component remains available at components/public/contact-form.tsx.
