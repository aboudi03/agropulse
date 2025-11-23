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

import Image from "next/image";

// ... imports

export const MetricCard = ({ metric, value, status }: MetricCardProps) => {
  const style = STATUS_STYLES[status];
  
  return (
    <article className="group relative flex flex-col justify-between overflow-hidden rounded-[2rem] bg-white/60 p-6 shadow-lg backdrop-blur-xl transition-all hover:bg-white/70 hover:shadow-xl border border-white/40">
      <div className="flex items-center justify-between">
        <div className="flex h-12 w-12 items-center justify-center overflow-hidden">
          {metric.iconPath ? (
            <Image 
              src={metric.iconPath} 
              alt={metric.label} 
              width={48} 
              height={48} 
              className="object-contain drop-shadow-sm"
            />
          ) : (
            <span className="text-xs font-bold text-zinc-700">{metric.badge}</span>
          )}
        </div>
        <div className={`h-3 w-3 rounded-full shadow-sm ${style.indicator}`} />
      </div>

      <div className="mt-6">
        <h3 className="text-sm font-medium text-zinc-600">{metric.label}</h3>
        <p className="mt-1 text-3xl font-bold tracking-tight text-zinc-900">
          {value === undefined || value === null || Number.isNaN(value) ? (
            <span className="text-xl text-zinc-400">--</span>
          ) : metric.formatter ? (
            metric.formatter(value)
          ) : (
            `${value.toFixed(1)}${metric.unit}`
          )}
        </p>
      </div>
    </article>
  );
};

