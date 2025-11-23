"use client";

import type { SensorMetricDefinition } from "../../../shared/types/sensor-metric";
import type { SensorStatus } from "../../../shared/types/sensor-status.ts";

const STATUS_STYLES: Record<
  SensorStatus,
  { bg: string; text: string; indicator: string }
> = {
  good: {
    bg: "bg-emerald-50 border-emerald-200",
    text: "text-emerald-900",
    indicator: "bg-emerald-500",
  },
  warning: {
    bg: "bg-amber-50 border-amber-200",
    text: "text-amber-900",
    indicator: "bg-amber-500",
  },
  critical: {
    bg: "bg-rose-50 border-rose-200",
    text: "text-rose-900",
    indicator: "bg-rose-500 animate-pulse",
  },
};

interface MetricCardProps {
  metric: SensorMetricDefinition;
  value?: number | null;
  status: SensorStatus;
}

export const MetricCard = ({ metric, value, status }: MetricCardProps) => {
  const style = STATUS_STYLES[status];
  return (
    <article
      className={`flex flex-col gap-3 rounded-2xl border p-4 shadow-sm transition hover:shadow ${style.bg}`}
    >
      <div className="flex items-center justify-between text-sm text-zinc-500">
        <span className="flex items-center gap-2 font-medium text-zinc-900">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-900/5 text-xs font-semibold text-zinc-700">
            {metric.badge}
          </span>
          {metric.label}
        </span>
        <span
          className={`flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${style.text}`}
        >
          <span className={`h-2 w-2 rounded-full ${style.indicator}`} />
          {status}
        </span>
      </div>
      <p className="text-4xl font-semibold text-zinc-900">
        {value === undefined || value === null || Number.isNaN(value) ? (
          <span className="text-lg font-semibold text-zinc-500">Disconnected</span>
        ) : metric.formatter ? (
          metric.formatter(value)
        ) : (
          `${value.toFixed(1)}${metric.unit}`
        )}
      </p>
    </article>
  );
};

