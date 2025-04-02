import { Activity_Units, Anomaly_Type, Source_System, Timezone } from '../enum/enum.js';
import { HRV, Heart, Sleep, Spo2, Steps, Steps_Total, Temp } from './activity_interface.js';

/*
intermediate data interface
*/

export interface Screenshot {
  heart_img_1: string | null;
  steps_img_1: string | null;
  heart_img_2: string | null;
  steps_img_2: string | null;
  heart_img_3: string | null;
  steps_img_3: string | null;
}
export interface SD_Anomaly {
  isAnomaly: boolean;
  isRange: boolean;
  mean: number | null;
  sd: number | null;
  zscore: number | null;
  lowerBound: number | null;
  upperBound: number | null;
}
export interface GMM_Anomaly {
  time: string;
  heart: number;
  steps: number;
}

export interface Tanaka_Anomaly {
  time: string;
  value: number;
}

export interface Stats {
  min: number | null;
  avg: number | null;
  max: number | null;
}

export interface Weekly_Monthly_Fillup_Data {
  heart: {
    heartCurrentDay: {
      time: string;
      value: number | null;
      isGMMAnomaly?: boolean;
      isTanakaAnomaly?: boolean;
    }[];
    reuse_heartCurrentDay?: Heart[];
  };
  steps: {
    stepsCurrentDay: {
      time: string;
      value: number | null;
      isAnomaly?: boolean;
      isTanakaAnomaly?: boolean;
    }[];
    reuse_stepsCurrentDay?: Steps[];
  };
  spo2: { spo27Day: Spo2[] };
  sleep: { sleep7Day: Sleep[] };
  hrv: { hrv7Day: HRV[] };
  temp: { temp7Day: Temp[] };
  heartStepsAnomaly: GMM_Anomaly[] | null;
  tanakaAnomaly: Tanaka_Anomaly[] | null;
  reuse_heartStepsAnomaly?: GMM_Anomaly[] | null;
  reuse_tanakaAnomaly?: Tanaka_Anomaly[] | null;
  startApiDate: string;
  endApiDate: string;
  eventDate: string;
}

/*
args interface
*/

export interface Simple_Daily_Report_Args {
  heart: {
    stats: Stats;
    lowerBound: number | null;
    upperBound: number | null;
    isGMMAnomaly: boolean;
    isTanakaAnomaly: boolean;
  };
  steps: {
    value: number | null;
    lowerBound: number | null;
    upperBound: number | null;
    isSDAnomaly: boolean;
    sdAnomaly: SD_Anomaly;
  };
  spo2: {
    value: number | null;
    lowerBound: number | null;
    upperBound: number | null;
    isMedicalAnomaly: boolean;
    isSDAnomaly: boolean;
    sdAnomaly: SD_Anomaly;
  };
  sleep: {
    value: number | null;
    lowerBound: number | null;
    upperBound: number | null;
    isMedicalAnomaly: boolean;
    isSDAnomaly: boolean;
    sdAnomaly: SD_Anomaly;
  };
  hrv: {
    value: number | null;
    lowerBound: number | null;
    upperBound: number | null;
    isSDAnomaly: boolean;
    sdAnomaly: SD_Anomaly;
  };
  temp: {
    value: number | null;
    lowerBound: number | null;
    upperBound: number | null;
    isSDAnomaly: boolean;
    sdAnomaly: SD_Anomaly;
  };
  scoreAnomaly: boolean;
  id: string;
  userId: string;
  dataId: string;
  name: string;
  timezone: Timezone;
  sourceSystem: Source_System;
  reportType: string;
  reportName: string;
  reportId: string;
  datePublished: string;
  eventDate: string;
  pdfDate: string;
}

export interface Update_Sql_Db_Args {
  id: string;
  user_id: string;
  source_system: Source_System;
  date: string;
  name: string;
  dob: string | null;
  timezone: Timezone;
  heart_data: Heart[];
  steps_data: Steps[];
  spo2_7day_data: Spo2[];
  sleep_7day_data: Sleep[];
  hrv_7day_data: HRV[];
  temp_7day_data: Temp[];
  heart_mean: number | null;
  heart_sd: number | null;
  heart_lower_bound: number | null;
  heart_upper_bound: number | null;
  steps_mean: number | null;
  steps_sd: number | null;
  steps_lower_bound: number | null;
  steps_upper_bound: number | null;
  spo2_sd_anomaly: SD_Anomaly;
  spo2_lower_bound: number | null;
  spo2_upper_bound: number | null;
  sleep_sd_anomaly: SD_Anomaly;
  sleep_lower_bound: number | null;
  sleep_upper_bound: number | null;
  hrv_sd_anomaly: SD_Anomaly;
  hrv_lower_bound: number | null;
  hrv_upper_bound: number | null;
  temp_sd_anomaly: SD_Anomaly;
  temp_lower_bound: number | null;
  temp_upper_bound: number | null;
  simpleDailyReport: Simple_Daily_Report_Data;
  device_name: string;
}

/*
return data interface
*/

export interface Simple_Daily_Report_Data {
  heart: {
    minRange: number;
    maxRange: number;
    lowerBound: number | null;
    upperBound: number | null;
    value: number | null;
    isAnomaly: boolean;
    lowerBoundPercentSpace: number | null;
    upperBoundPercentSpace: number | null;
    boundPercentSpace: number | null;
  };
  steps: {
    minRange: number;
    maxRange: number;
    lowerBound: number | null;
    upperBound: number | null;
    value: number | null;
    raw_value: number;
    sdAnomaly: SD_Anomaly;
    lowerBoundPercentSpace: number | null;
    upperBoundPercentSpace: number | null;
    boundPercentSpace: number | null;
  };
  spo2: {
    minRange: number;
    maxRange: number;
    lowerBound: number | null;
    upperBound: number | null;
    value: number | null;
    medicalAnomaly: boolean;
    sdAnomaly: SD_Anomaly;
    lowerBoundPercentSpace: number | null;
    upperBoundPercentSpace: number | null;
    boundPercentSpace: number | null;
  };
  sleep: {
    minRange: number;
    maxRange: number;
    lowerBound: number | null;
    upperBound: number | null;
    value: number | null;
    medicalAnomaly: boolean;
    sdAnomaly: SD_Anomaly;
    lowerBoundPercentSpace: number | null;
    upperBoundPercentSpace: number | null;
    boundPercentSpace: number | null;
  };
  hrv: {
    minRange: number;
    maxRange: number;
    lowerBound: number | null;
    upperBound: number | null;
    value: number | null;
    sdAnomaly: SD_Anomaly;
    lowerBoundPercentSpace: number | null;
    upperBoundPercentSpace: number | null;
    boundPercentSpace: number | null;
  };
  temp: {
    minRange: number;
    maxRange: number;
    lowerBound: number | null;
    upperBound: number | null;
    value: number | null;
    sdAnomaly: SD_Anomaly;
    lowerBoundPercentSpace: number | null;
    upperBoundPercentSpace: number | null;
    boundPercentSpace: number | null;
  };
  timeToFallAsleep: {
    minRange: number;
    maxRange: number;
    lowerBound: null;
    upperBound: null;
    value: null;
  };
  score: number;
  score_date: string;
  id: string;
  userId: string;
  dataId: string;
  name: string;
  timezone: Timezone;
  sourceSystem: Source_System;
  reportType: string;
  reportName: string;
  reportId: string;
  datePublished: string;
  eventDate: string;
  pdfDate: string;
}

export interface Daily_Report_Data {
  heart: {
    heartCurrentDay: Heart[];
    heartCurrentDayStats: Stats;
    lowerBound: number | null;
    upperBound: number | null;
    mean: number | null;
    sd: number | null;
    reuse_heartCurrentDay: Heart[];
  };
  steps: {
    stepsCurrentDay: Steps[];
    stepsCurrentDayStats: Stats;
    lowerBound: number | null;
    upperBound: number | null;
    mean: number | null;
    sd: number | null;
    reuse_stepsCurrentDay: Steps[];
  };
  stepsTotal: {
    stepsTotal7Day: Steps_Total[];
    stepsTotal7DayStats: Stats;
    lowerBound: number | null;
    upperBound: number | null;
    mean: number | null;
    sd: number | null;
  };
  spo2: {
    spo27Day: Spo2[];
    spo27DayStats: Stats;
    lowerBound: number | null;
    upperBound: number | null;
    mean: number | null;
    sd: number | null;
  };
  sleep: {
    sleep7Day: Sleep[];
    sleep7DayStats: Stats;
    lowerBound: number | null;
    upperBound: number | null;
    mean: number | null;
    sd: number | null;
  };
  hrv: {
    hrv7Day: HRV[];
    hrv7DayStats: Stats;
    lowerBound: number | null;
    upperBound: number | null;
    mean: number | null;
    sd: number | null;
  };
  temp: {
    temp7Day: Temp[];
    temp7DayStats: Stats;
    lowerBound: number | null;
    upperBound: number | null;
    mean: number | null;
    sd: number | null;
  };
  id: string;
  userId: string;
  dataId: string;
  name: string;
  age: number | null;
  timezone: Timezone;
  sourceSystem: Source_System;
  startApiDate: string;
  endApiDate: string;
  heartStepsAnomaly: GMM_Anomaly[] | null;
  tanakaAnomaly: Tanaka_Anomaly[] | null;
  tanakaMaxHr: number | null;
  gmmData: null;
  reportZonedTime: string;
  reportUTCtime: Date;
  apiData: {
    heart: string;
    steps: string;
    sleep: string;
    spo2: string;
    hrv: string;
    temp: string;
    restingHeartRate: string;
  };
  dataURI: string | undefined;
  reportURI: string | undefined;
  reportType: string;
  reportName: string;
  reportId: string;
  datePublished: string;
  eventDate: string;
  pdfDate: string;
  units: {
    heart: Activity_Units.HEART;
    steps: Activity_Units.STEPS;
    spo2: Activity_Units.SPO2;
    sleep: Activity_Units.SLEEP;
    hrv: Activity_Units.HRV;
    temp: Activity_Units.TEMP;
  };
  version: string;
  simpleDailyReport: Simple_Daily_Report_Data | undefined;
  reuse_heartStepsAnomaly: GMM_Anomaly[] | null;
  reuse_tanakaAnomaly: Tanaka_Anomaly[] | null;
  anomalyType: undefined | Anomaly_Type[];
  isTemperatureSupported: {
    value: boolean;
    text: string;
  };
}

export interface Special_Report_Data {
  heart?: {
    heartCurrentDay: Heart[];
    heartCurrentDayStats: Stats;
    lowerBound: number | null;
    upperBound: number | null;
    mean: number | null;
    sd: number | null;
    reuse_heartCurrentDay: Heart[];
  };
  steps?: {
    stepsCurrentDay: Steps[];
    stepsCurrentDayStats: Stats;
    lowerBound: number | null;
    upperBound: number | null;
    mean: number | null;
    sd: number | null;
    reuse_stepsCurrentDay: Steps[];
  };
  spo2?: {
    spo27Day: Spo2[];
    spo27DayStats: Stats;
    lowerBound: number | null;
    upperBound: number | null;
    mean: number | null;
    sd: number | null;
    sdAnomaly: SD_Anomaly;
  };
  sleep?: {
    sleep7Day: Sleep[];
    sleep7DayStats: Stats;
    lowerBound: number | null;
    upperBound: number | null;
    mean: number | null;
    sd: number | null;
    sdAnomaly: SD_Anomaly;
  };
  hrv?: {
    hrv7Day: HRV[];
    hrv7DayStats: Stats;
    lowerBound: number | null;
    upperBound: number | null;
    mean: number | null;
    sd: number | null;
    sdAnomaly: SD_Anomaly;
  };
  temp?: {
    temp7Day: Temp[];
    temp7DayStats: Stats;
    lowerBound: number | null;
    upperBound: number | null;
    mean: number | null;
    sd: number | null;
    sdAnomaly: SD_Anomaly;
  };
  id: string;
  userId: string;
  dataId: string;
  name: string;
  age: number | null;
  timezone: Timezone;
  sourceSystem: Source_System;
  startApiDate: string;
  endApiDate: string;
  heartStepsAnomaly?: GMM_Anomaly[] | null;
  tanakaAnomaly?: Tanaka_Anomaly[] | null;
  tanakaMaxHr?: number | null;
  gmmData?: null;
  reportZonedTime: string;
  reportUTCtime: Date;
  dataURI: string | undefined;
  reportURI: string | undefined;
  reportType: string;
  reportName: string;
  reportId: string;
  datePublished: string;
  eventDate: string;
  pdfDate: string;
  units: {
    heart: Activity_Units.HEART;
    steps: Activity_Units.STEPS;
    spo2: Activity_Units.SPO2;
    sleep: Activity_Units.SLEEP;
    hrv: Activity_Units.HRV;
    temp: Activity_Units.TEMP;
  };
  version: string;
  anomalyText: string;
  score: number;
  score_date: string;
  apiData?: boolean;
  anomalyType: undefined | Anomaly_Type[];
}

export interface Weekly_Report_Data {
  heart: {
    heartCurrentDay: {
      time: string;
      value: number | null;
      isGMMAnomaly: boolean;
      isTanakaAnomaly: boolean;
    }[];
    heartCurrentDayStats: Stats;
  };
  steps: {
    stepsCurrentDay: {
      time: string;
      value: number | null;
      isGMMAnomaly: boolean;
      isTanakaAnomaly: boolean;
    }[];
    stepsCurrentDayStats: Stats;
  };
  spo2: {
    spo27Day: Spo2[];
    spo27DayStats: Stats;
  };
  sleep: {
    sleep7Day: Sleep[];
    sleep7DayStats: Stats;
  };
  hrv: {
    hrv7Day: HRV[];
    hrv7DayStats: Stats;
  };
  temp: {
    temp7Day: Temp[];
    temp7DayStats: Stats;
  };
  heartStepsAnomaly: GMM_Anomaly[] | null;
  tanakaAnomaly: Tanaka_Anomaly[] | null;
  id: string;
  userId: string;
  dataId: string;
  name: string;
  timezone: Timezone;
  sourceSystem: Source_System;
  startApiDate: string;
  endApiDate: string;
  reportZonedTime: string;
  reportUTCtime: Date;
  dataURI: string | undefined;
  reportURI: string | undefined;
  reportType: string;
  reportName: string;
  reportId: string;
  datePublished: string;
  eventDate: string;
  pdfDate: string;
  units: {
    heart: Activity_Units.HEART;
    steps: Activity_Units.STEPS;
    sleep: Activity_Units.SLEEP;
    spo2: Activity_Units.SPO2;
    hrv: Activity_Units.HRV;
    temp: Activity_Units.TEMP;
  };
  version: string;
  anomalyType: undefined | Anomaly_Type[];
  isTemperatureSupported: {
    value: boolean;
    text: string;
  };
}

export interface Monthly_Report_Data {
  heart: {
    heartCurrentDay: {
      time: string;
      value: number | null;
      isGMMAnomaly: boolean;
      isTanakaAnomaly: boolean;
    }[];
    heartCurrentDayStats: Stats;
  };
  steps: {
    stepsCurrentDay: {
      time: string;
      value: number | null;
      isGMMAnomaly: boolean;
      isTanakaAnomaly: boolean;
    }[];
    stepsCurrentDayStats: Stats;
  };
  spo2: {
    spo27Day: Spo2[];
    spo27DayStats: Stats;
  };
  sleep: {
    sleep7Day: Sleep[];
    sleep7DayStats: Stats;
  };
  hrv: {
    hrv7Day: HRV[];
    hrv7DayStats: Stats;
  };
  temp: {
    temp7Day: Temp[];
    temp7DayStats: Stats;
  };
  heartStepsAnomaly: GMM_Anomaly[] | null;
  tanakaAnomaly: Tanaka_Anomaly[] | null;
  id: string;
  userId: string;
  dataId: string;
  name: string;
  timezone: Timezone;
  sourceSystem: Source_System;
  startApiDate: string;
  endApiDate: string;
  reportZonedTime: string;
  reportUTCtime: Date;
  dataURI: string | undefined;
  reportURI: string | undefined;
  reportType: string;
  reportName: string;
  reportId: string;
  datePublished: string;
  eventDate: string;
  pdfDate: string;
  units: {
    heart: Activity_Units.HEART;
    steps: Activity_Units.STEPS;
    sleep: Activity_Units.SLEEP;
    spo2: Activity_Units.SPO2;
    hrv: Activity_Units.HRV;
    temp: Activity_Units.TEMP;
  };
  version: string;
  anomalyType: undefined | Anomaly_Type[];
  isTemperatureSupported: {
    value: boolean;
    text: string;
  };
}
