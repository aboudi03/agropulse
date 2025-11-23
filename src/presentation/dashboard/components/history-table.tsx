"use client";

import type { SensorReading } from "../../../domain/models/sensor-reading";
import { formatTimestamp } from "../../../shared/utils/date";

interface HistoryTableProps {
  readings: SensorReading[];
}

export const HistoryTable = ({ readings }: HistoryTableProps) => {
  const safeReadings = readings.filter((r): r is SensorReading => r != null);

  return (
    <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-zinc-500">History</p>
          <h3 className="text-xl font-semibold text-zinc-900">Sensor activity</h3>
        </div>
        <button
          type="button"
          className="rounded-full border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 hover:border-emerald-300 hover:text-emerald-600"
        >
          Filter
        </button>
      </div>

      {safeReadings.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-zinc-200 bg-zinc-50 px-6 py-12 text-center text-sm text-zinc-500">
          History will appear once the first reading is received.
        </div>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full divide-y divide-zinc-100 text-sm">
            <thead className="text-left text-xs uppercase text-zinc-500">
              <tr>
                <th className="py-3">Timestamp</th>
                <th className="py-3">Soil moisture</th>
                <th className="py-3">Humidity</th>
                <th className="py-3">Temperature</th>
                <th className="py-3 text-center">Urgent</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-zinc-100 text-zinc-700">
              {safeReadings.slice(0, 6).map((reading, idx) => {
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
                  <tr key={reading.id ?? idx}>
                    <td className="py-3">{formatTimestamp(reading.timestamp)}</td>
                    <td className="py-3">{soil}</td>
                    <td className="py-3">{hum}</td>
                    <td className="py-3">{temp}</td>
                    <td className="py-3 text-center">
                      {reading.urgent ? (
                        <span className="rounded-full bg-rose-100 px-2 py-1 text-xs font-semibold text-rose-700">
                          urgent
                        </span>
                      ) : (
                        <span className="text-xs text-zinc-400">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
