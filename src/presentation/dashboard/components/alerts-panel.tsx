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
    <div className="rounded-3xl border border-rose-100 bg-rose-50 p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-100 text-sm font-semibold text-rose-600">
          !
        </span>

        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-rose-600">
            Urgent alerts
          </p>
          <p className="text-zinc-900">{urgent.length} active</p>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {urgent.length === 0 ? (
          <p className="text-sm text-zinc-600">No urgent alerts right now.</p>
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
                className="flex items-center justify-between rounded-2xl border border-rose-100 bg-white/60 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-semibold text-zinc-900">
                    Critical reading at {formatTimestamp(reading.timestamp)}
                  </p>

                  <p className="text-xs text-rose-500">
                    Soil {soil} · Humidity {hum} · Temp {temp}
                  </p>
                </div>

                <span className="rounded-full bg-rose-500/10 px-3 py-1 text-xs font-semibold text-rose-600">
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
