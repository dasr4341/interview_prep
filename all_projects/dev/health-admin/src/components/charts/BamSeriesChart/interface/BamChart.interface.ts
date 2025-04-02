import { SelectBox } from 'interface/SelectBox.interface';

export interface ChartDataInterface {
  allData: ChartDataSetInterface[];
  filteredData: ChartDataSetInterface[];
  labels: SelectBox[]
  leftAxis: {
    max: number;
    min: number;
  },
  rightAxis: {
    max: number;
    min: number;
  }
}


export interface ChartPayloadDataInterface {
  data: ChartDataSetInterface[];
  labels: SelectBox[]
  leftAxis: {
    max: number;
    min: number;
  },
  rightAxis: {
    max: number;
    min: number;
  }
}

export interface ChartDataSetInterface {
  label: string | null;
  data: Array<string | number | null>;
  borderColor: string;
  backgroundColor?: string;
  order: number;
  type?: string;
  borderDash?: number[];
  borderWidth?: number;
  maxBarThickness?: number;
  yAxisID: string
}
