export interface SensorReadingDto {
  id: number;
  deviceId: string;
  soil: number;
  humidity: number;
  temperature: number;
  urgent: boolean;
  timestamp: string;
}
