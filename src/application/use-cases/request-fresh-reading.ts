import type { SensorRepository } from "../../domain/repositories/sensor-repository";

export class RequestFreshReadingUseCase {
  constructor(private readonly repository: SensorRepository) {}

  execute(deviceId: string): Promise<void> {
    return this.repository.requestFreshReading(deviceId);
  }
}

