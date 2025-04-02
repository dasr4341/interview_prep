import { ChartOptions } from 'chart.js';

export interface LineChartDataSetInterface {
  label: string;
  data: number[];
  backgroundColor: string;
  borderColor: string ;
  borderWidth: number;
  selectedClass?: string;
  key: number;
  toggle: boolean
}

export interface LineChartInterface {
  xAxisLabels: string[];
  datasets: LineChartDataSetInterface[];
  options?: ChartOptions<any>;
  styleClass?: string;
}
