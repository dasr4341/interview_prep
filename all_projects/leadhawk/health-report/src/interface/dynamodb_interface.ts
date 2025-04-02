import { Timezone } from '../enum/enum.js';

export interface DynamoDB_User {
  user_id: string;
  last_daily_report_runtime?: string;
  last_special_report_runtime?: string;
  last_spo2_sleep_hrv_temp_runtime?: string;
  last_heart_steps_anomalytime?: string;
  last_model_generate_time?: string;
  score?: number;
  score_date?: string;
  time_zone?: Timezone;
  dob?: string;
  fitbit_rate_limit_time?: string | null;
}

export interface DynamoDB_Data_Range {
  data_id: string;
  user_id: string;
  created_at: string;
}
