export interface SensorReadingDto {
  id: number;
  soil: number;
  humidity: number;
  temperature: number;
  urgent: boolean;
  timestamp: string;
}
