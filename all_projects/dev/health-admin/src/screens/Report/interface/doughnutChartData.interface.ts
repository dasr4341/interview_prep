export interface ChartDataInterface {
  background: string;
  key: number;
  flag: 'on' | 'off';
  label: string;
  value: number;
  code?: string;
}


export interface DoughnutChartInfoDetailsInterface {
  header: string,
  title: string
}
export interface DoughnutChartDataInterface {
  chartData: ChartDataInterface[];
  anomalyBreakdown: number;
  totalPatient?: number;
  templateName?: string;
  code?: string[];
  infoDetails?: DoughnutChartInfoDetailsInterface | null
}