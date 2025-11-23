export interface SensorThreshold {
  warning: number;
  critical: number;
}

export interface SensorThresholdConfig {
  soil: SensorThreshold;
  humidity: SensorThreshold;
  temperature: SensorThreshold;
}

