export interface HealthData {
  id: string;
  deviceName: string;
  deviceModel: string;
  deviceSystemVersion: number;
  deviceSystemName: string;
  deviceBatteryLevel: number;
  userTimezone: string;
  flagDate: number;
  lat: number;
  long: number;
  name: string;
  heart: Heart[];
  steps: Steps[];
  sleep: Sleep[];
  oxygenSaturation: Spo2[];
  hrv: Hrv[];
  ecg: Ecg[];
  restingHeartRate: RestingHeartRate[];
  respiratoryRate: RespiratoryRate[];
  basalEnergyBurned: BasalEnergyBurned[];
  walkingHeartRateAverage: WalkingHeartRateAverage[];
  walkRunDistance: WalkRunDistance[];
  cyclingDistance: CyclingDistance[];
  appleExerciseTime: AppleExerciseTime[];
  appleStandTime: AppleStandTime[];
  activeEnergyBurned: ActiveEnergyBurned[];
  flightsClimbed: FlightsClimbed[];
}

export interface Heart {
  data: number;
  endDate: string;
  startDate: string;
}

export interface Steps {
  data: number;
  endDate: string;
  startDate: string;
}

export interface Hrv {
  data: number;
  endDate: string;
  startDate: string;
}

export interface Spo2 {
  data: number;
  endDate: string;
  startDate: string;
}

export interface Sleep {
  sleepValue: number;
  endDate: string;
  startDate: string;
}

export interface SleepLevels {
  inBed: 0;
  asleepUnspecified: 1;
  awake: 2;
  asleepCore: 3;
  asleepDeep: 4;
  asleepREM: 5;
}

export interface Ecg {
  ecgStartDate: Date;
  ecgEndDate: Date;
  ecgAvgHeartRate: string;
  ecgClassification: string;
  ecgSamplingFrequency: string;
  uuid: string;
  measurements: { time: number; volt: number }[];
}

export interface BasalEnergyBurned {
  data: number;
  endDate: string;
  startDate: string;
}

export interface AppleExerciseTime {
  data: number;
  endDate: string;
  startDate: string;
}

export interface WalkingHeartRateAverage {
  data: number;
  endDate: string;
  startDate: string;
}

export interface WalkRunDistance {
  data: number;
  endDate: string;
  startDate: string;
}

export interface RestingHeartRate {
  data: number;
  endDate: string;
  startDate: string;
}

export interface RespiratoryRate {
  data: number;
  endDate: string;
  startDate: string;
}

export interface CyclingDistance {
  data: number;
  endDate: string;
  startDate: string;
}

export interface AppleStandTime {
  data: number;
  endDate: string;
  startDate: string;
}

export interface ActiveEnergyBurned {
  data: number;
  endDate: string;
  startDate: string;
}

export interface FlightsClimbed {
  data: number;
  endDate: string;
  startDate: string;
}
