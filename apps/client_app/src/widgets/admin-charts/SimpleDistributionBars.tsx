'use client';

import { cn } from '@/shared/lib/cn';

export type DistributionRow = {
  label: string;
  value: number;
  barClass?: string;
};

const DEFAULT_BAR_CLASSES = [
  'bg-indigo-500',
  'bg-violet-500',
  'bg-sky-500',
  'bg-emerald-500',
  'bg-amber-500',
  'bg-rose-500',
];

type Props = {
  title: string;
  rows: DistributionRow[];
  className?: string;
};

export function SimpleDistributionBars({ title, rows, className }: Props) {
  const max = Math.max(1, ...rows.map((r) => r.value));

  return (
    <div className={cn('rounded-xl border border-border/80 bg-card p-4 shadow-sm', className)}>
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </h3>
      <div className="space-y-3">
        {rows.map((row, i) => (
          <div key={row.label} className="space-y-1.5">
            <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
              <span className="truncate font-medium text-foreground">{row.label}</span>
              <span className="shrink-0 font-mono tabular-nums text-foreground">{row.value}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <div
                className={cn(
                  'h-full rounded-full transition-[width] duration-700 ease-out',
                  row.barClass ?? DEFAULT_BAR_CLASSES[i % DEFAULT_BAR_CLASSES.length],
                )}
                style={{ width: `${(row.value / max) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
