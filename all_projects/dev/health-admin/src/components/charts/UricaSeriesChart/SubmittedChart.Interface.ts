import { SelectBox } from 'interface/SelectBox.interface';

export interface SubmittedChartInterface {
  date: SelectBox[];
  radinessScore: Array<string | null>;
  currentPoint: string;
} 

export interface ChartUtilityInterface {
  ctx: CanvasRenderingContext2D | null;
  chartData: SubmittedChartInterface;
}