import { DEFAULT_SENSOR_THRESHOLDS } from "./sensor-thresholds";
import { evaluateDirectionalStatus } from "../utils/sensor-status";
import type { SensorMetricDefinition } from "../types/sensor-metric";

export const SENSOR_METRICS: SensorMetricDefinition[] = [
  {
    id: "soil",
    label: "Soil Moisture",
    unit: "%",
    direction: "low",
    badge: "SM",
    iconPath: "/icons/soil.svg",
    formatter: (value) => `${value}%`,
    getStatus: (value) =>
      evaluateDirectionalStatus(value, DEFAULT_SENSOR_THRESHOLDS.soil, "low"),
  },
  {
    id: "humidity",
    label: "Air Humidity",
    unit: "%",
    direction: "low",
    badge: "AH",
    iconPath: "/icons/humidity.svg",
    formatter: (value) => `${value}%`,
    getStatus: (value) =>
      evaluateDirectionalStatus(value, DEFAULT_SENSOR_THRESHOLDS.humidity, "low"),
  },
  {
    id: "temperature",
    label: "Temperature",
    unit: "degC",
    direction: "high",
    badge: "TMP",
    iconPath: "/icons/temperature.svg",
    formatter: (value) => `${value.toFixed(1)} degC`,
    getStatus: (value) => {
      if (value < -100) return "critical";
      return evaluateDirectionalStatus(value, DEFAULT_SENSOR_THRESHOLDS.temperature, "high");
    },
  },
];

