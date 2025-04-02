
export interface SurveyDetailsChartInterface {
  ctx: CanvasRenderingContext2D | null;
}

export interface ChartData {
  data: number[];
  label: string;
}
export interface ChartDataInterface extends ChartData {
  borderColor?: string;
  type?: string;
  borderDash?: number[];
  borderDashOffset?: number;
  backgroundColor?: string;
  yAxisID: string,
  datalabels?: {
    [key: string]: string | number | boolean | undefined  | {
      [key: string] : string | number
    }
  }
}
export interface ChartLabelDataInterface {
  label: string,
  value: string
}

export interface ChartDataPayload {
  data: ChartDataInterface[];
  leftAxis: {
    max: number;
    min: number;
    steps?:number | null
  };
  rightAxis: {
    max: number;
    min: number;
    steps?: number | null
  };
}
