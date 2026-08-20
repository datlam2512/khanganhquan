import { requireAdmin } from "@/lib/admin";
import { AdminShell } from "@/components/admin/admin-shell";

// Admin pages always read the session cookie, so they can never be static.
// Declaring this explicitly stops Next.js from attempting (and bailing out
// of) static generation for every admin route during `next build`.
export const dynamic = "force-dynamic";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();
  return <AdminShell>{children}</AdminShell>;
}
