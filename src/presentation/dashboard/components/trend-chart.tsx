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
      <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-zinc-500">Temperature trend</p>
        <div className="mt-6 flex h-32 items-center justify-center rounded-2xl bg-zinc-50 text-sm text-zinc-500">
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
    <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-zinc-500">Temperature trend</p>
          <p className="text-2xl font-semibold text-zinc-900">
            {last && typeof last.temperature === "number" && !Number.isNaN(last.temperature)
              ? `${last.temperature.toFixed(1)} degC`
              : "—"}
          </p>
        </div>

        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-900">
          24h
        </span>
      </div>

      <div className="mt-4 h-40 w-full">
        <svg viewBox="0 0 100 40" className="h-full w-full">
          <defs>
            <linearGradient id="tempGradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#34d399" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#34d399" stopOpacity="0.05" />
            </linearGradient>
          </defs>

          <polyline
            fill="none"
            stroke="#10b981"
            strokeWidth="2"
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

      <div className="mt-4 grid grid-cols-4 gap-2 text-xs text-zinc-500">
        {limited.map((reading, idx) => (
          <span key={reading.id ?? idx}>{formatTimestamp(reading.timestamp)}</span>
        ))}
      </div>
    </div>
  );
};
