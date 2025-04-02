export interface Heart {
  time: string;
  value: number | null;
}

export interface Steps {
  time: string;
  value: number | null;
}

export interface Steps_Total {
  dateTime: string;
  value: number | null;
  isAnomaly?: boolean;
}

export interface Spo2 {
  dateTime: string;
  value: {
    min: number | null;
    avg: number | null;
    max: number | null;
  };
  isAnomaly?: boolean;
}

export interface Sleep {
  dateOfSleep: string;
  minutesAsleep: number | null;
  isAnomaly?: boolean;
}

export interface HRV {
  dateTime: string;
  value: {
    dailyRmssd: number | null;
  };
  isAnomaly?: boolean;
}

export interface Temp {
  dateTime: string;
  value: {
    nightlyRelative: number | null;
  };
  isAnomaly?: boolean;
}
