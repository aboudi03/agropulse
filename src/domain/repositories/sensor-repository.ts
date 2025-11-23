import type { SensorReading } from "../models/sensor-reading";

export interface SensorRepository {
  getLatestReading(): Promise<SensorReading>;
  getReadingHistory(): Promise<SensorReading[]>;
  requestFreshReading(controller?: string): Promise<void>;
}

