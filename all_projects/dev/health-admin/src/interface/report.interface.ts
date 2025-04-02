export interface Heart {
  isAnomaly?: boolean;
  lowerBound?: number | null;
  maxRange?: number | null;
  minRange?: number | null;
  upperBound?: number | null;
  value?: number | null;
  upperBoundPercentSpace?: number | null;
  lowerBoundPercentSpace?: number | null;
  boundPercentSpace?: number | null;
}

export interface Steps {
  lowerBound?: number | null;
  maxRange?: number | null;
  minRange?: number | null;
  upperBound?: number | null;
  value?: number | null;
  upperBoundPercentSpace?: number | null;
  lowerBoundPercentSpace?: number | null;
  boundPercentSpace?: number | null;
}

export interface Hrv {
  lowerBound?: number | null;
  maxRange?: number | null;
  minRange?: number | null;
  sdAnomaly?: IsAnomaly | null;
  upperBound?: number | null;
  value?: number | null;
  upperBoundPercentSpace?: number | null;
  lowerBoundPercentSpace?: number | null;
  boundPercentSpace?: number | null;
}

export interface Sleep {
  lowerBound?: number | null;
  maxRange?: number | null;
  medicalAnomaly?: boolean;
  minRange?: number | null;
  sdAnomaly?: IsAnomaly | null;
  upperBound?: number | null;
  value?: number | null;
  upperBoundPercentSpace?: number | null;
  lowerBoundPercentSpace?: number | null;
  boundPercentSpace?: number | null;
}

export interface Spo2 {
  lowerBound?: number | null;
  maxRange?: number | null;
  medicalAnomaly?: boolean;
  minRange?: number | null;
  sdAnomaly?: IsAnomaly | null;
  upperBound?: number | null;
  value?: number | null;
  upperBoundPercentSpace?: number | null;
  lowerBoundPercentSpace?: number | null;
  boundPercentSpace?: number | null;
}

export interface Temp {
  lowerBound?: number | null;
  maxRange?: number | null;
  minRange?: number | null;
  sdAnomaly?: IsAnomaly | null;
  upperBound?: number | null;
  value?: number | null;
  upperBoundPercentSpace?: number | null;
  lowerBoundPercentSpace?: number | null;
  boundPercentSpace?: number | null;
}

export interface TimeToFallAsleep {
  lowerBound?: number | null;
  maxRange?: number | null;
  minRange?: number | null;
  upperBound?: number | null;
  value?: number | null;
}

export interface IsAnomaly {
  isAnomaly?: boolean;
}

export interface SimpleDailyReportInterface {
  dataId?: string;
  datePublished?: string;
  eventDate?: string;
  heart?: Heart | null;
  hrv?: Hrv | null;
  name?: string;
  pdfDate?: string;
  reportId?: string;
  reportName?: string;
  reportType?: string;
  score?: number;
  scoreAnomaly?: boolean;
  score_date?: string;
  sleep?: Sleep | null;
  spo2?: Spo2 | null;
  steps?: Steps | null;
  temp?: Temp | null;
  timeToFallAsleep?: TimeToFallAsleep | null;
  timezone?: string;
  userId?: string;
}
export interface RangeSliderInterface {
  sliderIcon?: string;
  warningIcon?: string;
  sliderLabel?: string;
  sliderUnit?: string | null;
  rangeUnit?: string;
  isAnomaly?: boolean;
  lowerBound?: number | null;
  maxRange?: number | null;
  minRange?: number | null;
  upperBound?: number | null;
  value?: number | null;
  upperBoundPercentSpace?: number | null;
  lowerBoundPercentSpace?: number | null;
  boundPercentSpace?: number | null;
}