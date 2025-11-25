import type { DeviceDto } from "@/src/application/dtos/device-dto";
import type { Device } from "@/src/domain/models/device";

export function toDevice(dto: DeviceDto): Device {
  return {
    deviceId: dto.deviceId,
    name: dto.name || dto.deviceId,
    location: dto.location,
  };
}
