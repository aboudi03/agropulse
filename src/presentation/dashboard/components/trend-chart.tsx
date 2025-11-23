"use client";

import type { SensorReading } from "../../../domain/models/sensor-reading";
import { formatTimestamp } from "../../../shared/utils/date";

interface TrendChartProps {
  readings: SensorReading[];
}

export const TrendChart = ({ readings }: TrendChartProps) => {
  const limited = readings.slice(0, 12).reverse();

  if (limited.length === 0) {
    return (
      <div className="rounded-[2rem] bg-white/40 p-8 shadow-lg backdrop-blur-xl border border-white/50">
        <p className="text-sm font-medium text-zinc-500">Temperature trend</p>
        <div className="mt-6 flex h-32 items-center justify-center rounded-2xl bg-white/30 text-sm text-zinc-500">
          No readings yet.
        </div>
      </div>
    );
  }

  // ✅ SAFE: last reading
  const last = limited[limited.length - 1] ?? null;

  const temperatures = limited.map((reading) =>
    typeof reading.temperature === "number" && !Number.isNaN(reading.temperature)
      ? reading.temperature
      : 0
  );

  const maxValue = Math.max(...temperatures, 1);

  return (
    <div className="rounded-[2rem] bg-white/60 p-8 shadow-lg backdrop-blur-xl border border-white/40">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-zinc-500">Temperature trend</p>
          <p className="text-3xl font-bold text-zinc-900">
            {last && typeof last.temperature === "number" && !Number.isNaN(last.temperature)
              ? `${last.temperature.toFixed(1)} degC`
              : "—"}
          </p>
        </div>

        <span className="rounded-full bg-emerald-100/80 px-3 py-1 text-xs font-bold text-emerald-800 backdrop-blur-sm">
          24h
        </span>
      </div>

      <div className="mt-6 h-48 w-full">
        <svg viewBox="0 0 100 40" className="h-full w-full">
          <defs>
            <linearGradient id="tempGradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
            </linearGradient>
          </defs>

          <polyline
            fill="none"
            stroke="#10b981"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={limited
              .map((reading, index) => {
                const temp =
                  typeof reading.temperature === "number" &&
                  !Number.isNaN(reading.temperature)
                    ? reading.temperature
                    : 0;

                const x = (index / Math.max(limited.length - 1, 1)) * 100;
                const y = 40 - (temp / maxValue) * 30;

                return `${x},${y}`;
              })
              .join(" ")}
          />

          <polygon
            fill="url(#tempGradient)"
            points={`${limited
              .map((reading, index) => {
                const temp =
                  typeof reading.temperature === "number" &&
                  !Number.isNaN(reading.temperature)
                    ? reading.temperature
                    : 0;

                const x = (index / Math.max(limited.length - 1, 1)) * 100;
                const y = 40 - (temp / maxValue) * 30;

                return `${x},${y}`;
              })
              .join(" ")} 100,40 0,40`}
          />
        </svg>
      </div>

      <div className="mt-4 grid grid-cols-4 gap-2 text-xs font-medium text-zinc-400">
        {limited.map((reading, idx) => (
          <span key={reading.id ?? idx}>{formatTimestamp(reading.timestamp)}</span>
        ))}
      </div>
    </div>
  );
};
