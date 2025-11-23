import type { SensorStatus } from "./sensor-status.ts";

export type ThresholdDirection = "high" | "low";

export interface SensorMetricDefinition {
  id: "soil" | "humidity" | "temperature";   // FIXED
  label: string;
  unit: string;
  direction: ThresholdDirection;
  badge: string;
  formatter?: (value: number) => string;
  getStatus: (value: number) => SensorStatus;
}
