import type { SensorReading } from "../../../domain/models/sensor-reading";
import { SensorService } from "../../../application/services/sensor-service";

export interface DashboardState {
  latestReading: SensorReading | null;
  history: SensorReading[];
  isLoading: boolean;
  isRequesting: boolean;
  error?: string;
}

export class DashboardViewModel {
  constructor(private readonly sensorService: SensorService) {}

  async loadInitialState(): Promise<DashboardState> {
    const [latestReading, history] = await Promise.all([
      this.sensorService.getLatestReading(),
      this.sensorService.getReadingHistory(),
    ]);

    return {
      latestReading,
      history,
      isLoading: false,
      isRequesting: false,
    };
  }

  async refreshReading(): Promise<SensorReading> {
    return this.sensorService.getLatestReading();
  }

  async requestFreshReading(controller?: string): Promise<void> {
    return this.sensorService.requestFreshReading(controller);
  }

  async reloadHistory(): Promise<SensorReading[]> {
    return this.sensorService.getReadingHistory();
  }
}

