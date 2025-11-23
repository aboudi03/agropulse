import type { SensorRepository } from "../../domain/repositories/sensor-repository";
import type { SensorReading } from "../../domain/models/sensor-reading";
import type { SensorReadingDto } from "../../application/dtos/sensor-reading-dto";
import { httpClient } from "../http/http-client";
import { toSensorReading } from "../mappers/sensor-mapper";

export class HttpSensorRepository implements SensorRepository {
  async getLatestReading(): Promise<SensorReading> {
    const dto = await httpClient<SensorReadingDto>({
      path: "/api/sensor/latest",
      cache: "no-store",
    });

    return toSensorReading(dto);
  }

  async getReadingHistory(): Promise<SensorReading[]> {
    const dtos = await httpClient<SensorReadingDto[]>({
      path: "/api/sensor/all",
      cache: "no-store",
    });

    return dtos.map(toSensorReading);
  }

  async requestFreshReading(controller?: string): Promise<void> {
    // Hit backend trigger endpoint
    await httpClient({
      path: "/api/sensor/trigger",
      method: "POST",
      body: controller ? JSON.stringify({ controller }) : undefined,
    });
  }
}
