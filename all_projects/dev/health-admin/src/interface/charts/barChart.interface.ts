export interface BarChartDataSetInterface {
  label: string;
  data: string[] | number[] | Date[];
  backgroundColor : string;
  borderColor : string;
  borderWidth?: number;
  key: number,
  toggle?: string;
  selectedClass?:string;
}

export interface BarChartInterface {
  xAxisLabels: string[];
  datasets: BarChartDataSetInterface[];
  options?: any;
}

export interface BarChartFiltersInterface{
  allBarChartDatasets:BarChartDataSetInterface[];
}