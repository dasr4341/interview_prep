import { TickValueInterface, TimeSeriesData } from "./chart.interfaces";

export interface HeartStepsAnomalyData {
  anomalyTime: string;
  anomalyValue: number;
}

export interface HeartStepsData {
  time: string;
  value: number | null;
}

export interface HeartStepsChartData {
  labels: string[];
  dataSets: Array<number | null>;
}

export interface AppleHeartStepsChartData {
  x: number | null;
  y: number | null;
  label: string;
}

export interface AppleHeartStepsCallbackProp {
  value: number | string;
  indexNumber: number;
  reportType?: string;
  heartData: Array<AppleHeartStepsChartData>;
}

export interface HeartRateChartProps {
  ctx: CanvasRenderingContext2D;
  chartData: HeartStepsChartData;
  anomalyData: TimeSeriesData[];
  tickValue?: TickValueInterface;
  reportType?: string;
  lowerBound?: number | null;
  upperBound?: number | null;
  version?: string;
  heartAverage?: number | null;
}
export interface AppleHeartChartProps {
  ctx: CanvasRenderingContext2D;
  chartData: AppleHeartStepsChartData[];
  anomalyData: TimeSeriesData[];
  reportType?: string;
  lowerBound?: number | null;
  upperBound?: number | null;
  heartAverage?: number | null;
}
export interface HeartStepsCallbackProp {
  callbackArgument: number;
  labelsData: string[];
  typeOfReport?: string;
}
export interface StepsChartProps {
  ctx: CanvasRenderingContext2D,
  chartData: HeartStepsChartData,
  anomalyData: TimeSeriesData[],
  tickValue?: TickValueInterface,
  reportType?: string,
  lowerBound?: number | null,
  upperBound?: number | null,
  version?: string
}