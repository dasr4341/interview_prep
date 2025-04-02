import dotenv from 'dotenv';

import { Sentry_Env, Source_System } from '../enum/enum.js';
import { get_secrets } from '../utils/secrets_manager_util.js';

dotenv.config();

const lambda_secrets = await get_secrets(process.env.LAMBDA_SECRET_NAME ?? '', process.env.AWS_DEFAULT_REGION ?? '');

export const config = {
  version: '10.6.15',
  dev_mode: process.env.DEV_MODE ?? 0,
  users: process.env.PATIENT ?? '',

  source_system: {
    fitbit: {
      name: Source_System.FITBIT,
      base_url: lambda_secrets?.FITBIT_BASE_URL ?? '',
    },
    applewatch: {
      name: Source_System.APPLEWATCH,
      base_url: lambda_secrets?.APPLEWATCH_BASE_URL ?? '',
    },
  },

  db: {
    postgresql: { base_url: lambda_secrets?.DATABASE_URL ?? '' },
  },

  report: {
    daily_report: {
      name: 'Wellness Report',
      type: 'dailyReport',
      sqs_name: 'patient_report',
      tag_name: 'daily_report',
    },
    special_report: {
      name: 'Special Report',
      type: 'specialReport',
      sqs_name: 'anomaly_report',
      tag_name: 'anomaly_report',
    },
    weekly_report: {
      name: 'Weekly Report',
      type: 'weeklyReport',
      sqs_name: 'weekly_report',
      tag_name: 'weekly_report',
    },
    monthly_report: {
      name: 'Monthly Report',
      type: 'monthlyReport',
      sqs_name: 'monthly_report',
      tag_name: 'monthly_report',
    },
    simple_daily_report: {
      name: 'Daily Report',
      type: 'simpleDailyReport',
      sqs_name: 'simple_daily_report',
      tag_name: 'simple_daily_report',
    },
  },

  aws: {
    access_key_id: process.env.AWS_ACCESS_KEY_ID ?? '',
    secret_access_key: process.env.AWS_SECRET_ACCESS_KEY ?? '',
    default_region: process.env.AWS_DEFAULT_REGION ?? '',
    sqs: {
      set_url: lambda_secrets?.AWS_SQS_SET_URL ?? '',
      fetch_url_daily_report: lambda_secrets?.AWS_SQS_FETCH_URL_DAILY_REPORT ?? '',
      dead_letter: lambda_secrets?.AWS_SQS_DEAD_LETTER_URL ?? '',
    },
    s3: {
      report_bucket: lambda_secrets?.AWS_S3_REPORT_BUCKET ?? '',
      data_bucket: lambda_secrets?.AWS_S3_DATA_BUCKET ?? '',
    },
    dynamodb: {
      report_table: lambda_secrets?.AWS_DYNAMODB_REPORT_TABLE ?? '',
      data_table: lambda_secrets?.AWS_DYNAMODB_DATA_TABLE ?? '',
      model_table: lambda_secrets?.AWS_DYNAMODB_MODEL_TABLE ?? '',
    },
    sns: {
      arn: lambda_secrets?.AWS_SNS_ARN ?? '',
    },
  },

  heart: {
    heart_level: 40,
    heart_max_zscore: 3,
    heart_min_zscore: -3,
    points: 480,
    active_points: 240,
    inactive_points: 240,
  },

  steps: {
    steps_zscore: 0,
  },

  steps_total: {
    steps_total_max_zscore: 4,
    steps_total_min_zscore: -4,
    steps_total_zscore: 4,
  },

  spo2: {
    spo2_level: 92,
    spo2_max_zscore: 4,
    spo2_min_zscore: -4,
    spo2_zscore: 4,
  },

  sleep: {
    sleep_level: 180,
    sleep_max_zscore: 4,
    sleep_min_zscore: -4,
    sleep_zscore: 4,
  },

  hrv: {
    hrv_max_zscore: 4,
    hrv_min_zscore: -4,
    hrv_zscore: 4,
  },

  temp: {
    temp_max_zscore: 4,
    temp_min_zscore: -4,
    temp_zscore: 4,
  },

  tanaka: {
    upper_limit: 208,
    factor: 0.7,
  },

  message: {
    anomaly: 'Anomalous measurements were found for this patient',
    temperature_support: 'Sorry, your current watch version does not support temperature reading',
  },

  sentry: {
    env: (lambda_secrets?.SENTRY_ENV as Sentry_Env) ?? Sentry_Env.development,
    dsn: lambda_secrets?.SENTRY_DSN ?? '',
  },
};
