import { subDays } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';

import { api } from '../../api/api.js';
import { config } from '../../config/config.js';
import { Api, Node_Events, Source_System, Timezone } from '../../enum/enum.js';
import { activity_helper } from '../../helper/activity_helper.js';
import { Spo2 } from '../../interface/activity_interface.js';
import { SD_Anomaly, Stats } from '../../interface/report_interface.js';
import { node_event } from '../../utils/event_util.js';
import { dead_letter, notify } from '../../utils/upload_util.js';

export async function spo2_anomaly(
  id: string,
  access_token: string,
  source_system: Source_System,
  timezone: Timezone,
  date: Date,
  past_daily_data_list: any[]
) {
  try {
    console.log(`spo2_anomaly - ${id}: start`, { date });

    /*
    api call
    */
    const start_date = formatInTimeZone(subDays(date, 29), 'UTC', 'yyyy-MM-dd');
    const end_date = formatInTimeZone(date, 'UTC', 'yyyy-MM-dd');
    const [spo2_api_response] = await Promise.allSettled([api(id, access_token, source_system, Api.SPO2, { start_date, end_date })]);

    if (spo2_api_response.status === 'rejected') {
      console.log('spo2_anomaly: special report spo2 api rejected');
      await dead_letter(id, timezone, config.report.special_report.sqs_name, 'special report spo2 api rejected');
      return { apiData: false };
    }

    /*
    api failed
    */
    if (spo2_api_response.status === 'fulfilled') {
      const is_429 = [spo2_api_response].some((e) => e.value?.code === 429);
      if (is_429) {
        console.log('spo2_anomaly: special report spo2 429 api error');
        await node_event(Node_Events.SPECIAL_REPORT_429, { id: id, date: new Date() });
      }

      const is_api_failed = [spo2_api_response].every((e) => e.value?.code !== 200);
      if (is_api_failed) {
        console.log('spo2_anomaly: special report spo2 api failed');
        await dead_letter(id, timezone, config.report.special_report.sqs_name, 'special report api failed');
        return { apiData: false };
      }
    }

    /*
    empty spo2 data
    */
    let spo2_data: Spo2[] = spo2_api_response?.value?.data ?? [];
    if (!spo2_data.length) {
      console.log('spo2_anomaly: invalid or empty data set');
      return { apiData: false };
    }

    /* 
    data formatting
    */
    spo2_data = activity_helper.spo2_timeseries(spo2_data, formatInTimeZone(date, 'UTC', 'yyyy-MM-dd'));

    if (!spo2_data.at(-1)?.value?.avg) {
      console.log(`spo2_anomaly - ${id}: spo2 data not available for date: ${spo2_data.at(-1)?.dateTime}`);
      return { apiData: false };
    }

    /* medical anomaly */
    let spo2_medical_anomaly = false;
    if ((spo2_data.at(-1)?.value.avg as number) < config.spo2.spo2_level) {
      spo2_medical_anomaly = true;
    }

    /*
    sd anomaly
    */
    const spo2_sd_anomaly: SD_Anomaly = activity_helper.spo2_anomaly_15days(spo2_data);

    if (spo2_sd_anomaly.isAnomaly) {
      spo2_medical_anomaly = false;
    }

    if (!spo2_sd_anomaly.isAnomaly && spo2_sd_anomaly.isRange) {
      console.log(`spo2_anomaly - ${id}: spo2 range found but no anomaly, not proceeding further`);
      return { apiData: true };
    }

    /*
    computing both anomalies
    */
    if (!spo2_sd_anomaly.isAnomaly && !spo2_medical_anomaly) {
      console.log(`spo2_anomaly - ${id}: spo2_medical_anomaly - ${spo2_medical_anomaly}, spo2_sd_anomaly: ${spo2_sd_anomaly.isAnomaly}`);
      return { apiData: true };
    }

    /*
    creating data for report
    */
    let spo2_7day_data: Spo2[] = [];
    if (spo2_sd_anomaly.isAnomaly) {
      spo2_7day_data = activity_helper.spo2_slice(spo2_data, 16);
    } else {
      spo2_7day_data = activity_helper.spo2_slice(spo2_data, 7);
    }

    spo2_7day_data[spo2_7day_data.length - 1].isAnomaly = true;

    const spo2_stats: Stats = activity_helper.stats(spo2_7day_data.map((e) => e.value.avg).filter((e) => e) as number[], 1);

    /* 
    spo2 bound range calculation
    */
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
    past daily data
    */
    for (const spo2 of spo2_7day_data) {
      const date = spo2.dateTime;
      const index = past_daily_data_list.findIndex((e) => e.pdfDate === date);
      if (index === -1) {
        console.log(`Daily Report - ${id}: spo2 data not available for date: ${date}`);
      } else {
        spo2.isAnomaly = past_daily_data_list.at(index)?.spo2?.spo27Day?.at(-1)?.isAnomaly ?? false;
      }
    }

    return {
      spo2: {
        spo27Day: spo2_7day_data,
        spo27DayStats: spo2_stats,
        lowerBound: spo2_lower_bound,
        upperBound: spo2_upper_bound,
        mean: spo2_sd_anomaly.mean,
        sd: spo2_sd_anomaly.sd,
        sdAnomaly: spo2_sd_anomaly,
      },
      apiData: true,
    };
  } catch (error) {
    console.log(`spo2_anomaly - ${id}: error`, error);
    await notify(`spo2_anomaly - ${id}: error`, error);
  }
}
