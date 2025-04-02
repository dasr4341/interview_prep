
export interface BarChartDataInterface {
  data: number[],
  label: string,
  color: string
}
export interface BarChartInfoDetailsInterface {
  header: string,
  title: string
}

export interface BarChartInterface {
  chartMaxValue: number;
  barChartLabels: string[];
  barChartData: BarChartDataInterface[];
  infoDetails?: BarChartInfoDetailsInterface | null
}
