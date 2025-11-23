"use client";

import type { SensorReading } from "../../../domain/models/sensor-reading";
import { formatTimestamp } from "../../../shared/utils/date";

interface AlertsPanelProps {
  readings: SensorReading[];
}

export const AlertsPanel = ({ readings }: AlertsPanelProps) => {
  // Safe filtering
  const urgent = readings
  .filter((r): r is SensorReading => r != null && r.urgent === true)
  .slice(0, 4)

  return (
    <div className="rounded-[2rem] bg-white/60 p-8 shadow-lg backdrop-blur-xl border border-white/40">
      <div className="flex items-center gap-4">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-lg font-bold text-rose-600 shadow-sm">
          !
        </span>

        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-rose-600">
            Urgent alerts
          </p>
          <p className="text-zinc-700 font-medium">{urgent.length} active</p>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {urgent.length === 0 ? (
          <p className="text-sm text-zinc-500">No urgent alerts right now.</p>
        ) : (
          urgent.map((reading, idx) => {
            const soil =
              reading.soil != null ? `${reading.soil}%` : "Disconnected";

            const hum =
              reading.humidity != null ? `${reading.humidity}%` : "Disconnected";

            const temp =
              typeof reading.temperature === "number" &&
              !Number.isNaN(reading.temperature)
                ? `${reading.temperature.toFixed(1)} degC`
                : "Disconnected";

            return (
              <div
                key={reading.id ?? idx}
                className="flex items-center justify-between rounded-2xl border border-white/40 bg-white/40 px-5 py-4 shadow-sm backdrop-blur-sm transition hover:bg-white/60"
              >
                <div>
                  <p className="text-sm font-bold text-zinc-900">
                    Critical reading at {formatTimestamp(reading.timestamp)}
                  </p>

                  <p className="text-xs font-medium text-rose-600 mt-1">
                    Soil {soil} · Humidity {hum} · Temp {temp}
                  </p>
                </div>

                <span className="rounded-full bg-rose-500/10 px-3 py-1 text-xs font-bold text-rose-600">
                  urgent
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
