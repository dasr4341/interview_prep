import { ChartOptions } from 'chart.js';

export interface DoughnutChartDataSetInterface {
  label: string;
  data: string[] | number[] | Date[];
  backgroundColor: string | string[];
  borderColor: string | string[];
  borderWidth?: number;
  id: number;
  dataWithKeys?: any;
}

export interface CustomDoughnutChartInterface {
  xAxisLabels: string[];
  datasets: DoughnutChartDataSetInterface[];
  options: ChartOptions<any>;
  styleClass?: string;
}

export enum FilterStyleEnum {
  style1 = 'STYLE1',
  style2 = 'STYLE2'
}

export interface DoughnutChartFiltersInterface {
  allDoughnutChartDatasets: DoughnutChartDataSetInterface[];
  filterDoughnutChart: (index1: number, index2: number) => void;
  filterSelected: number;
  totalPatient?: number;
  filterStyle?: FilterStyleEnum
  clickedOption?: boolean;
  labelClickable?: boolean;
}
export interface DoughnutDetailsChartFiltersInterface {
  allDoughnutChartDatasets: DoughnutChartDataSetInterface[];
  filterDoughnutChart: (index1: number, index2: number) => void;
  filterSelected: number;
  filterStyle?: FilterStyleEnum,
  templateTitle?: string;
}
