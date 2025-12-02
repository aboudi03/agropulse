import type { SensorRepository } from "../../domain/repositories/sensor-repository";
import type { SensorReading } from "../../domain/models/sensor-reading";
import type { Device } from "../../domain/models/device";
import { GetLatestReadingUseCase } from "../use-cases/get-latest-reading";
import { GetReadingHistoryUseCase } from "../use-cases/get-reading-history";
import { RequestFreshReadingUseCase } from "../use-cases/request-fresh-reading";
import { GetDevicesUseCase } from "../use-cases/get-devices";

export class SensorService {
  private readonly getLatestReadingUseCase: GetLatestReadingUseCase;
  private readonly getReadingHistoryUseCase: GetReadingHistoryUseCase;
  private readonly requestFreshReadingUseCase: RequestFreshReadingUseCase;
  private readonly getDevicesUseCase: GetDevicesUseCase;

  constructor(repository: SensorRepository) {
    this.getLatestReadingUseCase = new GetLatestReadingUseCase(repository);
    this.getReadingHistoryUseCase = new GetReadingHistoryUseCase(repository);
    this.requestFreshReadingUseCase = new RequestFreshReadingUseCase(repository);
    this.getDevicesUseCase = new GetDevicesUseCase(repository);
  }

  getDevices(): Promise<Device[]> {
    return this.getDevicesUseCase.execute();
  }


  getLatestReading(deviceId: string): Promise<SensorReading | null> {
    return this.getLatestReadingUseCase.execute(deviceId);
  }

  getReadingHistory(deviceId: string): Promise<SensorReading[]> {
    return this.getReadingHistoryUseCase.execute(deviceId);
  }

  requestFreshReading(deviceId: string): Promise<void> {
    return this.requestFreshReadingUseCase.execute(deviceId);
  }
}

