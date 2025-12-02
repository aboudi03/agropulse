import type { SensorReading } from "../models/sensor-reading";
import type { Device } from "../models/device";

export interface SensorRepository {
  getDevices(): Promise<Device[]>;
  /**
   * Returns the latest reading for a device, or null if no readings exist yet.
   * This can happen when a device is assigned but hasn't sent any sensor data.
   */
  getLatestReading(deviceId: string): Promise<SensorReading | null>;
  getReadingHistory(deviceId: string): Promise<SensorReading[]>;
  requestFreshReading(deviceId: string): Promise<void>;
}

