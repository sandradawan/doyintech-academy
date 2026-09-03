"use client";

import { cn } from "@/lib/utils";

export function LiveBadge({
  live,
  lastSync,
  className,
}: {
  live: boolean;
  lastSync?: Date | null;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-[11px] font-medium",
        live
          ? "border-success/30 bg-success/10 text-success"
          : "border-border bg-surface-2 text-muted",
        className,
      )}
      title={lastSync ? `Last sync ${lastSync.toLocaleTimeString()}` : undefined}
    >
      <span
        className={cn(
          "size-1.5 rounded-full",
          live ? "animate-pulse bg-success" : "bg-muted",
        )}
      />
      {live ? "Live" : "Offline"}
      {lastSync ? (
        <span className="hidden font-normal text-subtle sm:inline">
          · {lastSync.toLocaleTimeString()}
        </span>
      ) : null}
    </div>
  );
}
