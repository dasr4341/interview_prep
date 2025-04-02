import { subDays } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';

import { api } from '../../api/api.js';
import { config } from '../../config/config.js';
import { Api, Node_Events, Source_System, Timezone } from '../../enum/enum.js';
import { activity_helper } from '../../helper/activity_helper.js';
import { Sleep } from '../../interface/activity_interface.js';
import { SD_Anomaly, Stats } from '../../interface/report_interface.js';
import { node_event } from '../../utils/event_util.js';
import { dead_letter, notify } from '../../utils/upload_util.js';

export async function sleep_anomaly(
  id: string,
  access_token: string,
  source_system: Source_System,
  timezone: Timezone,
  date: Date,
  past_daily_data_list: any[]
) {
  try {
    console.log(`sleep_anomaly - ${id}: start`, { date });

    /*
    api call
    */
    const start_date = formatInTimeZone(subDays(date, 29), 'UTC', 'yyyy-MM-dd');
    const end_date = formatInTimeZone(date, 'UTC', 'yyyy-MM-dd');
    const [sleep_api_response] = await Promise.allSettled([api(id, access_token, source_system, Api.SLEEP, { start_date, end_date })]);

    if (sleep_api_response.status === 'rejected') {
      console.log('sleep_anomaly: special report sleep api rejected');
      await dead_letter(id, timezone, config.report.special_report.sqs_name, 'special report sleep api rejected');
      return { apiData: false };
    }

    /*
    api failed
    */
    if (sleep_api_response.status === 'fulfilled') {
      const is_429 = [sleep_api_response].some((e) => e.value?.code === 429);
      if (is_429) {
        console.log('sleep_anomaly: special report sleep 429 api error');
        await node_event(Node_Events.SPECIAL_REPORT_429, { id: id, date: new Date() });
      }

      const is_api_failed = [sleep_api_response].every((e) => e.value?.code !== 200);
      if (is_api_failed) {
        console.log('sleep_anomaly: special report sleep api failed');
        await dead_letter(id, timezone, config.report.special_report.sqs_name, 'special report api failed');
        return { apiData: false };
      }
    }

    /*
    empty sleep data
    */
    let sleep_data: Sleep[] = sleep_api_response?.value?.data ?? [];
    if (!sleep_data.length) {
      console.log('sleep_anomaly: invalid or empty data set');
      return { apiData: false };
    }

    /*
    data formatting
    */
    sleep_data = activity_helper.sleep_timeseries(sleep_data, formatInTimeZone(date, 'UTC', 'yyyy-MM-dd'));

    if (!sleep_data.at(-1)?.minutesAsleep) {
      console.log(`sleep_anomaly - ${id}: sleep data not available for date: ${sleep_data.at(-1)?.dateOfSleep}`);
      return { apiData: false };
    }

    /* medical anomaly */
    let sleep_medical_anomaly = false;
    if ((sleep_data.at(-1)?.minutesAsleep as number) < config.sleep.sleep_level) {
      sleep_medical_anomaly = true;
    }

    /*
    sd anomaly
    */
    const sleep_sd_anomaly: SD_Anomaly = activity_helper.sleep_anomaly_15days(sleep_data);

    if (sleep_sd_anomaly.isAnomaly) {
      sleep_medical_anomaly = false;
    }

    if (!sleep_sd_anomaly.isAnomaly && sleep_sd_anomaly.isRange) {
      console.log(`sleep_anomaly - ${id}: sleep range found but no anomaly, not proceeding further`);
      return { apiData: true };
    }

    /*
    computing both anomalies
    */
    if (!sleep_sd_anomaly.isAnomaly && !sleep_medical_anomaly) {
      console.log(
        `sleep_anomaly - ${id}: sleep_medical_anomaly - ${sleep_medical_anomaly}, sleep_sd_anomaly: ${sleep_sd_anomaly.isAnomaly}`
      );
      return { apiData: true };
    }

    /*
    creating data for report
    */
    let sleep_7day_data: Sleep[] = [];
    if (sleep_sd_anomaly.isAnomaly) {
      sleep_7day_data = activity_helper.sleep_slice(sleep_data, 16);
    } else {
      sleep_7day_data = activity_helper.sleep_slice(sleep_data, 7);
    }

    sleep_7day_data[sleep_7day_data.length - 1].isAnomaly = true;

    const sleep_stats: Stats = activity_helper.stats(sleep_7day_data.map((e) => e.minutesAsleep).filter((e) => e) as number[], 0);

    /* 
    sleep bound range calculation
    */
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
    past daily data
    */
    for (const sleep of sleep_7day_data) {
      const date = sleep.dateOfSleep;
      const index = past_daily_data_list.findIndex((e) => e.pdfDate === date);
      if (index === -1) {
        console.log(`past_daily_data_list - ${id}: sleep data not available for date: ${date}`);
      } else {
        sleep.isAnomaly = past_daily_data_list.at(index)?.sleep?.sleep7Day?.at(-1)?.isAnomaly ?? false;
      }
    }

    return {
      sleep: {
        sleep7Day: sleep_7day_data,
        sleep7DayStats: sleep_stats,
        lowerBound: sleep_lower_bound,
        upperBound: sleep_upper_bound,
        mean: sleep_sd_anomaly.mean,
        sd: sleep_sd_anomaly.sd,
        sdAnomaly: sleep_sd_anomaly,
      },
      apiData: true,
    };
  } catch (error) {
    console.log(`sleep_anomaly - ${id}: error`, error);
    await notify(`sleep_anomaly - ${id}: error`, error);
  }
}
