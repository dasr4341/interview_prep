import { Handler, SQSEvent } from 'aws-lambda';
import { differenceInMinutes, format, parse, subDays } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import { v4 } from 'uuid';

import { api } from './api/api.js';
import { config } from './config/config.js';
import { DataController } from './db/dynamodb/data_controller.js';
import { ReportController } from './db/dynamodb/report_controller.js';
import { Activity_Units, Anomaly_Type, Api, Source_System, Timezone } from './enum/enum.js';
import { report_helper } from './helper/report_helper.js';
import { zoned_time } from './helper/timezone_helper.js';
import { get_profile } from './helper/user_helper.js';
import { Special_Report_Data } from './interface/report_interface.js';
import { anomaly_date_create } from './report/special_report/anomaly_date_create.js';
import { heart_steps_anomaly } from './report/special_report/heart_steps_anomaly.js';
import { hrv_anomaly } from './report/special_report/hrv_anomaly.js';
import { sleep_anomaly } from './report/special_report/sleep_anomaly.js';
import { spo2_anomaly } from './report/special_report/spo2_anomaly.js';
import { temp_anomaly } from './report/special_report/temp_anomaly.js';
import { download_data } from './utils/download_util.js';
import { create_pdf, screenshot } from './utils/pdf_util.js';
import { notify, upload_data, upload_report } from './utils/upload_util.js';

export const handler: Handler = async (event: SQSEvent) => {
  try {
    console.log('handler special_report', event);

    const records = event.Records;
    for await (const record of records) {
      const body = JSON.parse(record.body);

      for await (const user of body) {
        const { id, access_token = '', source_system = Source_System.FITBIT, name, dob, file_prefix = null, user_id } = user;

        if (name.includes('null')) {
          console.log('handler special_report: some parameters are missing', body);
          continue;
        }

        await special_report(id, access_token, source_system, name, dob, file_prefix, user_id);
      }
    }
  } catch (error) {
    console.log('handler special_report: error', error);
    await notify('handler special_report: error', error);
  }
};

export async function special_report(
  id: string,
  access_token: string,
  source_system: Source_System,
  name: string,
  dob: string,
  file_prefix: string | null,
  user_id: string
) {
  try {
    console.log(`special_report - ${id}: start`, { id, access_token, source_system, name, dob, file_prefix, user_id });

    /* 
    db controller
    */
    const report_controller = new ReportController();
    const data_controller = new DataController();

    /*
    check for user in db
    */
    console.log(`special_report - ${id}: checking for user in db: ${config.aws.dynamodb.report_table}`);

    const user = await report_controller.get(id);
    if (!user) await report_controller.create(id);

    /*
    set timezone, age
    */
    let user_timezone: Timezone | null = null;
    let user_dob: string | null = null;
    let age = null;

    /*
    getting profile details and setting timezone, dob
    */
    const user_profile = await get_profile(id, access_token, source_system);
    user_timezone = user_profile.timezone;
    user_dob = user_profile.dob;

    if (!user_timezone) {
      console.log(`special_report - ${id}: timezone not avaialble`);
      return;
    }

    /*
    if dob available from core update it
    */
    if (!user_dob && dob) {
      user_dob = report_helper.fix_core_dob(dob);
      await report_controller.update(id, { user_id: id, dob: dob });
    }

    /*
    set age
    */
    if (user_dob) age = report_helper.get_age(user_dob);

    /* setting global date */
    const _zoned_time = await zoned_time(user_timezone);
    const report_utc_time = new Date();
    console.log(`special_report - ${id}: current zoned runtime:`, _zoned_time);

    /*
    fitbit specific tasks
    */
    if (source_system === Source_System.FITBIT) {
      let fitbit_rate_limit_time: null | undefined | string | Date = user?.fitbit_rate_limit_time;

      if (fitbit_rate_limit_time) {
        fitbit_rate_limit_time = new Date(fitbit_rate_limit_time);
        const delta = differenceInMinutes(new Date(), fitbit_rate_limit_time);
        if (delta > 70) {
          console.log(`special_report - ${id}: fitbit_rate_limit_time delta ${delta} is > 70, report generate continue`);
          await report_controller.update(id, { user_id: id, fitbit_rate_limit_time: null });
        } else {
          console.log(`special_report - ${id}: fitbit_rate_limit_time delta ${delta} is < 70, report generate paused`);
          return;
        }
      }
    }

    /*
    device sync time
    */
    let last_device_sync_time: Date | null = null;
    const device_api_response = await api(id, access_token, source_system, Api.DEVICE, {});
    last_device_sync_time = device_api_response?.data?.raw_device_time;
    if (!last_device_sync_time) last_device_sync_time = _zoned_time;
    console.log(`special_report - ${id}: last_device_sync_time`, last_device_sync_time);

    /*
    anomaly date creation
    */
    const anomaly_date_list = await anomaly_date_create(id, user, _zoned_time);

    /*
    anomaly computation
    */
    for (const [loop_index, anomaly_date] of anomaly_date_list.entries()) {
      const start_date_time = new Date(anomaly_date[0]);
      const end_date_time = new Date(anomaly_date[1]);
      console.log(`\nspecial_report - ${id}: anomaly_date`, anomaly_date);

      /*
      last_device_sync_time should be more than start_date_time
      */
      if (last_device_sync_time.getTime() < start_date_time.getTime()) {
        console.log(`special_report - ${id}: last_device_sync_time is less than start_date_time`, {
          last_device_sync_time,
          start_date_time,
          end_date_time,
        });

        continue;
      }

      /*
      heart-steps
      */
      let heart_steps = undefined;
      let last_heart_steps_anomalytime: Date | undefined = undefined;

      if (user?.last_heart_steps_anomalytime) {
        last_heart_steps_anomalytime = new Date(user?.last_heart_steps_anomalytime);
      } else {
        last_heart_steps_anomalytime = subDays(new Date(formatInTimeZone(end_date_time, 'UTC', 'yyyy-MM-dd')), 1);
      }
      console.log(`special_report - ${id}: last_heart_steps_anomalytime`, last_heart_steps_anomalytime);

      if (formatInTimeZone(last_heart_steps_anomalytime, 'UTC', 'yyyy-MM-dd') === formatInTimeZone(end_date_time, 'UTC', 'yyyy-MM-dd')) {
        console.log(`special_report - ${id}: end_date_time and last_heart_steps_anomalytime is same`);
      } else {
        heart_steps = await heart_steps_anomaly(id, access_token, source_system, age, user_timezone, start_date_time, end_date_time);
      }

      if (heart_steps?.heartStepsAnomaly || heart_steps?.tanakaAnomaly) {
        await report_controller.update(id, { user_id: id, last_heart_steps_anomalytime: end_date_time.toISOString() });
        last_heart_steps_anomalytime = end_date_time;
      }

      /*
      sleep-spo2-hrv-temp
      */
      let spo2 = undefined;
      let sleep = undefined;
      let hrv = undefined;
      let temp = undefined;
      let last_spo2_sleep_hrv_temp_runtime: Date | undefined = undefined;

      if (user?.last_spo2_sleep_hrv_temp_runtime) {
        last_spo2_sleep_hrv_temp_runtime = new Date(user?.last_spo2_sleep_hrv_temp_runtime);
      } else {
        last_spo2_sleep_hrv_temp_runtime = subDays(new Date(formatInTimeZone(end_date_time, 'UTC', 'yyyy-MM-dd')), 1);
      }
      console.log(`special_report - ${id}: last_spo2_sleep_hrv_temp_runtime`, last_spo2_sleep_hrv_temp_runtime);

      if (
        formatInTimeZone(last_spo2_sleep_hrv_temp_runtime, 'UTC', 'yyyy-MM-dd') === formatInTimeZone(end_date_time, 'UTC', 'yyyy-MM-dd')
      ) {
        console.log(`special_report - ${id}: end_date_time and last_spo2_sleep_hrv_temp_runtime  is same`);
      } else {
        /*
        get past daily report generated data
        */
        console.log(`special_report - ${id}: getting past generated data for daily report`);
        const data_start_date = formatInTimeZone(subDays(new Date(end_date_time), 15), 'UTC', 'yyyy-MM-dd');
        const data_end_date = formatInTimeZone(subDays(new Date(end_date_time), 1), 'UTC', 'yyyy-MM-dd');
        console.log(`special_report - ${id}: past generated data for dates`, { data_start_date, data_end_date });

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

        if (!past_daily_data_list.length) {
          console.log(`special_report - ${id}: past daily data not available`);
        }

        spo2 = await spo2_anomaly(id, access_token, source_system, user_timezone, end_date_time, past_daily_data_list);
        sleep = await sleep_anomaly(id, access_token, source_system, user_timezone, end_date_time, past_daily_data_list);
        hrv = await hrv_anomaly(id, access_token, source_system, user_timezone, end_date_time, past_daily_data_list);
        temp = await temp_anomaly(id, access_token, source_system, user_timezone, end_date_time, past_daily_data_list);
      }

      /*
      creating data for report
      */
      if (heart_steps?.heartStepsAnomaly || heart_steps?.tanakaAnomaly || spo2?.spo2 || sleep?.sleep || hrv?.hrv || temp?.temp) {
        console.log(`\nspecial_report - ${id}: data available, generating report`);
        const data: Special_Report_Data = {
          ...heart_steps,
          ...spo2,
          ...sleep,
          ...hrv,
          ...temp,
          id: id,
          userId: user_id,
          dataId: v4(),
          name,
          timezone: user_timezone,
          age: age,
          sourceSystem: source_system,
          startApiDate: heart_steps?.startDate ?? '',
          endApiDate: heart_steps?.endDate ?? '',
          reportZonedTime: formatInTimeZone(_zoned_time, 'UTC', 'yyyy-MM-dd HH:mm:ss'),
          reportUTCtime: report_utc_time,
          dataURI: undefined,
          reportURI: undefined,
          reportType: config.report.special_report.type,
          reportName: config.report.special_report.name,
          reportId: report_helper.report_id(id, formatInTimeZone(new Date(end_date_time), 'UTC', 'MMdd')),
          datePublished: formatInTimeZone(_zoned_time, 'UTC', 'MM/dd/yyyy'),
          eventDate: formatInTimeZone(new Date(end_date_time), 'UTC', 'MM/dd/yyyy'),
          pdfDate: formatInTimeZone(new Date(end_date_time), 'UTC', 'yyyy-MM-dd'),
          units: {
            heart: Activity_Units.HEART,
            steps: Activity_Units.STEPS,
            spo2: Activity_Units.SPO2,
            sleep: Activity_Units.SLEEP,
            hrv: Activity_Units.HRV,
            temp: Activity_Units.TEMP,
          },
          version: config.version,
          anomalyText: config.message.anomaly,
          score: -3,
          score_date: formatInTimeZone(new Date(end_date_time), 'UTC', 'yyyy-MM-dd'),
          anomalyType: undefined,
        };

        /*
        calculate biometrics score
        */
        // let score = user?.score ?? 0;
        // let score_date = user?.score_date;

        // if (score_date && score_date === data.pdfDate) {
        //   console.log(`special_report - ${id}: score: ${score} is already inserted for the date: ${score_date}`);
        // } else {
        //   score = -3;
        //   score_date = data.pdfDate;
        //   await report_controller.update(id, { user_id: id, score, score_date });
        // }

        /*
        calculate anomaly type
        */
        const anomaly_heart = data?.heartStepsAnomaly ?? data?.tanakaAnomaly;
        const report_tag_time = anomaly_heart
          ? `-${format(parse(anomaly_heart[anomaly_heart.length - 1].time, 'hh:mm a', new Date()), 'HH:mm')}`
          : '';

        const anomaly_type = [
          (heart_steps?.heartStepsAnomaly || heart_steps?.tanakaAnomaly) && Anomaly_Type.HEART,
          sleep?.sleep && Anomaly_Type.SLEEP,
          spo2?.spo2 && Anomaly_Type.SPO2,
          hrv?.hrv && Anomaly_Type.HRV,
          temp?.temp && Anomaly_Type.TEMP,
        ].filter((e) => e) as Anomaly_Type[];

        const anomaly_type_csv = anomaly_type.join(',');

        console.log(`special_report - ${id}: anomaly_type: ${anomaly_type}`);
        data.anomalyType = anomaly_type;

        const anomaly_report_time = anomaly_date_list.length === loop_index + 1 ? formatInTimeZone(new Date(), 'UTC', 'HH:mm:ss') : null;

        /*
        create data buffer
        */
        console.log(`special_report - ${id}: creating data buffer`);
        const data_buffer = report_helper.create_buffer(data);

        /*
        create pdf buffer
        */
        console.log(`special_report - ${id}: creating pdf buffer`);
        const pdf_buffer = await create_pdf(data, 'report.html');
        if (!pdf_buffer) {
          throw new Error('special_report: pdf_buffer not available');
        }

        /*
        screenshot
        */
        console.log(`special_report - ${id}: creating screenshot`);
        const sc = await screenshot(data, 'screenshot.html');
        if (!sc) {
          throw new Error('special_report: screenshot not available');
        }

        /*
        upload data
        */
        console.log(`special_report - ${id}: uploading data`);
        const data_uri = await upload_data(data_buffer, data.dataId);
        data.dataURI = data_uri;

        /*
        upload report
        */
        console.log(`special_report - ${id}: uploading report`);
        const report_uri = await upload_report(
          id,
          pdf_buffer,
          formatInTimeZone(new Date(data.eventDate), 'UTC', 'yyyy-MM-dd'),
          anomaly_report_time,
          data.reportId,
          data.dataId,
          config.report.special_report.sqs_name,
          config.aws.sqs.set_url,
          `:${config.report.special_report.tag_name}`,
          report_tag_time,
          anomaly_type_csv,
          data.score,
          sc,
          source_system,
          file_prefix,
          user_timezone,
          user_id
        );
        data.reportURI = report_uri;

        /* creating local json file */
        if (config.dev_mode) {
          console.log(`special_report - ${id}: creating local json data`);
          report_helper.create_json([{ data, name: `${data.reportType}_${data.id}_${data.pdfDate}` }]);
        }
      } else {
        console.log(`\special_report - ${id}: data not available, not generating report\n`);
      }

      /*
      update runtimes
      */
      console.log(`special_report - ${id}: updating runtimes`);
      if (spo2?.apiData || sleep?.apiData || hrv?.apiData || temp?.apiData) {
        console.log(`special_report - ${id}: updating last_spo2_sleep_hrv_temp_runtime`);
        await report_controller.update(id, { user_id: id, last_spo2_sleep_hrv_temp_runtime: end_date_time.toISOString() });
        last_spo2_sleep_hrv_temp_runtime = end_date_time;
      }

      if (heart_steps?.apiData || sleep?.apiData || spo2?.apiData || hrv?.apiData || temp?.apiData) {
        console.log(`special_report - ${id}: updating last_special_report_runtime`);
        await report_controller.update(id, { user_id: id, last_special_report_runtime: end_date_time.toISOString() });
      }
    }

    /* end of line */
  } catch (error) {
    console.log(`special_report - ${id}: error`, error);
    await notify(`special_report - ${id}: error`, error);
  } finally {
    console.log(`special_report - ${id}: end`);
  }
}
