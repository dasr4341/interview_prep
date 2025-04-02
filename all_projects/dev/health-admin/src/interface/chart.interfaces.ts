import { HeartStepsData } from './heart-steps.interface';
import { SimpleDailyReportInterface } from './report.interface';

export interface TimeSeriesData {
  time: string;
  value: number;
}

export interface ChartSeriesData {
  x: string;
  y: number;
}

export interface Stats {
  max: number;
  avg: number;
  min: number;
}

export interface Heart {
  heartCurrentDay: TimeSeriesData[];
  heartCurrentDayStats: Partial<Stats>;
  heart30DayAverage: number;
  heartChange: string;
  lowerBound: number | null;
  upperBound: number | null;
}

export interface Steps {
  stepsCurrentDay: TimeSeriesData[];
  stepsCurrentDayStats: Partial<Stats>;
  steps7DayAverage: number;
  stepsChange: string;
  totalSteps: number;
  lowerBound: number | null;
  upperBound: number | null;
}

export interface SleepDay {
  dateOfSleep: string;
  minutesAsleep: number;
  isAnomaly: boolean;
}

export interface Sleep {
  sleep30DayAverage: number;
  sleep7DayStats: Partial<Stats>;
  sleepChange: string;
  sleep7Day: SleepDay[];
  lowerBound: number | null;
  upperBound: number | null;
}

export interface Spo2Day {
  dateTime: string;
  value: Partial<Stats>;
  isAnomaly: boolean;
}

export interface Spo2 {
  spo230DayAverage?: number;
  spo27DayStats?: Partial<Stats>;
  spo2Change?: string;
  spo27Day?: Spo2Day[];
  lowerBound: number | null;
  upperBound: number | null;
}

export interface HrvDay {
  value: {
    dailyRmssd: number;
    deepRmssd: number;
  };
  dateTime: string;
  isAnomaly: boolean;
}

export interface Hrv {
  hrv30DayAverage?: number;
  hrv7DayStats?: Partial<Stats>;
  hrvChange?: string;
  hrv7Day?: HrvDay[];
  lowerBound: number | null;
  upperBound: number | null;
}

export interface TempDay {
  dateTime: string;
  value: {
    nightlyRelative: number;
  };
  logType: string;
  isAnomaly: boolean;
}

export interface Temp {
  temp7Day: TempDay[];
  lowerBound: number | null;
  upperBound: number | null;
}

export interface Units {
  heart: string;
  hrv: string;
  sleep: string;
  spo2: string;
  steps: string;
  temp: string;
}

export interface TotalStepsDay {
  dateTime: string | null;
  value: number | null;
  isAnomaly: boolean;
}

export interface StepsTotal {
  lowerBound?: number;
  stepsTotal7Day?: TotalStepsDay[];
  stepsTotal7DayStats?: Partial<Stats>;
  upperBound?: number;
}

export interface ChartData {
  heart?: Partial<Heart>;
  steps?: Partial<Steps>;
  sleep?: Partial<Sleep>;
  spo2?: Partial<Spo2>;
  hrv?: Partial<Hrv>;
  temp?: Partial<Temp>;
  heartStepsAnomaly?: Partial<{
    time: string;
    heart: number;
    steps: number;
  }>[];
  stepsTotal?: Partial<StepsTotal>;
  id: string;
  startApiDate?: string;
  endApiDate?: string;
  unixTime?: number;
  reportType?: string;
  reportName?: string;
  reportId?: string;
  reportDate?: string;
  eventDate?: string;
  datePublished?: string;
  name?: string;
  simpleDailyReport?: SimpleDailyReportInterface | null;
  timezone?: string;
  units?: Units;
  version?: string;
  tanakaAnomaly?: Partial<{
    time: string;
    value: number;
  }>[];
  anomalyText?: string;
  sourceSystem?: string;
  anomalyType?: Array<ChartNames>;
  isTemperatureSupported?: TemperatureSupported;
}

export interface TemperatureSupported {
  value: boolean;
  text: string;
}

export interface HealthData {
  pretaaHealthRetriveEventRawData: null | ChartData;
}

export interface ChartPropsData {
  chartData: HeartStepsData[];
  anomalyData: TimeSeriesData[];
  startApiDate?: string;
  endApiDate?: string;
  reportType?: string;
  lowerBound?: number | null;
  upperBound?: number | null;
  version?: string;
  sourceSystem?: string;
  heartAverage?: number | null;
}

export interface TickValueInterface {
  take: number;
  skip: number;
}

export interface Spo2ChartData {
  spo2Labels: string[];
  spo2DataSets: Array<number | null>;
  isAnomaly: boolean[];
}

export interface Spo2ChartDataProps {
  data: Spo2ChartData;
  lowerBound?: number | null;
  upperBound?: number | null;
  spo2Average: number | null;
}

export interface Spo2ChartUtilityProps {
  ctx: CanvasRenderingContext2D;
  chartData: Spo2ChartDataProps | null;
}

export interface TotalStepsChartData {
  totalStepsLabels: string[];
  totalStepsDataSets: Array<number | null>;
  isAnomaly: Array<boolean>;
}
export interface TotalStepsChartProps {
  data: TotalStepsChartData;
  lowerBound?: number | null;
  upperBound?: number | null;
  totalStepsAverage: number | null;
}
export interface TotalStepsChartUtilityProps {
  ctx: CanvasRenderingContext2D; 
  chartData: TotalStepsChartProps | null;
}

export enum ReportTypes {
  DailyReport = 'dailyReport',
  SpecialReport = 'specialReport',
  WeeklyReport = 'weeklyReport',
  MonthlyReport = 'monthlyReport'
}

export enum ChartNames {
  heart = 'heart',
  steps = 'steps',
  sleep = 'sleep',
  spo2 = 'spo2',
  hrv = 'hrv',
  temp = 'temp',
  totalSteps = 'totalSteps'
}

export enum SourceSystmHealthData {
  FITBIT = 'FITBIT',
  APPLEWATCH = 'APPLEWATCH',
}
