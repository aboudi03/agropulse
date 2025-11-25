
"use client";

import type { Device } from "@/src/domain/models/device";

interface DeviceSelectorProps {
  devices: Device[];
  selectedDeviceId: string;
  onDeviceChange: (deviceId: string) => void;
  isDisabled?: boolean;
}

export const DeviceSelector = ({
  devices,
  selectedDeviceId,
  onDeviceChange,
  isDisabled = false,
}: DeviceSelectorProps) => {
  // Hide selector if no devices available
  if (devices.length === 0) {
    return null;
  }

  // Show selector with single device (still useful to display current device)
  if (devices.length === 1) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-emerald-700">
          Device:
        </span>
        <span className="rounded-xl border border-white/30 bg-white/40 px-4 py-2 text-sm font-medium text-emerald-900 backdrop-blur-md">
          {devices[0].name}
          {devices[0].location && ` (${devices[0].location})`}
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <label
        htmlFor="device-selector"
        className="text-sm font-medium text-emerald-700"
      >
        Device:
      </label>
      <select
        id="device-selector"
        value={selectedDeviceId}
        onChange={(e) => onDeviceChange(e.target.value)}
        disabled={isDisabled}
        className="rounded-xl border border-white/30 bg-white/40 px-4 py-2 text-sm font-medium text-emerald-900 shadow-sm backdrop-blur-md transition-all hover:bg-white/50 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {devices.map((device) => (
          <option key={device.deviceId} value={device.deviceId}>
            {device.name}
            {device.location && ` (${device.location})`}
          </option>
        ))}
      </select>
    </div>
  );
};
