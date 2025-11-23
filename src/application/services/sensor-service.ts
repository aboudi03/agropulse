import type { SensorRepository } from "../../domain/repositories/sensor-repository";
import type { SensorReading } from "../../domain/models/sensor-reading";
import { GetLatestReadingUseCase } from "../use-cases/get-latest-reading";
import { GetReadingHistoryUseCase } from "../use-cases/get-reading-history";
import { RequestFreshReadingUseCase } from "../use-cases/request-fresh-reading";

export class SensorService {
  private readonly getLatestReadingUseCase: GetLatestReadingUseCase;
  private readonly getReadingHistoryUseCase: GetReadingHistoryUseCase;
  private readonly requestFreshReadingUseCase: RequestFreshReadingUseCase;

  constructor(repository: SensorRepository) {
    this.getLatestReadingUseCase = new GetLatestReadingUseCase(repository);
    this.getReadingHistoryUseCase = new GetReadingHistoryUseCase(repository);
    this.requestFreshReadingUseCase = new RequestFreshReadingUseCase(repository);
  }

  getLatestReading(): Promise<SensorReading> {
    return this.getLatestReadingUseCase.execute();
  }

  getReadingHistory(): Promise<SensorReading[]> {
    return this.getReadingHistoryUseCase.execute();
  }

  requestFreshReading(controller?: string): Promise<void> {
    return this.requestFreshReadingUseCase.execute(controller);
  }
}

