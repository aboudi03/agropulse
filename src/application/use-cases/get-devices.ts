import type { SensorRepository } from "../../domain/repositories/sensor-repository";
import type { Device } from "../../domain/models/device";

export class GetDevicesUseCase {
  constructor(private readonly repository: SensorRepository) {}

  execute(): Promise<Device[]> {
    return this.repository.getDevices();
  }
}
