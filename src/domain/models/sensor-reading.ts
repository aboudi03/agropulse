export interface SensorReading {
  id: number | null;
  soil: number | null;
  humidity: number | null;
  temperature: number | null;
  urgent?: boolean;  
  timestamp: string;
}
