"use client";

type StatusBadgeProps = {
  status: string;
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const isProtected = status === 'protected' || status === 'monitoring';

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${
        isProtected
          ? 'border-black/10 bg-black text-white'
          : 'border-black/10 bg-white text-black'
      }`}
    >
      <span className={`h-2 w-2 rounded-full ${isProtected ? 'bg-white' : 'bg-black'}`} />
      {status}
    </span>
  );
}
