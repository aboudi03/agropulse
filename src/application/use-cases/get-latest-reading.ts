import type { SensorRepository } from "../../domain/repositories/sensor-repository";
import type { SensorReading } from "../../domain/models/sensor-reading";

export class GetLatestReadingUseCase {
  constructor(private readonly repository: SensorRepository) {}

  execute(): Promise<SensorReading> {
    return this.repository.getLatestReading();
  }
}

