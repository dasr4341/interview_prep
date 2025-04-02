import { subDays } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';

import { api } from '../../api/api.js';
import { config } from '../../config/config.js';
import { Api, Node_Events, Source_System, Timezone } from '../../enum/enum.js';
import { activity_helper } from '../../helper/activity_helper.js';
import { HRV } from '../../interface/activity_interface.js';
import { SD_Anomaly } from '../../interface/report_interface.js';
import { node_event } from '../../utils/event_util.js';
import { dead_letter, notify } from '../../utils/upload_util.js';

export async function hrv_anomaly(
  id: string,
  access_token: string,
  source_system: Source_System,
  timezone: Timezone,
  date: Date,
  past_daily_data_list: any[]
) {
  try {
    console.log(`hrv_anomaly - ${id}: start`, { date });

    /*
    api call
    */
    const start_date = formatInTimeZone(subDays(date, 29), 'UTC', 'yyyy-MM-dd');
    const end_date = formatInTimeZone(date, 'UTC', 'yyyy-MM-dd');
    const [hrv_api_response] = await Promise.allSettled([api(id, access_token, source_system, Api.HRV, { start_date, end_date })]);

    if (hrv_api_response.status === 'rejected') {
      console.log('hrv_anomaly: special report hrv api rejected');
      await dead_letter(id, timezone, config.report.special_report.sqs_name, 'special report hrv api rejected');
      return { apiData: false };
    }

    /*
    api failed
    */
    if (hrv_api_response.status === 'fulfilled') {
      const is_429 = [hrv_api_response].some((e) => e.value?.code === 429);
      if (is_429) {
        console.log('hrv_anomaly: special report hrv 429 api error');
        await node_event(Node_Events.SPECIAL_REPORT_429, { id: id, date: new Date() });
      }

      const is_api_failed = [hrv_api_response].every((e) => e.value?.code !== 200);
      if (is_api_failed) {
        console.log('hrv_anomaly: special report hrv api failed');
        await dead_letter(id, timezone, config.report.special_report.sqs_name, 'special report api failed');
        return { apiData: false };
      }
    }

    /*
    empty hrv data
    */
    let hrv_data: HRV[] = hrv_api_response?.value?.data ?? [];
    if (!hrv_data.length) {
      console.log('hrv_anomaly: invalid or empty data set');
      return { apiData: false };
    }

    /*
    data formatting
    */
    hrv_data = activity_helper.hrv_timeseries(hrv_data, formatInTimeZone(date, 'UTC', 'yyyy-MM-dd'));

    if (!hrv_data.at(-1)?.value?.dailyRmssd) {
      console.log(`hrv_anomaly - ${id}: hrv data not available for date: ${hrv_data.at(-1)?.dateTime}`);
      return { apiData: false };
    }

    /*
    sd anomaly
    */
    const hrv_sd_anomaly: SD_Anomaly = activity_helper.hrv_anomaly_15days(hrv_data);

    if (!hrv_sd_anomaly.isAnomaly) {
      return { apiData: true };
    }

    /*
    creating data for report
    */
    const hrv_7day_data: HRV[] = activity_helper.hrv_slice(hrv_data, 16);
    hrv_7day_data[hrv_7day_data.length - 1].isAnomaly = true;

    const hrv_stats = activity_helper.stats(hrv_7day_data.map((e) => e.value.dailyRmssd).filter((e) => e) as number[], 0);

    /* 
    hrv bound range calculation
    */
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
    past daily data
    */
    for (const hrv of hrv_7day_data) {
      const date = hrv.value.dailyRmssd;
      const index = past_daily_data_list.findIndex((e) => e.pdfDate === date);
      if (index === -1) {
        console.log(`past_daily_data_list - ${id}: hrv data not available for date: ${date}`);
      } else {
        hrv.isAnomaly = past_daily_data_list.at(index)?.hrv?.hrv7Day?.at(-1)?.isAnomaly ?? false;
      }
    }

    return {
      hrv: {
        hrv7Day: hrv_7day_data,
        hrv7DayStats: hrv_stats,
        lowerBound: hrv_lower_bound,
        upperBound: hrv_upper_bound,
        mean: hrv_sd_anomaly.mean,
        sd: hrv_sd_anomaly.sd,
        sdAnomaly: hrv_sd_anomaly,
      },
      apiData: true,
    };
  } catch (error) {
    console.log(`hrv_anomaly - ${id}: error`, error);
    await notify(`hrv_anomaly - ${id}: error`, error);
  }
}
