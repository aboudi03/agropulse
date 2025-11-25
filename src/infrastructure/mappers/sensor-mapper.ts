import type { SensorReadingDto } from "@/src/application/dtos/sensor-reading-dto";
import type { SensorReading } from "@/src/domain/models/sensor-reading";

export function toSensorReading(dto: SensorReadingDto): SensorReading {
  return {
    id: dto.id,
    deviceId: dto.deviceId,
    soil: dto.soil ?? null,
    humidity: dto.humidity ?? null,
    temperature: dto.temperature ?? null,
    urgent: (dto.temperature != null && dto.temperature < -100) || (dto.urgent ?? false),
    timestamp: dto.timestamp,
  };
}
