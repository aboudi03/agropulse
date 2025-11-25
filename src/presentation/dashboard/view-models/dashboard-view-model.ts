import type { SensorReading } from "../../../domain/models/sensor-reading";
import type { Device } from "../../../domain/models/device";
import { SensorService } from "../../../application/services/sensor-service";

export interface DashboardState {
  latestReading: SensorReading | null;
  history: SensorReading[];
  isLoading: boolean;
  isRequesting: boolean;
  error?: string;
}

export class DashboardViewModel {
  private deviceId: string;

  constructor(
    private readonly sensorService: SensorService,
    initialDeviceId: string
  ) {
    this.deviceId = initialDeviceId;
  }

  async loadDevices(): Promise<Device[]> {
    return this.sensorService.getDevices();
  }

  setDeviceId(deviceId: string): void {
    this.deviceId = deviceId;
  }

  getDeviceId(): string {
    return this.deviceId;
  }

  async loadInitialState(): Promise<DashboardState> {
    const [latestReading, history] = await Promise.all([
      this.sensorService.getLatestReading(this.deviceId),
      this.sensorService.getReadingHistory(this.deviceId),
    ]);

    return {
      latestReading,
      history,
      isLoading: false,
      isRequesting: false,
    };
  }

  async refreshReading(): Promise<SensorReading> {
    return this.sensorService.getLatestReading(this.deviceId);
  }

  async requestFreshReading(): Promise<void> {
    return this.sensorService.requestFreshReading(this.deviceId);
  }

  async reloadHistory(): Promise<SensorReading[]> {
    return this.sensorService.getReadingHistory(this.deviceId);
  }
}

