import { subDays } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';

import { api } from '../../api/api.js';
import { config } from '../../config/config.js';
import { Api, Node_Events, Source_System, Timezone } from '../../enum/enum.js';
import { activity_helper } from '../../helper/activity_helper.js';
import { Temp } from '../../interface/activity_interface.js';
import { SD_Anomaly } from '../../interface/report_interface.js';
import { node_event } from '../../utils/event_util.js';
import { dead_letter, notify } from '../../utils/upload_util.js';

export async function temp_anomaly(
  id: string,
  access_token: string,
  source_system: Source_System,
  timezone: Timezone,
  date: Date,
  past_daily_data_list: any[]
) {
  try {
    console.log(`temp_anomaly - ${id}: start`, { date });

    /*
    api call
    */
    const start_date = formatInTimeZone(subDays(date, 29), 'UTC', 'yyyy-MM-dd');
    const end_date = formatInTimeZone(date, 'UTC', 'yyyy-MM-dd');
    const [temp_api_response] = await Promise.allSettled([api(id, access_token, source_system, Api.TEMP, { start_date, end_date })]);

    if (temp_api_response.status === 'rejected') {
      console.log('temp_anomaly: special report temp api rejected');
      await dead_letter(id, timezone, config.report.special_report.sqs_name, 'special report temp api rejected');
      return { apiData: false };
    }

    /*
    api failed
    */
    if (temp_api_response.status === 'fulfilled') {
      const is_429 = [temp_api_response].some((e) => e.value?.code === 429);
      if (is_429) {
        console.log('temp_anomaly: special report temp 429 api error');
        await node_event(Node_Events.SPECIAL_REPORT_429, { id: id, date: new Date() });
      }

      const is_api_failed = [temp_api_response].every((e) => e.value?.code !== 200);
      if (is_api_failed) {
        console.log('temp_anomaly: special report temp api failed');
        await dead_letter(id, timezone, config.report.special_report.sqs_name, 'special report api failed');
        return { apiData: false };
      }
    }

    /*
    empty hrv data
    */
    let temp_data: Temp[] = temp_api_response?.value?.data ?? [];
    if (!temp_data.length) {
      console.log('temp_anomaly: invalid or empty data set');
      return { apiData: false };
    }

    /*
    data formatting
    */
    temp_data = activity_helper.temp_timeseries(temp_data, formatInTimeZone(date, 'UTC', 'yyyy-MM-dd'));

    if (!temp_data.at(-1)?.value?.nightlyRelative) {
      console.log(`temp_anomaly - ${id}: temp data not available for date: ${temp_data.at(-1)?.dateTime}`);
      return { apiData: false };
    }

    /*
    sd anomaly
    */
    const temp_sd_anomaly: SD_Anomaly = activity_helper.temp_anomaly_15days(temp_data);

    if (!temp_sd_anomaly.isAnomaly) {
      return { apiData: true };
    }

    /*
    creating data for report
    */
    const temp_7day_data: Temp[] = activity_helper.temp_slice(temp_data, 16);
    temp_7day_data[temp_7day_data.length - 1].isAnomaly = true;

    const temp_stats = activity_helper.stats(temp_7day_data.map((e) => e.value.nightlyRelative).filter((e) => e) as number[], 1);

    /* 
    temp bound range calculation
    */
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
    past daily data
    */
    for (const temp of temp_7day_data) {
      const date = temp.value.nightlyRelative;
      const index = past_daily_data_list.findIndex((e) => e.pdfDate === date);
      if (index === -1) {
        console.log(`past_daily_data_list - ${id}: temp data not available for date: ${date}`);
      } else {
        temp.isAnomaly = past_daily_data_list.at(index)?.temp?.temp7Day?.at(-1)?.isAnomaly ?? false;
      }
    }

    return {
      temp: {
        temp7Day: temp_7day_data,
        temp7DayStats: temp_stats,
        lowerBound: temp_lower_bound,
        upperBound: temp_upper_bound,
        mean: temp_sd_anomaly.mean,
        sd: temp_sd_anomaly.sd,
        sdAnomaly: temp_sd_anomaly,
      },
      apiData: true,
    };
  } catch (error) {
    console.log(`temp_anomaly - ${id}: error`, error);
    await notify(`temp_anomaly - ${id}: error`, error);
  }
}
