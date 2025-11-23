"use client";

import type { SensorReading } from "../../../domain/models/sensor-reading";
import { formatTimestamp } from "../../../shared/utils/date";

interface HistoryTableProps {
  readings: SensorReading[];
}

import Image from "next/image";

// ... existing imports

export const HistoryTable = ({ readings }: HistoryTableProps) => {
  const safeReadings = readings.filter((r): r is SensorReading => r != null);

  return (
    <div className="rounded-[2rem] bg-white/60 p-8 shadow-lg backdrop-blur-xl border border-white/40">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-zinc-500">History</p>
          <h3 className="text-xl font-bold text-zinc-900">Sensor activity</h3>
        </div>
        <button
          type="button"
          className="rounded-full border border-white/40 bg-white/40 px-6 py-2 text-sm font-semibold text-zinc-700 shadow-sm backdrop-blur-sm transition hover:bg-white/60 hover:text-emerald-700"
        >
          Filter
        </button>
      </div>

      {safeReadings.length === 0 ? (
        <div className="mt-8 rounded-3xl border border-dashed border-zinc-300/50 bg-white/20 px-6 py-12 text-center text-sm text-zinc-500">
          History will appear once the first reading is received.
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full divide-y divide-zinc-200/50 text-sm">
            <thead className="text-left text-xs font-bold uppercase tracking-wider text-zinc-500">
              <tr>
                <th className="py-4 pl-4">Timestamp</th>
                <th className="py-4">
                  <div className="flex items-center gap-2">
                    <Image src="/icons/soil.svg" alt="Soil" width={20} height={20} className="object-contain" />
                    Soil moisture
                  </div>
                </th>
                <th className="py-4">
                  <div className="flex items-center gap-2">
                    <Image src="/icons/humidity.svg" alt="Humidity" width={20} height={20} className="object-contain" />
                    Humidity
                  </div>
                </th>
                <th className="py-4">
                  <div className="flex items-center gap-2">
                    <Image src="/icons/temperature.svg" alt="Temp" width={20} height={20} className="object-contain" />
                    Temperature
                  </div>
                </th>
                <th className="py-4 text-center">Urgent</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-zinc-200/50 text-zinc-700">
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
                  <tr key={reading.id ?? idx} className="transition hover:bg-white/30">
                    <td className="py-4 pl-4 font-medium">{formatTimestamp(reading.timestamp)}</td>
                    <td className="py-4">{soil}</td>
                    <td className="py-4">{hum}</td>
                    <td className="py-4">{temp}</td>
                    <td className="py-4 text-center">
                      {reading.urgent ? (
                        <span className="rounded-full bg-rose-100 px-2 py-1 text-xs font-bold text-rose-700">
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
