export type DashboardReading = {
  timestamp: string;
  consumption: number;
  isAnomaly: boolean;
  averageTemperature: number;
  averageHumidity: number;
};
