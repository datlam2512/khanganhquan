import { cn } from "@/lib/utils";
export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn("h-11 w-full rounded-lg border border-[#DCE5DF] bg-white px-3 text-sm outline-none transition focus:border-[#0B9F4A] focus:ring-3 focus:ring-[#0B9F4A]/10", className)} {...props} />;
}
