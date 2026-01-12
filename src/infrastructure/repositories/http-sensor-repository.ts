import type { SensorRepository } from "../../domain/repositories/sensor-repository";
import type { SensorReading } from "../../domain/models/sensor-reading";
import type { Device } from "../../domain/models/device";
import type { SensorReadingDto } from "../../application/dtos/sensor-reading-dto";
import type { DeviceDto } from "../../application/dtos/device-dto";
import { httpClient } from "../http/http-client";
import { toSensorReading } from "../mappers/sensor-mapper";
import { toDevice } from "../mappers/device-mapper";

export class HttpSensorRepository implements SensorRepository {
  async getDevices(): Promise<Device[]> {
    const dtos = await httpClient<DeviceDto[]>({
      path: "/api/device",
      cache: "no-store",
    });

    return dtos.map(toDevice);
  }

  async getLatestReading(deviceId: string): Promise<SensorReading | null> {
    try {
      const dto = await httpClient<SensorReadingDto>({
        path: `/api/sensor/${deviceId}/latest`,
        cache: "no-store",
      });

      return toSensorReading(dto);
    } catch (error) {
      // Handle 404 - device exists but has no readings yet
      if (error instanceof Error && error.message.includes('404')) {
        return null;
      }
      throw error;
    }
  }

  async getReadingHistory(deviceId: string): Promise<SensorReading[]> {
    try {
      const dtos = await httpClient<SensorReadingDto[]>({
        path: `/api/sensor/${deviceId}/all`,
        cache: "no-store",
      });

      return dtos.map(toSensorReading);
    } catch (error) {
      // Handle 404 - device exists but has no readings yet
      if (error instanceof Error && error.message.includes('404')) {
        return [];
      }
      throw error;
    }
  }

  async requestFreshReading(deviceId: string): Promise<void> {
    // Hit backend trigger endpoint
    await httpClient({
      path: `/api/device/${deviceId}/trigger`,
      method: "POST",
    });
  }
}
