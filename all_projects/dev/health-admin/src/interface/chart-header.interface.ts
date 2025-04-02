export interface TimePeriod {
  firstLabelTime: string;
  lastLabelTime: string;
}

export interface ChartFooterData {
  reportType?: string;
  chartName?: string;
  legend?: boolean;
  eventDate?: string;
  timePeriod?: TimePeriod;
  timeZone?: string;
}