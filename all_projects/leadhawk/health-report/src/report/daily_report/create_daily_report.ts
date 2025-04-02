import { SQSClient, SendMessageCommand, SendMessageCommandInput } from '@aws-sdk/client-sqs';
import { format, isBefore, parse, subDays } from 'date-fns';
import { formatInTimeZone, zonedTimeToUtc } from 'date-fns-tz';
import { v4 } from 'uuid';

import { api } from '../../api/api.js';
import { config } from '../../config/config.js';
import { DataController } from '../../db/dynamodb/data_controller.js';
import { ModelController } from '../../db/dynamodb/model_controller.js';
import { ReportController } from '../../db/dynamodb/report_controller.js';
import { Activity_Units, Api, Source_System, Timezone } from '../../enum/enum.js';
import { activity_helper } from '../../helper/activity_helper.js';
import { math_helper } from '../../helper/math_helper.js';
import { report_helper } from '../../helper/report_helper.js';
import { zoned_time } from '../../helper/timezone_helper.js';
import { HRV, Heart, Sleep, Spo2, Steps, Steps_Total, Temp } from '../../interface/activity_interface.js';
import {
  Daily_Report_Data,
  GMM_Anomaly,
  SD_Anomaly,
  Simple_Daily_Report_Args,
  Simple_Daily_Report_Data,
  Stats,
  Tanaka_Anomaly,
} from '../../interface/report_interface.js';
import { download_data } from '../../utils/download_util.js';
import { create_pdf, screenshot } from '../../utils/pdf_util.js';
import { dead_letter, notify, upload_data, upload_report } from '../../utils/upload_util.js';
import { simple_daily_report } from '../simple_daily_report/simple_daily_report.js';
import { update_sql_biometrics } from './update_sql_biometrics.js';
import { update_sql_user_logs } from './update_sql_user_logs.js';
import { upload_raw_data } from './upload_raw_data.js';

const sqs_client = new SQSClient({ region: config.aws.default_region });

export async function create_daily_report(
  id: string,
  access_token: string,
  source_system: Source_System,
  name: string,
  age: number | null,
  timezone: Timezone,
  date: string,
  retry: number,
  server_retry: number,
  file_prefix: string | null,
  user_id: string,
  dob: string | null,
  intake_date: string
) {
  try {
    console.log(`create_daily_report - ${id}: start`, { id, access_token, source_system, name, timezone, age, date, file_prefix, user_id });

    const uuid = v4();

    /* 
    db controller
    */
    const report_controller = new ReportController();
    const data_controller = new DataController();
    const model_controller = new ModelController();

    /*
    setting global date
    */
    const _zoned_time = await zoned_time(timezone);
    console.log(`create_daily_report - ${id}: current zoned runtime:`, _zoned_time);
    const report_utc_time = new Date();
    const requeue_date = formatInTimeZone(subDays(new Date(_zoned_time), 1), 'UTC', 'yyyy-MM-dd');
    const past_30day_start_date = formatInTimeZone(subDays(new Date(date), 29), 'UTC', 'yyyy-MM-dd');

    /*
    api call
    */
    const device_api_response = await api(id, access_token, source_system, Api.DEVICE, {});

    const device_sync_time_modified = device_api_response?.data?.raw_device_time ?? _zoned_time;
    const device_sync_time = device_api_response?.data?.deviceSyncTime ?? '';
    const device_sync_time_utc = device_sync_time ? zonedTimeToUtc(device_sync_time, timezone) : '';
    const device_battery = device_api_response?.data?.deviceBattery ?? '';
    const device_name = device_api_response?.data?.deviceName ?? '';
    const device_factory_model_raw_name = device_api_response?.data?.deviceFactoryModelRawName ?? '';

    console.log(`create_daily_report - ${id}:`, { device_sync_time });
    console.log(`create_daily_report - ${id}:`, { device_sync_time_modified });

    /*
    sql: updating user logs table
    */
    await update_sql_user_logs(user_id, id, source_system, device_sync_time, device_sync_time_utc, {});

    const date_to_compare = new Date(`${date}T23:59:59`);
    const actual_date = new Date(device_sync_time_modified);

    if (isBefore(actual_date, date_to_compare)) {
      console.log(`create_daily_report - ${id}: device_sync_time is before the daily report date range`, {
        date_to_compare,
        actual_date,
      });

      if (requeue_date === date) {
        console.log(`create_daily_report - ${id}:, sending no report sqs`);
        const sqs_input: SendMessageCommandInput = {
          MessageBody: JSON.stringify({
            id: id,
            user_id: user_id,
            type: config.report.daily_report.sqs_name,
            date: date,
            timezone: timezone,
            source_system: source_system,
            deviceSyncTimeUTC: device_sync_time_utc,
            deviceSyncTime: device_sync_time,
            deviceBattery: device_battery,
            deviceName: device_name,
          }),
          QueueUrl: config.aws.sqs.set_url,
        };
        const command = new SendMessageCommand(sqs_input);
        const response = await sqs_client.send(command);
        console.log(`create_daily_report - ${id}: sqs_response`, response, sqs_input.MessageBody);
      }
      return;
    }

    const [
      heart_api_response,
      steps_api_response,
      spo2_api_response,
      sleep_api_response,
      hrv_api_response,
      temp_api_response,
      resting_hr_api_response,
    ] = await Promise.allSettled([
      api(id, access_token, source_system, Api.HEART, { start_date: date, end_date: date, start_time: '00:00', end_time: '23:59' }),
      api(id, access_token, source_system, Api.STEPS, { start_date: date, end_date: date, start_time: '00:00', end_time: '23:59' }),
      api(id, access_token, source_system, Api.SPO2, { start_date: past_30day_start_date, end_date: date }),
      api(id, access_token, source_system, Api.SLEEP, { start_date: past_30day_start_date, end_date: date }),
      api(id, access_token, source_system, Api.HRV, { start_date: past_30day_start_date, end_date: date }),
      api(id, access_token, source_system, Api.TEMP, { start_date: past_30day_start_date, end_date: date }),
      api(id, access_token, source_system, Api.RESTING_HEART_RATE, { date: date }),
    ]);

    /* additional api calls for applewatch */
    let steps_daily_apple: Steps[] = [];
    let steps_total_apple: number | null = null;
    if (source_system === Source_System.APPLEWATCH) {
      const [steps_daily_api_response, steps_total_api_response] = await Promise.allSettled([
        api(id, access_token, source_system, Api.STEPS_DAILY, { start_date: date, end_date: date, start_time: '00:00', end_time: '23:59' }),
        api(id, access_token, source_system, Api.STEPS_TOTAL, { date: date }),
      ]);
      if (steps_daily_api_response.status === 'fulfilled') steps_daily_apple = steps_daily_api_response.value?.data ?? [];
      if (steps_total_api_response.status === 'fulfilled') steps_total_apple = steps_total_api_response.value?.data?.[0]?.value ?? null;
    }
    console.log(`create_daily_report - ${id}: additional api calls for applewatch`, { steps_daily_apple, steps_total_apple });

    /*
    sample device api data
    */
    console.log(`device_api_response - ${id}`, device_api_response);

    /*
    clone api response data
    */
    let heart_clone = null;
    let steps_clone = null;
    let spo2_clone = null;
    let sleep_clone = null;
    let hrv_clone = null;
    let temp_clone = null;
    let resting_hr_clone = null;
    if (heart_api_response.status === 'fulfilled') heart_clone = structuredClone(heart_api_response?.value?.raw_data);
    if (steps_api_response.status === 'fulfilled') steps_clone = structuredClone(steps_api_response?.value?.raw_data);
    if (spo2_api_response.status === 'fulfilled') spo2_clone = structuredClone(spo2_api_response?.value?.raw_data);
    if (sleep_api_response.status === 'fulfilled') sleep_clone = structuredClone(sleep_api_response?.value?.raw_data);
    if (hrv_api_response.status === 'fulfilled') hrv_clone = structuredClone(hrv_api_response?.value?.raw_data);
    if (temp_api_response.status === 'fulfilled') temp_clone = structuredClone(temp_api_response?.value?.raw_data);
    if (resting_hr_api_response.status === 'fulfilled') resting_hr_clone = structuredClone(resting_hr_api_response?.value?.raw_data);

    if (
      heart_api_response.status === 'fulfilled' &&
      steps_api_response.status === 'fulfilled' &&
      spo2_api_response.status === 'fulfilled' &&
      sleep_api_response.status === 'fulfilled' &&
      hrv_api_response.status === 'fulfilled' &&
      temp_api_response.status === 'fulfilled' &&
      resting_hr_api_response.status === 'fulfilled'
    ) {
      /*
      send to dead-letter if api failed
      */
      const is_api_failed = [
        heart_api_response,
        steps_api_response,
        spo2_api_response,
        sleep_api_response,
        hrv_api_response,
        temp_api_response,
      ].every((e) => e.value?.code !== 200 && e.value?.code !== 429 && e.value?.code !== 502 && e.value?.code !== 503);

      if (is_api_failed) {
        console.log(`create_daily_report - ${id}: api failed, sending sqs to dead letter`);
        await dead_letter(id, timezone, config.aws.sqs.dead_letter, 'daily-report-api-rejected');
        return;
      }

      /*
      retry = 0, retry > 5, for current date report and backdated
      */
      const is_requeue = [
        heart_api_response,
        steps_api_response,
        spo2_api_response,
        sleep_api_response,
        hrv_api_response,
        temp_api_response,
      ].some((e) => e.value?.code === 429);

      if (is_requeue && date !== requeue_date) {
        console.log(`create_daily_report - ${id}: requeue, backdated report, not requeuing, date: ${date}, retry: ${retry}`);
        return;
      }

      if (is_requeue && retry === 0 && date === requeue_date) {
        console.log(`create_daily_report - ${id}: requeue, current day report, date: ${date}, retry: ${retry}`);
        const sqs_input: SendMessageCommandInput = {
          MessageBody: JSON.stringify({
            id: id,
            access_token: access_token,
            source_system: source_system,
            name: name,
            retry: retry + 1,
            file_prefix: file_prefix,
            user_id: user_id,
            intake_date: intake_date,
          }),
          QueueUrl: config.aws.sqs.fetch_url_daily_report,
          DelaySeconds: 900,
        };
        const command = new SendMessageCommand(sqs_input);
        const response = await sqs_client.send(command);
        console.log(`create_daily_report - ${id}: sqs_response`, response);
        return;
      }

      /*
      retry count > 5, send to dead letter queue
      */
      if (is_requeue && retry > 5 && date === requeue_date) {
        console.log(`create_daily_report - ${id}: requeue, date: ${date}, retry: ${retry}, sending sqs to dead letter`);
        await dead_letter(id, timezone, config.aws.sqs.dead_letter, `daily-report-requeue-limit-reached, retry: ${retry}`);
        return;
      }

      /*
      remote server error - 502, 503
      */

      const is_server_error = [
        heart_api_response,
        steps_api_response,
        spo2_api_response,
        sleep_api_response,
        hrv_api_response,
        temp_api_response,
      ].some((e) => e.value?.code === 502 || e.value?.code === 503);

      if (is_server_error) {
        console.log(`create_daily_report - ${id}: remote server error, stopping report generation requeueing, currentdate: ${date}`);
        const sqs_input: SendMessageCommandInput = {
          MessageBody: JSON.stringify({
            id: id,
            access_token: access_token,
            source_system: source_system,
            name: name,
            server_retry: server_retry + 1,
            file_prefix: file_prefix,
            user_id: user_id,
            intake_date: intake_date,
          }),
          QueueUrl: config.aws.sqs.fetch_url_daily_report,
          DelaySeconds: 900,
        };
        const command = new SendMessageCommand(sqs_input);
        const response = await sqs_client.send(command);
        console.log(`create_daily_report - ${id}: sqs_response`, response);
        return 'stop';
      }
    }

    /*
    data aggregation
    */
    let heart_data: Heart[] = [];

    let steps_data: Steps[] = [];

    let steps_total: Steps_Total[] = [];
    let steps_total_7day_data: Steps_Total[] = [];

    let spo2_data: Spo2[] = [];
    let spo2_7day_data: Spo2[] = [];

    let sleep_data: Sleep[] = [];
    let sleep_7day_data: Sleep[] = [];

    let hrv_data: HRV[] = [];
    let hrv_7day_data: HRV[] = [];

    let temp_data: Temp[] = [];
    let temp_7day_data: Temp[] = [];

    /*
    get past daily report generated data
    */
    console.log(`create_daily_report - ${id}: getting past generated data for daily report`);
    const data_start_date = formatInTimeZone(subDays(new Date(date), 15), 'UTC', 'yyyy-MM-dd');
    const data_end_date = formatInTimeZone(subDays(new Date(date), 1), 'UTC', 'yyyy-MM-dd');
    console.log(`create_daily_report - ${id}: past generated data for dates`, { data_start_date, data_end_date });

    let past_daily_data_list = [];
    const past_daily_data = (await data_controller.get_data_by_date_range(id, data_start_date, data_end_date, 'desc', null)) ?? [];
    const bucket_data = past_daily_data.map((e) => download_data(`${e.data_id}.json`));
    const bucket_data_response = await Promise.allSettled(bucket_data);
    past_daily_data_list = bucket_data_response
      .map((e) => {
        if (e.status === 'fulfilled') return e.value;
        return null;
      })
      .filter((e) => e);

    /*
    heart filtering for data
    */
    console.log(`create_daily_report - ${id}: heart filtering for data`);

    if (heart_api_response.status === 'fulfilled') heart_data = heart_api_response.value?.data;
    if (!heart_data?.length) heart_data = [];

    heart_data = activity_helper.heart_steps_timeseries(Api.HEART, heart_data, '00:00:00', false, true, null) as Heart[];

    const heart_stats: Stats = activity_helper.stats(heart_data.map((e) => e.value).filter((e) => e) as number[], 0);

    /* 
    steps filtering for data 
    */
    console.log(`create_daily_report - ${id}: steps filtering for data`);

    if (steps_api_response.status === 'fulfilled') steps_data = steps_api_response.value?.data;
    if (source_system === Source_System.APPLEWATCH && steps_daily_apple?.length) {
      steps_data = steps_daily_apple;
    }
    if (!steps_data?.length) steps_data = [];

    let steps_fill_value: 0 | null = 0;
    if (source_system === Source_System.APPLEWATCH) steps_fill_value = null;
    steps_data = activity_helper.heart_steps_timeseries(Api.STEPS, steps_data, '00:00:00', false, true, steps_fill_value) as Steps[];

    const steps_stats: Stats = activity_helper.stats(
      steps_data.map((e) => e.value).filter((e) => e !== null && e !== undefined) as number[],
      0
    );

    /*
    steps total
    */
    console.log(`create_daily_report - ${id}: steps total filtering for data`);

    steps_total = activity_helper.steps_total_timeseries(
      past_daily_data_list.map((e) => ({ dateTime: e.pdfDate, value: e.simpleDailyReport.steps.raw_value })),
      date
    );

    const today_steps_total = steps_total_apple ?? steps_data.filter((e) => e.value).reduce((acc, curr) => acc + Number(curr.value), 0);
    steps_total[steps_total.length - 1].value = today_steps_total;

    const steps_total_sd_anomaly: SD_Anomaly = activity_helper.steps_total_anomaly_15days(steps_total);

    if (steps_total_sd_anomaly.isRange) {
      steps_total_7day_data = activity_helper.steps_total_slice(steps_total, 16);
      if (steps_total_sd_anomaly.isAnomaly) {
        steps_total_7day_data[steps_total_7day_data.length - 1].isAnomaly = true;
      }
    } else {
      steps_total_7day_data = activity_helper.steps_total_slice(steps_total, 7);
    }

    for (const steps_total of steps_total_7day_data) {
      const date = steps_total.dateTime;
      const index = past_daily_data_list.findIndex((e) => e.pdfDate === date);
      if (index === -1) {
        console.log(`create_daily_report - ${id}: steps_total data not available for date: ${date}`);
      } else {
        steps_total.isAnomaly = past_daily_data_list.at(index)?.stepsTotal?.stepsTotal7Day?.at(-1)?.isAnomaly ?? false;
      }
    }

    const steps_total_stats: Stats = activity_helper.stats(steps_total_7day_data.map((e) => e.value).filter((e) => e) as number[], 0);

    /* 
    spo2 filtering for data 
    */
    console.log(`create_daily_report - ${id}: spo2 filtering for data`);

    if (spo2_api_response.status === 'fulfilled') spo2_data = spo2_api_response.value?.data;
    if (!spo2_data?.length) spo2_data = [];

    spo2_data = activity_helper.spo2_timeseries(spo2_data, date);

    const spo2_sd_anomaly: SD_Anomaly = activity_helper.spo2_anomaly_15days(spo2_data);

    if (spo2_sd_anomaly.isRange) {
      spo2_7day_data = activity_helper.spo2_slice(spo2_data, 16);
      if (spo2_sd_anomaly.isAnomaly) {
        spo2_7day_data[spo2_7day_data.length - 1].isAnomaly = true;
      }
    } else {
      spo2_7day_data = activity_helper.spo2_slice(spo2_data, 7);
    }

    for (const spo2 of spo2_7day_data) {
      const date = spo2.dateTime;
      const index = past_daily_data_list.findIndex((e) => e.pdfDate === date);
      if (index === -1) {
        console.log(`create_daily_report - ${id}: spo2 data not available for date: ${date}`);
      } else {
        spo2.isAnomaly = past_daily_data_list.at(index)?.spo2?.spo27Day?.at(-1)?.isAnomaly ?? false;
      }
    }

    const current_spo2_value = spo2_7day_data[spo2_7day_data.length - 1].value.avg;

    if (!spo2_sd_anomaly.isRange && current_spo2_value && current_spo2_value < config.spo2.spo2_level) {
      spo2_7day_data[spo2_7day_data.length - 1].isAnomaly = true;
    }

    const spo2_stats: Stats = activity_helper.stats(spo2_7day_data.map((e) => e.value.avg).filter((e) => e) as number[], 1);

    /* 
    sleep filtering for data 
    */
    console.log(`create_daily_report - ${id}: sleep filtering for data`);

    if (sleep_api_response.status === 'fulfilled') sleep_data = sleep_api_response.value?.data;
    if (!sleep_data?.length) sleep_data = [];

    sleep_data = activity_helper.sleep_timeseries(sleep_data, date);

    const sleep_sd_anomaly: SD_Anomaly = activity_helper.sleep_anomaly_15days(sleep_data);

    if (sleep_sd_anomaly.isRange) {
      sleep_7day_data = activity_helper.sleep_slice(sleep_data, 16);
      if (sleep_sd_anomaly.isAnomaly) {
        sleep_7day_data[sleep_7day_data.length - 1].isAnomaly = true;
      }
    } else {
      sleep_7day_data = activity_helper.sleep_slice(sleep_data, 7);
    }

    for (const sleep of sleep_7day_data) {
      const date = sleep.dateOfSleep;
      const index = past_daily_data_list.findIndex((e) => e.pdfDate === date);
      if (index === -1) {
        console.log(`create_daily_report - ${id}: sleep data not available for date: ${date}`);
      } else {
        sleep.isAnomaly = past_daily_data_list.at(index)?.sleep?.sleep7Day?.at(-1)?.isAnomaly ?? false;
      }
    }

    const current_sleep_value = sleep_7day_data[sleep_7day_data.length - 1].minutesAsleep;

    if (!sleep_sd_anomaly.isRange && current_sleep_value && current_sleep_value < config.sleep.sleep_level) {
      sleep_7day_data[sleep_7day_data.length - 1].isAnomaly = true;
    }

    const sleep_stats: Stats = activity_helper.stats(sleep_7day_data.map((e) => e.minutesAsleep).filter((e) => e) as number[], 0);

    /* 
    hrv filtering for data 
    */
    console.log(`create_daily_report - ${id}: hrv filtering for data`);

    if (hrv_api_response.status === 'fulfilled') hrv_data = hrv_api_response.value?.data;
    if (!hrv_data?.length) hrv_data = [];

    hrv_data = activity_helper.hrv_timeseries(hrv_data, date);

    const hrv_sd_anomaly: SD_Anomaly = activity_helper.hrv_anomaly_15days(hrv_data);

    if (hrv_sd_anomaly.isRange) {
      hrv_7day_data = activity_helper.hrv_slice(hrv_data, 16);
      if (hrv_sd_anomaly.isAnomaly) {
        hrv_7day_data[hrv_7day_data.length - 1].isAnomaly = true;
      }
    } else {
      hrv_7day_data = activity_helper.hrv_slice(hrv_data, 7);
    }

    for (const hrv of hrv_7day_data) {
      const date = hrv.dateTime;
      const index = past_daily_data_list.findIndex((e) => e.pdfDate === date);
      if (index === -1) {
        console.log(`create_daily_report - ${id}: hrv data not available for date: ${date}`);
      } else {
        hrv.isAnomaly = past_daily_data_list.at(index)?.hrv?.hrv7Day?.at(-1)?.isAnomaly ?? false;
      }
    }

    const hrv_stats: Stats = activity_helper.stats(hrv_7day_data.map((e) => e.value.dailyRmssd).filter((e) => e) as number[], 0);

    /* 
    temp filtering for data 
    */
    console.log(`create_daily_report - ${id}: temp filtering for data`);

    if (temp_api_response.status === 'fulfilled') temp_data = temp_api_response.value?.data;
    if (!temp_data?.length) temp_data = [];

    temp_data = activity_helper.temp_timeseries(temp_data, date);

    const temp_sd_anomaly: SD_Anomaly = activity_helper.temp_anomaly_15days(temp_data);

    if (temp_sd_anomaly.isRange) {
      temp_7day_data = activity_helper.temp_slice(temp_data, 16);
      if (temp_sd_anomaly.isAnomaly) {
        temp_7day_data[temp_7day_data.length - 1].isAnomaly = true;
      }
    } else {
      temp_7day_data = activity_helper.temp_slice(temp_data, 7);
    }

    for (const temp of temp_7day_data) {
      const date = temp.dateTime;
      const index = past_daily_data_list.findIndex((e) => e.pdfDate === date);
      if (index === -1) {
        console.log(`create_daily_report - ${id}: temp data not available for date: ${date}`);
      } else {
        temp.isAnomaly = past_daily_data_list.at(index)?.temp?.temp7Day?.at(-1)?.isAnomaly ?? false;
      }
    }

    const temp_stats: Stats = activity_helper.stats(temp_7day_data.map((e) => e.value.nightlyRelative).filter((e) => e) as number[], 1);

    let temperature_support = true;
    if (source_system === Source_System.APPLEWATCH) {
      console.log(`create_daily_report - ${id}: checking for temperature support`);
      temperature_support = report_helper.applewatch_temperature_support(device_factory_model_raw_name);
    }

    /* 
    gmm anomaly detection 
    */
    // console.log(`create_daily_report - ${id}: gmm_anomaly detection`);

    const gmm_anomaly: GMM_Anomaly[] | null = null; //wip

    /* 
    tanaka anomaly detection 
    */
    console.log(`create_daily_report - ${id}: tanaka_anomaly detection`);

    let tanaka_anomaly: Tanaka_Anomaly[] | null = null;
    let max_hr: number | null = null;

    if (age) {
      max_hr = config.tanaka.upper_limit - config.tanaka.factor * age;
      console.log(`create_daily_report - ${id}: age: ${age}, max_hr: ${max_hr}`);
      tanaka_anomaly = heart_data
        .filter((e) => e.value)
        .filter((e) => Number(e.value) > Number(max_hr) || Number(e.value) < config.heart.heart_level) as Tanaka_Anomaly[];
    } else {
      console.log(`create_daily_report - ${id}: age not available, not calculating tanaka anomaly`);
    }
    if (!tanaka_anomaly?.length) tanaka_anomaly = null;

    /* 
    if all dataset empty
    */
    console.log(`create_daily_report - ${id}: checking if dataset empty`);
    const heart_empty = heart_data.every((e) => e.value === null);
    const steps_empty = steps_data.every((e) => e.value === null || e.value === 0);
    const sleep_empty = sleep_7day_data.at(-1)?.minutesAsleep === null;
    const spo2_empty = spo2_7day_data.at(-1)?.value.avg === null;
    const hrv_empty = hrv_7day_data.at(-1)?.value.dailyRmssd === null;
    const temp_empty = temp_7day_data.at(-1)?.value.nightlyRelative === null;
    console.log(`create_daily_report - ${id}:`, { heart_empty, steps_empty, sleep_empty, spo2_empty, hrv_empty, temp_empty });
    if (heart_empty && steps_empty && sleep_empty && spo2_empty && hrv_empty && temp_empty) {
      console.log(`create_daily_report - ${id}: dataset empty, not generating report`);
      if (requeue_date === date) {
        console.log(`create_daily_report - ${id}: sending no report sqs`);
        const sqs_input: SendMessageCommandInput = {
          MessageBody: JSON.stringify({
            id: id,
            user_id: user_id,
            type: config.report.daily_report.sqs_name,
            date: date,
            source_system: source_system,
            timezone: timezone,
            deviceSyncTimeUTC: device_sync_time_utc,
            deviceSyncTime: device_sync_time,
            deviceBattery: device_battery,
            deviceName: device_name,
          }),
          QueueUrl: config.aws.sqs.set_url,
        };
        const command = new SendMessageCommand(sqs_input);
        const response = await sqs_client.send(command);
        console.log(`create_daily_report - ${id}: sqs_response`, response, sqs_input.MessageBody);
      }
      return;
    }

    /* 
    heart bound calculation
    */
    console.log(`create_daily_report - ${id}: computing heart bound`);
    let heart_lower_bound = null;
    let heart_upper_bound = null;
    let heart_mean = null;
    let heart_sd = null;

    const heart_value = heart_data.map((e) => e.value).filter((e) => e) as number[];
    if (heart_value?.length) {
      const mean = math_helper.mean(heart_value);
      const sd = math_helper.sample_sd(heart_value);

      heart_lower_bound = Math.max(0, Math.round(mean - 3 * sd));
      heart_upper_bound = Math.max(0, Math.round(mean + 3 * sd));

      if (heart_lower_bound < config.heart.heart_level) heart_lower_bound = config.heart.heart_level;

      heart_mean = structuredClone(mean);
      heart_sd = structuredClone(sd);
    }

    /* 
    steps bound calculation
    */
    console.log(`create_daily_report - ${id}: computing steps bound`);
    let steps_lower_bound = null;
    let steps_upper_bound = null;
    let steps_mean = null;
    let steps_sd = null;

    const steps_value = steps_data.map((e) => e.value).filter((e) => e !== null) as number[];
    if (steps_value?.length) {
      const mean = math_helper.mean(steps_value);
      const sd = math_helper.sample_sd(steps_value);

      steps_lower_bound = Math.max(0, Math.round(mean - 3 * sd));
      steps_upper_bound = Math.max(0, Math.round(mean + 3 * sd));

      steps_mean = structuredClone(mean);
      steps_sd = structuredClone(sd);
    }

    /* 
    steps total bound calculation
    */
    console.log(`create_daily_report - ${id}: computing steps total bound`);
    let steps_total_lower_bound = null;
    let steps_total_upper_bound = null;

    if (
      steps_total_sd_anomaly.lowerBound !== null &&
      steps_total_sd_anomaly.lowerBound !== undefined &&
      steps_total_sd_anomaly.upperBound !== null &&
      steps_total_sd_anomaly.upperBound !== undefined
    ) {
      steps_total_lower_bound = Math.max(0, Number(steps_total_sd_anomaly.lowerBound.toFixed(1)));
      steps_total_upper_bound = Number(steps_total_sd_anomaly.upperBound.toFixed(1));
    }

    /* 
    spo2 bound calculation
    */
    console.log(`create_daily_report - ${id}: computing spo2 bound`);
    let spo2_lower_bound = null;
    let spo2_upper_bound = null;

    if (
      spo2_sd_anomaly.lowerBound !== null &&
      spo2_sd_anomaly.lowerBound !== undefined &&
      spo2_sd_anomaly.upperBound !== null &&
      spo2_sd_anomaly.upperBound !== undefined
    ) {
      spo2_lower_bound = Math.max(0, Number(spo2_sd_anomaly.lowerBound.toFixed(1)));
      spo2_upper_bound = Math.min(100, Number(spo2_sd_anomaly.upperBound.toFixed(1)));
    }

    /* 
    sleep bound calculation
    */
    console.log(`create_daily_report - ${id}: computing sleep bound`);
    let sleep_lower_bound = null;
    let sleep_upper_bound = null;

    if (
      sleep_sd_anomaly.lowerBound !== null &&
      sleep_sd_anomaly.lowerBound !== undefined &&
      sleep_sd_anomaly.upperBound !== null &&
      sleep_sd_anomaly.upperBound !== undefined
    ) {
      sleep_lower_bound = Math.max(0, Math.round(sleep_sd_anomaly.lowerBound));
      sleep_upper_bound = Math.min(1440, Math.round(sleep_sd_anomaly.upperBound));
    }

    /* 
    hrv bound calculation
    */
    console.log(`create_daily_report - ${id}: computing hrv bound`);
    let hrv_lower_bound = null;
    let hrv_upper_bound = null;

    if (
      hrv_sd_anomaly.lowerBound !== null &&
      hrv_sd_anomaly.lowerBound !== undefined &&
      hrv_sd_anomaly.upperBound !== null &&
      hrv_sd_anomaly.upperBound !== undefined
    ) {
      hrv_lower_bound = Math.max(0, Math.round(hrv_sd_anomaly.lowerBound));
      hrv_upper_bound = Math.round(hrv_sd_anomaly.upperBound);
    }

    /* 
    temp bound calculation
    */
    console.log(`create_daily_report - ${id}: computing temp bound`);
    let temp_lower_bound = null;
    let temp_upper_bound = null;

    if (
      temp_sd_anomaly.lowerBound !== null &&
      temp_sd_anomaly.lowerBound !== undefined &&
      temp_sd_anomaly.upperBound !== null &&
      temp_sd_anomaly.upperBound !== undefined
    ) {
      temp_lower_bound = Number(temp_sd_anomaly.lowerBound.toFixed(1));
      temp_upper_bound = Number(temp_sd_anomaly.upperBound.toFixed(1));
    }

    /* 
    create daily report data object 
    */
    console.log(`create_daily_report - ${id}: creating daily report data object`);
    const data: Daily_Report_Data = {
      heart: {
        heartCurrentDay: heart_data,
        heartCurrentDayStats: heart_stats,
        lowerBound: heart_lower_bound,
        upperBound: heart_upper_bound,
        mean: heart_mean,
        sd: heart_sd,
        reuse_heartCurrentDay: structuredClone(heart_data),
      },
      steps: {
        stepsCurrentDay: steps_data,
        stepsCurrentDayStats: steps_stats,
        lowerBound: steps_lower_bound,
        upperBound: steps_upper_bound,
        mean: steps_mean,
        sd: steps_sd,
        reuse_stepsCurrentDay: structuredClone(steps_data),
      },
      stepsTotal: {
        stepsTotal7Day: steps_total_7day_data,
        stepsTotal7DayStats: steps_total_stats,
        lowerBound: steps_total_lower_bound,
        upperBound: steps_total_upper_bound,
        mean: steps_total_sd_anomaly.mean,
        sd: steps_total_sd_anomaly.sd,
      },
      spo2: {
        spo27Day: spo2_7day_data,
        spo27DayStats: spo2_stats,
        lowerBound: spo2_lower_bound,
        upperBound: spo2_upper_bound,
        mean: spo2_sd_anomaly.mean,
        sd: spo2_sd_anomaly.sd,
      },
      sleep: {
        sleep7Day: sleep_7day_data,
        sleep7DayStats: sleep_stats,
        lowerBound: sleep_lower_bound,
        upperBound: sleep_upper_bound,
        mean: sleep_sd_anomaly.mean,
        sd: sleep_sd_anomaly.sd,
      },
      hrv: {
        hrv7Day: hrv_7day_data,
        hrv7DayStats: hrv_stats,
        lowerBound: hrv_lower_bound,
        upperBound: hrv_upper_bound,
        mean: hrv_sd_anomaly.mean,
        sd: hrv_sd_anomaly.sd,
      },
      temp: {
        temp7Day: temp_7day_data,
        temp7DayStats: temp_stats,
        lowerBound: temp_lower_bound,
        upperBound: temp_upper_bound,
        mean: temp_sd_anomaly.mean,
        sd: temp_sd_anomaly.sd,
      },
      id: id,
      userId: user_id,
      dataId: uuid,
      name: name,
      age: age,
      timezone: timezone,
      sourceSystem: source_system,
      startApiDate: date,
      endApiDate: date,
      heartStepsAnomaly: gmm_anomaly,
      tanakaAnomaly: tanaka_anomaly,
      tanakaMaxHr: max_hr,
      gmmData: null, // wip
      reportZonedTime: formatInTimeZone(_zoned_time, 'UTC', 'yyyy-MM-dd HH:mm:ss'),
      reportUTCtime: report_utc_time,
      apiData: {
        heart: `${uuid}-heart`,
        steps: `${uuid}-steps`,
        sleep: `${uuid}-sleep`,
        spo2: `${uuid}-spo2`,
        hrv: `${uuid}-hrv`,
        temp: `${uuid}-temp`,
        restingHeartRate: `${uuid}-restingHeartRate`,
      },
      dataURI: undefined,
      reportURI: undefined,
      reportType: config.report.daily_report.type,
      reportName: config.report.daily_report.name,
      reportId: report_helper.report_id(id, formatInTimeZone(new Date(date), 'UTC', 'MMdd')),
      datePublished: formatInTimeZone(_zoned_time, 'UTC', 'MM/dd/yyyy'),
      eventDate: formatInTimeZone(new Date(date), 'UTC', 'MM/dd/yyyy'),
      pdfDate: formatInTimeZone(new Date(date), 'UTC', 'yyyy-MM-dd'),
      units: {
        heart: Activity_Units.HEART,
        steps: Activity_Units.STEPS,
        spo2: Activity_Units.SPO2,
        sleep: Activity_Units.SLEEP,
        hrv: Activity_Units.HRV,
        temp: Activity_Units.TEMP,
      },
      version: config.version,
      simpleDailyReport: undefined,
      reuse_heartStepsAnomaly: structuredClone(gmm_anomaly),
      reuse_tanakaAnomaly: structuredClone(tanaka_anomaly),
      anomalyType: [],
      isTemperatureSupported: {
        value: temperature_support,
        text: config.message.temperature_support,
      },
    };

    /* 
    simple daily report report 
    */
    console.log(`create_daily_report - ${id}: creating simple daily report, date: ${date}`);
    const is_gmm_anomaly = (gmm_anomaly as unknown as GMM_Anomaly[])?.length ? true : false; //wip
    const is_tanaka_anomaly = tanaka_anomaly?.length ? true : false;

    let is_spo2_medical_anomaly = false;
    if (!spo2_sd_anomaly.isRange) {
      is_spo2_medical_anomaly =
        spo2_7day_data.at(-1)?.value.avg && Number(spo2_7day_data.at(-1)?.value.avg) < config.spo2.spo2_level ? true : false;
    }

    let is_sleep_medical_anomaly = false;
    if (!sleep_sd_anomaly.isRange) {
      is_sleep_medical_anomaly =
        sleep_7day_data.at(-1)?.minutesAsleep && Number(sleep_7day_data.at(-1)?.minutesAsleep) < config.sleep.sleep_level ? true : false;
    }

    const score_anomaly = [
      is_gmm_anomaly,
      is_tanaka_anomaly,
      is_spo2_medical_anomaly,
      is_sleep_medical_anomaly,
      steps_total_sd_anomaly.isAnomaly,
      spo2_sd_anomaly.isAnomaly,
      sleep_sd_anomaly.isAnomaly,
      hrv_sd_anomaly.isAnomaly,
      temp_sd_anomaly.isAnomaly,
    ].some((e) => e);

    const simple_daily_report_args: Simple_Daily_Report_Args = {
      heart: {
        stats: data.heart.heartCurrentDayStats,
        lowerBound: data.heart.lowerBound,
        upperBound: data.heart.upperBound,
        isGMMAnomaly: is_gmm_anomaly,
        isTanakaAnomaly: is_tanaka_anomaly,
      },
      steps: {
        value: steps_total_7day_data.at(-1)?.value as number | null,
        lowerBound: data.stepsTotal.lowerBound,
        upperBound: data.stepsTotal.upperBound,
        isSDAnomaly: steps_total_sd_anomaly.isAnomaly,
        sdAnomaly: steps_total_sd_anomaly,
      },
      spo2: {
        value: spo2_7day_data.at(-1)?.value.avg as number | null,
        lowerBound: data.spo2.lowerBound,
        upperBound: data.spo2.upperBound,
        isMedicalAnomaly: is_spo2_medical_anomaly,
        isSDAnomaly: spo2_sd_anomaly.isAnomaly,
        sdAnomaly: spo2_sd_anomaly,
      },
      sleep: {
        value: sleep_7day_data.at(-1)?.minutesAsleep as number | null,
        lowerBound: data.sleep.lowerBound,
        upperBound: data.sleep.upperBound,
        isMedicalAnomaly: is_sleep_medical_anomaly,
        isSDAnomaly: sleep_sd_anomaly.isAnomaly,
        sdAnomaly: sleep_sd_anomaly,
      },
      hrv: {
        value: hrv_7day_data.at(-1)?.value.dailyRmssd as number | null,
        lowerBound: data.hrv.lowerBound,
        upperBound: data.hrv.upperBound,
        isSDAnomaly: hrv_sd_anomaly.isAnomaly,
        sdAnomaly: hrv_sd_anomaly,
      },
      temp: {
        value: temp_7day_data.at(-1)?.value.nightlyRelative as number | null,
        lowerBound: data.temp.lowerBound,
        upperBound: data.temp.upperBound,
        isSDAnomaly: temp_sd_anomaly.isAnomaly,
        sdAnomaly: temp_sd_anomaly,
      },
      scoreAnomaly: score_anomaly,
      id: data.id,
      userId: user_id,
      dataId: data.dataId,
      name: data.name,
      timezone: data.timezone,
      sourceSystem: data.sourceSystem,
      reportType: config.report.simple_daily_report.type,
      reportName: config.report.simple_daily_report.name,
      reportId: data.reportId,
      datePublished: data.datePublished,
      eventDate: data.eventDate,
      pdfDate: data.pdfDate,
    };

    const simple_daily_report_data: Simple_Daily_Report_Data = await simple_daily_report(id, date, simple_daily_report_args, source_system);
    data.simpleDailyReport = simple_daily_report_data;

    /* modifying data, HH:mm -> hh:mm a */
    data.heart.heartCurrentDay = heart_data.map((e) => ({
      time: format(parse(e.time, 'HH:mm', new Date()), 'hh:mm a'),
      value: e.value,
    }));

    data.steps.stepsCurrentDay = steps_data.map((e) => ({
      time: format(parse(e.time, 'HH:mm', new Date()), 'hh:mm a'),
      value: e.value,
    }));

    data.heartStepsAnomaly = null; //wip

    data.tanakaAnomaly = tanaka_anomaly
      ? tanaka_anomaly.map((e) => ({
          ...e,
          time: format(parse(e.time, 'HH:mm', new Date()), 'hh:mm a'),
        }))
      : null;

    /*
    create data buffer
    */
    console.log(`create_daily_report - ${id}: creating data buffer`);
    const data_buffer = report_helper.create_buffer(data);

    /*
    create pdf buffer
    */
    console.log(`create_daily_report - ${id}: creating pdf buffer`);
    const pdf_buffer = await create_pdf(data, 'report.html');
    if (!pdf_buffer) {
      throw new Error('create_daily_report: pdf_buffer not available');
    }

    /*
    screenshot
    */
    console.log(`create_daily_report - ${id}: creating screenshot`);
    const sc = await screenshot(data, 'screenshot.html');
    if (!sc) {
      throw new Error('create_daily_report: screenshot not available');
    }

    /*
    upload data
    */
    console.log(`create_daily_report - ${id}: uploading data`);
    const data_uri = await upload_data(data_buffer, data.dataId);
    data.dataURI = data_uri;

    /*
    upload report
    */
    console.log(`create_daily_report - ${id}: uploading report`);
    const report_uri = await upload_report(
      id,
      pdf_buffer,
      date,
      null,
      data.reportId,
      data.dataId,
      config.report.daily_report.sqs_name,
      config.aws.sqs.set_url,
      `:${config.report.daily_report.tag_name}`,
      '',
      null,
      data.simpleDailyReport.score,
      sc,
      source_system,
      file_prefix,
      timezone,
      user_id
    );
    data.reportURI = report_uri;

    /*
    create data metadata in db
    */
    console.log(`create_daily_report - ${id}: creating json data in: ${config.aws.dynamodb.data_table}`);
    await data_controller.create(id, data.dataId, date);

    /*
    uploading raw api data
    */
    await upload_raw_data(id, data, heart_clone, steps_clone, spo2_clone, sleep_clone, hrv_clone, temp_clone, resting_hr_clone);

    /*
    update db for last report generate day
    */
    console.log(`create_daily_report - ${id}: updating last_daily_report_runtime, date: ${date}`);
    await report_controller.update(id, { user_id: id, last_daily_report_runtime: new Date(date).toISOString() });

    /*
    sql: update user, heart, steps, spo2, sleep, hrv, temp table
    */
    await update_sql_biometrics({
      id: id,
      user_id: user_id,
      source_system: source_system,
      date: date,
      name: name,
      dob: dob,
      timezone: timezone,
      heart_data,
      steps_data,
      spo2_7day_data,
      sleep_7day_data,
      hrv_7day_data,
      temp_7day_data,
      heart_mean,
      heart_sd,
      heart_lower_bound,
      heart_upper_bound,
      steps_mean,
      steps_sd,
      steps_lower_bound,
      steps_upper_bound,
      spo2_sd_anomaly,
      spo2_lower_bound,
      spo2_upper_bound,
      sleep_sd_anomaly,
      sleep_lower_bound,
      sleep_upper_bound,
      hrv_sd_anomaly,
      hrv_lower_bound,
      hrv_upper_bound,
      temp_sd_anomaly,
      temp_lower_bound,
      temp_upper_bound,
      simpleDailyReport: data.simpleDailyReport,
      device_name,
    });

    /*
    creating local json files
    */
    if (config.dev_mode) {
      console.log(`create_daily_report - ${id}: creating local json data`);
      report_helper.create_json([{ data, name: `${data.reportType}_${data.id}_${data.pdfDate}` }]);
    }
    /*
    end of line
    */
  } catch (error) {
    console.log(`create_daily_report - ${id}: error`, error);
    await notify(`create_daily_report - ${id}: error`, error);
  } finally {
    console.log(`create_daily_report - ${id}: end`);
  }
}
