import type { SensorStatus } from "../../domain/models/sensor-reading";
import type { SensorThreshold } from "../../domain/value-objects/thresholds";
import type { ThresholdDirection } from "../types/sensor-metric";

export const evaluateDirectionalStatus = (
  value: number,
  thresholds: SensorThreshold,
  direction: ThresholdDirection,
): SensorStatus => {
  const isCritical =
    direction === "low" ? value <= thresholds.critical : value >= thresholds.critical;
  if (isCritical) {
    return "critical";
  }

  const isWarning =
    direction === "low" ? value <= thresholds.warning : value >= thresholds.warning;
  if (isWarning) {
    return "warning";
  }

  return "good";
};

