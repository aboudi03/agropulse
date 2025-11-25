import type { SensorReading } from "../models/sensor-reading";
import type { Device } from "../models/device";

export interface SensorRepository {
  getDevices(): Promise<Device[]>;
  getLatestReading(deviceId: string): Promise<SensorReading>;
  getReadingHistory(deviceId: string): Promise<SensorReading[]>;
  requestFreshReading(deviceId: string): Promise<void>;
}

