import type { SensorThresholdConfig } from "../../domain/value-objects/thresholds";

export const DEFAULT_SENSOR_THRESHOLDS: SensorThresholdConfig = {
  soil: {
    warning: 35,
    critical: 25,
  },
  humidity: {
    warning: 35,
    critical: 25,
  },
  temperature: {
    warning: 30,
    critical: 35,
  },
};

