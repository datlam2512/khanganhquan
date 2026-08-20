export default function LocaleLoading() {
  return (
    <div
      role="status"
      aria-label="Đang tải trang"
      className="flex min-h-[60vh] w-full flex-col items-center justify-center gap-4 py-24"
    >
      <span className="relative flex h-11 w-11 items-center justify-center">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#11823b] opacity-20" />
        <span className="relative inline-flex h-8 w-8 animate-spin rounded-full border-[3px] border-[#e3ebe6] border-t-[#11823b]" />
      </span>
      <span className="text-sm font-semibold tracking-wide text-[#66746c]">
        Đang tải...
      </span>
    </div>
  );
}
