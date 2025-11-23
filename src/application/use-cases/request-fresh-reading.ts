import type { SensorRepository } from "../../domain/repositories/sensor-repository";

export class RequestFreshReadingUseCase {
  constructor(private readonly repository: SensorRepository) {}

  execute(controller?: string): Promise<void> {
    return this.repository.requestFreshReading(controller);
  }
}

