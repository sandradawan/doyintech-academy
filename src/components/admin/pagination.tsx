"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function usePagedItems<T>(items: T[], pageSize: number, page: number) {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;
  const slice = items.slice(start, start + pageSize);
  return { slice, total, totalPages, safePage, start, end: Math.min(start + pageSize, total) };
}

export function PaginationBar({
  page,
  totalPages,
  total,
  pageSize,
  onPageChange,
  className,
}: {
  page: number;
  totalPages: number;
  total: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  className?: string;
}) {
  if (total === 0) return null;
  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  return (
    <div
      className={cn(
        "flex flex-col gap-3 border-t border-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
    >
      <p className="text-xs text-muted">
        Showing <span className="font-semibold text-fg">{start}</span>–
        <span className="font-semibold text-fg">{end}</span> of{" "}
        <span className="font-semibold text-fg">{total}</span>
      </p>
      <div className="flex items-center gap-1">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="inline-flex h-8 items-center gap-1 rounded-md border border-border px-2 text-xs font-medium disabled:opacity-40"
        >
          <ChevronLeft className="size-3.5" /> Prev
        </button>
        <span className="px-2 text-xs tabular-nums text-muted">
          {page} / {totalPages}
        </span>
        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="inline-flex h-8 items-center gap-1 rounded-md border border-border px-2 text-xs font-medium disabled:opacity-40"
        >
          Next <ChevronRight className="size-3.5" />
        </button>
      </div>
    </div>
  );
}
