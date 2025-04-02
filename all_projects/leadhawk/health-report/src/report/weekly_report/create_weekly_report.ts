import { format, parse } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import { v4 } from 'uuid';

import { api } from '../../api/api.js';
import { config } from '../../config/config.js';
import { DataController } from '../../db/dynamodb/data_controller.js';
import { Activity_Units, Api, Source_System, Timezone } from '../../enum/enum.js';
import { activity_helper } from '../../helper/activity_helper.js';
import { date_helper } from '../../helper/date_helper.js';
import { report_helper } from '../../helper/report_helper.js';
import { zoned_time } from '../../helper/timezone_helper.js';
import { HRV, Heart, Sleep, Spo2, Steps, Temp } from '../../interface/activity_interface.js';
import { GMM_Anomaly, Stats, Tanaka_Anomaly, Weekly_Monthly_Fillup_Data, Weekly_Report_Data } from '../../interface/report_interface.js';
import { download_data } from '../../utils/download_util.js';
import { create_pdf, screenshot } from '../../utils/pdf_util.js';
import { notify, upload_data, upload_report } from '../../utils/upload_util.js';

export async function create_weekly_report(
  id: string,
  source_system: Source_System,
  name: string,
  timezone: Timezone,
  file_prefix: string | null,
  user_id: string,
  start_report_at: string,
  end_report_at: string
) {
  try {
    console.log(`create_weekly_report - ${id}: start`);

    const uuid = v4();

    let steps_fill_value: 0 | null = 0;
    if (source_system === Source_System.APPLEWATCH) steps_fill_value = null;

    /* 
    db controller
    */
    const data_controller = new DataController();

    /*
    setting api time
    */
    console.log(`create_weekly_report - ${id}: setting api time`);
    const _zoned_time = await zoned_time(timezone);
    const report_utc_time = new Date();
    console.log(`create_weekly_report - ${id}: zoned_time`, _zoned_time);

    // const end_api_date_object = zonedTimeToUtc(startOfWeek(_zoned_time), 'UTC');
    // const start_api_date_object = subDays(end_api_date_object, 6);

    const start_api_date_object = new Date(start_report_at);
    const end_api_date_object = new Date(end_report_at);

    const end_api_date = formatInTimeZone(end_api_date_object, 'UTC', 'yyyy-MM-dd');
    const start_api_date = formatInTimeZone(start_api_date_object, 'UTC', 'yyyy-MM-dd');

    /*
    get data by date range
    */
    console.log(`create_weekly_report - ${id}: date_range: start: ${start_api_date} end: ${end_api_date}`);
    const response = await data_controller.get_data_by_date_range(id, start_api_date, end_api_date, 'asc', null);

    /*
    no daily data available
    */
    if (!response) {
      console.log(`create_weekly_report - ${id}: response: ${response}, not generating weekly report`);
      return;
    }

    /*
    get json files
    */
    console.log(`create_weekly_report - ${id}: fetching json files from: ${config.aws.s3.data_bucket}`);
    let weekly_data: Weekly_Monthly_Fillup_Data[] = [];
    const bucket_data: any = response?.map((e) => download_data(`${e.data_id}.json`));
    const bucket_data_response = await Promise.allSettled(bucket_data);
    weekly_data = bucket_data_response.map((e) => {
      if (e.status === 'fulfilled') return e.value;
      return null;
    });

    /*
    filter weekly_data for falsey values
    */
    weekly_data = weekly_data.filter((e) => e);

    /*
    if weekly_data < 2, return
    */
    if (weekly_data.length < 2) {
      console.log(`create_weekly_report - ${id}: weekly_data < 2, not generating weekly report, weekly_data: ${weekly_data}`);
      return;
    }

    /*
    additional api calls for applewatch
    */
    let device_factory_model_raw_name = '';
    if (source_system === Source_System.APPLEWATCH) {
      const device_api_response = await api(id, '', source_system, Api.DEVICE, {});
      device_factory_model_raw_name = device_api_response?.data?.deviceFactoryModelRawName ?? '';
    }

    /*
    fill up missing date's with fake data
    */
    const weekly_data_date_array = weekly_data.map((e) => format(new Date(e.eventDate), 'yyyy-MM-dd'));
    console.log(`create_weekly_report - ${id}: weekly_data_date_array`, weekly_data_date_array);

    const fill_up_date_array = date_helper
      .get_dates_between(new Date(start_api_date), new Date(end_api_date))
      .map((e) => formatInTimeZone(e, 'UTC', 'yyyy-MM-dd'));
    console.log(`create_weekly_report - ${id}: fill_up_date_array`, fill_up_date_array);

    for (const fill_up_date of fill_up_date_array) {
      if (weekly_data_date_array.includes(fill_up_date)) {
        console.log(`create_weekly_report: ${fill_up_date} data already exists`);
        const index = weekly_data.findIndex((e) => format(new Date(e.endApiDate), 'yyyy-MM-dd') === fill_up_date);
        if (weekly_data[index]?.heart?.reuse_heartCurrentDay) {
          weekly_data[index].heart.heartCurrentDay = structuredClone(weekly_data[index].heart.reuse_heartCurrentDay) as Heart[];
          weekly_data[index].steps.stepsCurrentDay = structuredClone(weekly_data[index].steps.reuse_stepsCurrentDay) as Steps[];
          weekly_data[index].heartStepsAnomaly = structuredClone(weekly_data[index].reuse_heartStepsAnomaly) as GMM_Anomaly[] | null;
          weekly_data[index].tanakaAnomaly = structuredClone(weekly_data[index].reuse_tanakaAnomaly) as Tanaka_Anomaly[] | null;
        }
      } else {
        console.log(`create_weekly_report - ${id}: ${fill_up_date} filling up data`);

        weekly_data.push({
          heart: { heartCurrentDay: activity_helper.heart_steps_timeseries(Api.HEART, [], '00:00:00', false, true, null) },
          steps: { stepsCurrentDay: activity_helper.heart_steps_timeseries(Api.STEPS, [], '00:00:00', false, true, steps_fill_value) },
          spo2: { spo27Day: activity_helper.spo2_slice(activity_helper.spo2_timeseries([], fill_up_date), 7) },
          sleep: { sleep7Day: activity_helper.sleep_slice(activity_helper.sleep_timeseries([], fill_up_date), 7) },
          hrv: { hrv7Day: activity_helper.hrv_slice(activity_helper.hrv_timeseries([], fill_up_date), 7) },
          temp: { temp7Day: activity_helper.temp_slice(activity_helper.temp_timeseries([], fill_up_date), 7) },
          heartStepsAnomaly: null,
          tanakaAnomaly: null,
          startApiDate: fill_up_date,
          endApiDate: fill_up_date,
          eventDate: formatInTimeZone(new Date(fill_up_date), 'UTC', 'MM/dd/yyyy'),
        });
      }
    }

    weekly_data.sort((a, b) => {
      return new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime();
    });

    /*
    add date in label
    */
    for (let i = 0; i < weekly_data.length; i++) {
      const startApiDate = formatInTimeZone(new Date(weekly_data[i].startApiDate), 'UTC', 'yyyy-MM-dd');
      const endApiDate = formatInTimeZone(new Date(weekly_data[i].endApiDate), 'UTC', 'yyyy-MM-dd');
      console.log(`create_weekly_report - ${id}: modifying label, startApiDate :${startApiDate} endApiDate: ${endApiDate}`);

      let heart = weekly_data[i].heart.heartCurrentDay;
      let steps = weekly_data[i].steps.stepsCurrentDay;

      if (!heart) continue;

      const heartzeroindex = heart.findIndex((e) => e.time === '00:00');

      if (heart?.length) {
        heart = heart.map((e, i) => {
          if (i < heartzeroindex) return { time: `${startApiDate} ${e.time}`, value: e.value };
          else if (i >= heartzeroindex) return { time: `${endApiDate} ${e.time}`, value: e.value };
          else return { time: `${endApiDate} ${e.time}`, value: e.value };
        });
      }

      if (steps?.length) {
        steps = steps.map((e, i) => {
          if (i < heartzeroindex) return { time: `${startApiDate} ${e.time}`, value: e.value };
          else if (i >= heartzeroindex) return { time: `${endApiDate} ${e.time}`, value: e.value };
          else return { time: `${endApiDate} ${e.time}`, value: e.value };
        });
      }

      weekly_data[i].heart.heartCurrentDay = heart;
      weekly_data[i].steps.stepsCurrentDay = steps;
    }

    /*
    compute heart, steps, anomaly data
    */
    console.log(`create_weekly_report - ${id}: computing heart, steps, anomaly data`);
    const combined_heart_array: { time: string; value: number | null; isGMMAnomaly: boolean; isTanakaAnomaly: boolean }[] = [];
    const combined_steps_array: { time: string; value: number | null; isGMMAnomaly: boolean; isTanakaAnomaly: boolean }[] = [];
    const chunk_size = 15;
    const anomaly_factor = 10;

    for (let i = 0; i < weekly_data.length; i++) {
      /*
      updating weekly_data for heart and steps with isAnomaly key
      */

      /*
      computing anomaly data
      */
      if (weekly_data[i]?.heartStepsAnomaly || weekly_data[i]?.tanakaAnomaly) {
        const gmm_anomaly_arr = weekly_data[i].heartStepsAnomaly ?? [];
        const tanaka_anomaly_arr = weekly_data[i].tanakaAnomaly ?? [];

        const heart = weekly_data[i].heart.heartCurrentDay.map((e) => {
          const match_gmm_index = gmm_anomaly_arr.findIndex((o) => e.time.includes(o.time));
          const match_tanaka_tndex = tanaka_anomaly_arr.findIndex((o) => e.time.includes(o.time));
          return {
            time: e.time,
            value: e.value,
            isGMMAnomaly: match_gmm_index === -1 ? false : true,
            isTanakaAnomaly: match_tanaka_tndex === -1 ? false : true,
          };
        });

        const steps = weekly_data[i].steps.stepsCurrentDay.map((e) => {
          const match_gmm_index = gmm_anomaly_arr.findIndex((o) => e.time.includes(o.time));
          const match_tanaka_tndex = tanaka_anomaly_arr.findIndex((o) => e.time.includes(o.time));
          return {
            time: e.time,
            value: e.value,
            isGMMAnomaly: match_gmm_index === -1 ? false : true,
            isTanakaAnomaly: match_tanaka_tndex === -1 ? false : true,
          };
        });

        weekly_data[i].heart.heartCurrentDay = heart;
        weekly_data[i].steps.stepsCurrentDay = steps;
      }

      /*
      computing heart, steps data
      */
      const heart = weekly_data?.[i]?.heart?.heartCurrentDay;
      const steps = weekly_data?.[i]?.steps?.stepsCurrentDay;

      if (heart?.length || steps?.length) {
        let length = 0;
        if (heart?.length) length = heart?.length;
        if (steps?.length) length = steps?.length;
        for (let j = 0; j < length; j += chunk_size) {
          const heart_chunk = heart?.length ? heart.slice(j, j + chunk_size) : [];
          const steps_chunk = steps?.length ? steps.slice(j, j + chunk_size) : [];

          let heart_unified_value;
          let steps_unified_value;
          let is_gmm_anomaly = false;
          let is_tanaka_anomaly = false;

          const heart_filtered = heart_chunk.filter((e) => e.value) as {
            time: string;
            value: number;
            isGMMAnomaly: boolean;
            isTanakaAnomaly: boolean;
          }[];
          const steps_filtered = steps_chunk.filter((e) => e.value) as {
            time: string;
            value: number;
            isGMMAnomaly: boolean;
            isTanakaAnomaly: boolean;
          }[];

          if (!heart_filtered.length) {
            heart_unified_value = null;
          } else {
            if (weekly_data[i].heartStepsAnomaly) {
              const anomaly_count = heart_filtered.reduce((acc, curr) => {
                if (curr.isGMMAnomaly) return acc + 1;
                return acc;
              }, 0);
              if (anomaly_count >= anomaly_factor) is_gmm_anomaly = true;
            }
            if (weekly_data[i].tanakaAnomaly) {
              const anomaly_count = heart_filtered.reduce((acc, curr) => {
                if (curr.isTanakaAnomaly) return acc + 1;
                return acc;
              }, 0);
              if (anomaly_count >= anomaly_factor) is_tanaka_anomaly = true;
            }
            heart_unified_value = Math.round(heart_filtered.reduce((acc, curr) => acc + curr.value, 0) / heart_filtered.length);
          }

          if (!steps_filtered.length) {
            steps_unified_value = steps_fill_value;
          } else {
            /*
            steps anomaly is synchronous with heart
            */
            steps_unified_value = Math.round(steps_filtered.reduce((acc, curr) => acc + curr.value, 0) / steps_filtered.length);
          }

          combined_heart_array.push({
            time: heart_chunk[0].time,
            value: heart_unified_value as number,
            isGMMAnomaly: is_gmm_anomaly,
            isTanakaAnomaly: is_tanaka_anomaly,
          });
          combined_steps_array.push({
            time: heart_chunk[0].time,
            value: steps_unified_value,
            isGMMAnomaly: is_gmm_anomaly,
            isTanakaAnomaly: is_tanaka_anomaly,
          });
        }
      }
    }

    const combined_gmm_anomaly_array = combined_heart_array
      .map((e, i) => {
        if (e.isGMMAnomaly) {
          return {
            time: e.time,
            heart: e.value,
            steps: combined_steps_array[i].value,
          };
        }
        return null;
      })
      .filter((e) => e) as GMM_Anomaly[];

    const combined_tanaka_anomaly_array = combined_heart_array
      .map((e, i) => {
        if (e.isTanakaAnomaly) {
          return {
            time: e.time,
            value: e.value,
          };
        }
        return null;
      })
      .filter((e) => e) as Tanaka_Anomaly[];

    /*
    computing data to make data object
    */
    console.log(`create_weekly_report - ${id}: computing data to make weekly data object`);

    /*
    heart filtering for data
    */
    const heart_data = combined_heart_array;
    const heart_stats: Stats = activity_helper.stats(heart_data.map((e) => e.value).filter((e) => e) as number[], 0);

    /*
    steps filtering for data
    */
    const steps_data = combined_steps_array;
    const steps_stats: Stats = activity_helper.stats(
      steps_data.map((e) => e.value).filter((e) => e !== null && e !== undefined) as number[],
      0
    );

    /*
    spo2 filtering for data
    */
    const spo2_data: Spo2[] = [];

    /*
    sleep filtering for data
    */
    const sleep_data: Sleep[] = [];

    /*
    hrv filtering for data
    */
    const hrv_data: HRV[] = [];

    /*
    temp filtering for data
    */
    const temp_data: Temp[] = [];

    let temperature_support = true;
    if (source_system === Source_System.APPLEWATCH) {
      console.log(`create_weekly_report - ${id}: checking for temperature support`);
      temperature_support = report_helper.applewatch_temperature_support(device_factory_model_raw_name);
    }

    /*
    cumulative filtering for data
    */
    for (const data of weekly_data) {
      spo2_data.push(data.spo2.spo27Day.at(-1) as Spo2);
      sleep_data.push(data.sleep.sleep7Day.at(-1) as Sleep);
      hrv_data.push(data.hrv.hrv7Day.at(-1) as HRV);
      temp_data.push(data.temp.temp7Day.at(-1) as Temp);
    }

    /* 
    stats
    */
    const spo2_stats: Stats = activity_helper.stats(spo2_data.map((e) => e.value.avg).filter((e) => e) as number[], 1);
    const sleep_stats: Stats = activity_helper.stats(sleep_data.map((e) => e.minutesAsleep).filter((e) => e) as number[], 0);
    const hrv_stats: Stats = activity_helper.stats(hrv_data.map((e) => e.value.dailyRmssd).filter((e) => e) as number[], 0);
    const temp_stats: Stats = activity_helper.stats(temp_data.map((e) => e.value.nightlyRelative).filter((e) => e) as number[], 1);

    /*
    heart-steps anomaly filtering for data
    */
    const gmm_anomaly = combined_gmm_anomaly_array.length ? combined_gmm_anomaly_array : null;
    const tanaka_anomaly = combined_tanaka_anomaly_array.length ? combined_tanaka_anomaly_array : null;

    /*
    creating weekly data object
    */
    console.log(`create_weekly_report - ${id}: creating weekly report data object`);
    const data: Weekly_Report_Data = {
      heart: {
        heartCurrentDay: heart_data,
        heartCurrentDayStats: heart_stats,
      },
      steps: {
        stepsCurrentDay: steps_data,
        stepsCurrentDayStats: steps_stats,
      },
      sleep: {
        sleep7Day: sleep_data,
        sleep7DayStats: sleep_stats,
      },
      spo2: {
        spo27Day: spo2_data,
        spo27DayStats: spo2_stats,
      },
      hrv: {
        hrv7Day: hrv_data,
        hrv7DayStats: hrv_stats,
      },
      temp: {
        temp7Day: temp_data,
        temp7DayStats: temp_stats,
      },
      heartStepsAnomaly: gmm_anomaly,
      tanakaAnomaly: tanaka_anomaly,
      id: id,
      userId: user_id,
      dataId: uuid,
      name,
      timezone: timezone,
      sourceSystem: source_system,
      startApiDate: start_api_date,
      endApiDate: end_api_date,
      reportZonedTime: formatInTimeZone(_zoned_time, 'UTC', 'yyyy-MM-dd HH:mm:ss'),
      reportUTCtime: report_utc_time,
      dataURI: undefined,
      reportURI: undefined,
      reportType: config.report.weekly_report.type,
      reportName: config.report.weekly_report.name,
      reportId: report_helper.report_id(id, formatInTimeZone(end_api_date_object, 'UTC', 'MM/dd')),
      datePublished: formatInTimeZone(_zoned_time, 'UTC', 'MM/dd/yyyy'),
      eventDate: `${formatInTimeZone(start_api_date_object, 'UTC', 'MM/dd/yyyy')} - ${formatInTimeZone(
        end_api_date_object,
        'UTC',
        'MM/dd/yyyy'
      )}`,
      pdfDate: `${start_api_date} - ${end_api_date}`,
      units: {
        heart: Activity_Units.HEART,
        steps: Activity_Units.STEPS,
        sleep: Activity_Units.SLEEP,
        spo2: Activity_Units.SPO2,
        hrv: Activity_Units.HRV,
        temp: Activity_Units.TEMP,
      },
      version: config.version,
      anomalyType: [],
      isTemperatureSupported: {
        value: temperature_support,
        text: config.message.temperature_support,
      },
    };

    /*
    check if weekly dataset is empty
    */
    console.log(`create_weekly_report - ${id}: checking if weekly report data is valid/empty`);
    const heart_empty = data.heart.heartCurrentDay.every((e) => e.value === null);
    const steps_empty = data.steps.stepsCurrentDay.every((e) => e.value === null || e.value === 0);
    const spo2_empty = data.spo2.spo27Day.every((e) => e.value.avg === null);
    const sleep_empty = data.sleep.sleep7Day.every((e) => e.minutesAsleep === null);
    const hrv_empty = data.hrv.hrv7Day.every((e) => e.value.dailyRmssd === null);
    const temp_empty = data.temp.temp7Day.every((e) => e.value.nightlyRelative === null);
    console.log(`create_weekly_report - ${id}:`, { heart_empty, steps_empty, spo2_empty, sleep_empty, hrv_empty, temp_empty });
    if (heart_empty && steps_empty && spo2_empty && sleep_empty && hrv_empty && temp_empty) {
      console.log(`create_weekly_report - ${id}: dataset empty or invalid, not generating report`);
      return;
    }

    /*
    create data buffer
    */
    console.log(`create_weekly_report - ${id}: creating data buffer`);
    const data_buffer = report_helper.create_buffer(data);

    /*
    create pdf buffer
    */
    console.log(`create_weekly_report - ${id}: creating pdf buffer`);
    const pdf_buffer = await create_pdf(data, 'report.html');
    if (!pdf_buffer) {
      throw new Error('create_weekly_report: pdf_buffer not available');
    }

    /*
    screenshot
    */
    console.log(`create_weekly_report - ${id}: creating screenshot`);
    const sc = await screenshot(data, 'screenshot.html');
    if (!sc) {
      throw new Error('create_weekly_report: screenshot not available');
    }

    /*
    upload data
    */
    console.log(`create_weekly_report - ${id}: uploading data`);
    const data_uri = await upload_data(data_buffer, data.dataId);
    data.dataURI = data_uri;

    /*
    upload report
    */
    console.log(`create_weekly_report - ${id}: uploading report`);
    const report_uri = await upload_report(
      id,
      pdf_buffer,
      format(parse(data.datePublished, 'MM/dd/yyyy', new Date()), 'yyyy-MM-dd'),
      null,
      data.reportId,
      data.dataId,
      config.report.weekly_report.sqs_name,
      config.aws.sqs.set_url,
      `:${config.report.weekly_report.tag_name}`,
      '',
      null,
      null,
      sc,
      source_system,
      file_prefix,
      timezone,
      user_id
    );
    data.reportURI = report_uri;

    if (config.dev_mode) {
      console.log(`create_weekly_report - ${id}: creating local json data`);
      report_helper.create_json([{ data, name: `${data.reportType}_${data.id}_${data.pdfDate}` }]);
    }

    /*
    end of line
    */
  } catch (error) {
    console.log(`create_weekly_report - ${id}: error`, error);
    await notify(`create_weekly_report - ${id}: error`, error);
  } finally {
    console.log(`create_weekly_report - ${id}: end`);
  }
}
