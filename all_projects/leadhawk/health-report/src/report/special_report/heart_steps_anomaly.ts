import { addMinutes, differenceInMinutes, format, parse, subDays } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';

import { api } from '../../api/api.js';
import { config } from '../../config/config.js';
import { ModelController } from '../../db/dynamodb/model_controller.js';
import { Api, Node_Events, Source_System, Timezone } from '../../enum/enum.js';
import { activity_helper } from '../../helper/activity_helper.js';
import { math_helper } from '../../helper/math_helper.js';
import { Heart, Steps } from '../../interface/activity_interface.js';
import { GMM_Anomaly, Stats, Tanaka_Anomaly } from '../../interface/report_interface.js';
import { node_event } from '../../utils/event_util.js';
import { dead_letter, notify } from '../../utils/upload_util.js';

export async function heart_steps_anomaly(
  id: string,
  access_token: string,
  source_system: Source_System,
  age: number | null,
  timezone: Timezone,
  start_date_time: Date,
  end_date_time: Date
) {
  try {
    console.log(`heart_steps_anomaly - ${id}: start`, { start_date_time, end_date_time });

    const model_controller = new ModelController();

    console.log('heart_steps_anomaly: heart-steps api time', {
      start: start_date_time,
      end: end_date_time,
    });

    /*
    set api start date-time
    */
    let start_date = formatInTimeZone(start_date_time, 'UTC', 'yyyy-MM-dd');
    let start_time = formatInTimeZone(start_date_time, 'UTC', 'HH:mm');

    /*
    set api end date-time
    */
    const end_date = formatInTimeZone(end_date_time, 'UTC', 'yyyy-MM-dd');
    const end_time = formatInTimeZone(end_date_time, 'UTC', 'HH:mm');

    if (differenceInMinutes(end_date_time, start_date_time) < 1439) {
      start_date = formatInTimeZone(addMinutes(subDays(end_date_time, 1), 1), 'UTC', 'yyyy-MM-dd');
      start_time = formatInTimeZone(addMinutes(subDays(end_date_time, 1), 1), 'UTC', 'HH:mm');
    }

    console.log(`heart_steps_anomaly - ${id}: heart-steps new api time`, {
      start: `${start_date} ${start_time}`,
      end: `${end_date} ${end_time}`,
    });

    /*
    api call for heart and steps
    */
    const [heart_api_response, steps_api_response] = await Promise.allSettled([
      api(id, access_token, source_system, Api.HEART, { start_date, end_date, start_time, end_time }),
      api(id, access_token, source_system, Api.STEPS, { start_date, end_date, start_time, end_time }),
    ]);

    if (heart_api_response.status === 'rejected') {
      console.log('heart_steps_anomaly: special report heart api rejected');
      await dead_letter(id, timezone, config.report.special_report.sqs_name, 'special report heart api rejected');
      return { apiData: false };
    }

    if (steps_api_response.status === 'rejected') {
      console.log('heart_steps_anomaly: special report steps api rejected');
      await dead_letter(id, timezone, config.report.special_report.sqs_name, 'special report steps api rejected');
      return { apiData: false };
    }

    /*
    api failed
    */
    if (heart_api_response.status === 'fulfilled' && steps_api_response.status === 'fulfilled') {
      const is_429 = [heart_api_response, steps_api_response].some((e) => e.value?.code === 429);
      if (is_429) {
        console.log('heart_steps_anomaly: special report heart steps 429 api error');
        await node_event(Node_Events.SPECIAL_REPORT_429, { id: id, date: new Date() });
      }

      const is_api_failed = [heart_api_response, steps_api_response].some((e) => e.value?.code !== 200);
      if (is_api_failed) {
        console.log('heart_steps_anomaly: special report heart steps api failed');
        await dead_letter(id, timezone, config.report.special_report.sqs_name, 'special report api failed');
        return { apiData: false };
      }
    }

    /*
    empty heart steps data
    */
    const heart_data: Heart[] = heart_api_response?.value?.data ?? [];
    const steps_data: Steps[] = steps_api_response?.value?.data ?? [];

    if (!heart_data.length || !steps_data.length) {
      console.log('heart_steps_anomaly: invalid or empty data set');
      return { apiData: false };
    }

    /*
    match both heart and steps end points
    */
    const heart_data_modified = activity_helper.heart_steps_timeseries(Api.HEART, heart_data, `${start_time}:00`, false, true, null);

    let steps_fill_value: 0 | null = 0;
    if (source_system === Source_System.APPLEWATCH) steps_fill_value = null;

    const steps_data_modified = activity_helper.heart_steps_timeseries(
      Api.STEPS,
      steps_data,
      `${start_time}:00`,
      false,
      true,
      steps_fill_value
    );

    /*
    slicing api time
    */
    const start_slice_time = formatInTimeZone(start_date_time, 'UTC', 'HH:mm');
    const end_slice_time = formatInTimeZone(end_date_time, 'UTC', 'HH:mm');
    console.log(`heart_steps_anomaly - ${id}:`, { start_slice_time, end_slice_time });
    const slice_index = heart_data_modified.findIndex((e) => e.time === start_slice_time);
    console.log(`heart_steps_anomaly - ${id}: slice_index: ${slice_index}`);

    /* slicing heart steps datasets */
    const sliced_heart_data_set = heart_data_modified.slice(slice_index);
    const sliced_steps_data_set = steps_data_modified.slice(slice_index);
    console.log(`heart_steps_anomaly - ${id}:`, { sliced_heart_data_set, sliced_steps_data_set });

    if (!sliced_heart_data_set.filter((e) => e.value).length) {
      console.log(`heart_steps_anomaly - ${id}: sliced_heart_data_set empty, not proceeding further`);
      return { apiData: false };
    }

    /*
    gmm anomaly generation
    */
    // console.log(`heart_steps_anomaly - ${id}: gmm_anomaly detection`);

    const gmm_anomaly: GMM_Anomaly[] | null = null;

    /* 
    tanaka anomaly detection
    */
    console.log(`heart_steps_anomaly - ${id}: tanaka_anomaly detection`);

    let tanaka_anomaly: Tanaka_Anomaly[] | null = null;
    let max_hr: number | null = null;

    if (age) {
      max_hr = config.tanaka.upper_limit - config.tanaka.factor * age;
      console.log(`heart_steps_anomaly - ${id}: age: ${age}, max_hr: ${max_hr}`);
      tanaka_anomaly = sliced_heart_data_set
        .filter((e) => e.value)
        .filter((e) => Number(e.value) > Number(max_hr) || Number(e.value) < config.heart.heart_level) as Tanaka_Anomaly[];
    } else {
      console.log(`heart_steps_anomaly - ${id}: age not available, not calculating tanaka anomaly`);
    }

    if (!tanaka_anomaly?.length) {
      tanaka_anomaly = null;
      console.log(`heart_steps_anomaly - ${id}: no tanaka anomaly detected, date: ${end_date}`, { tanaka_anomaly });
      return { apiData: true };
    }

    /* combine check anomalies */
    //wip

    /* creating data for report */
    const heart_stats: Stats = activity_helper.stats(heart_data_modified.map((e) => e.value).filter((e) => e) as number[], 0);
    const steps_stats: Stats = activity_helper.stats(
      steps_data_modified.map((e) => e.value).filter((e) => e !== null && e !== undefined) as number[],
      0
    );

    /* 
    heart bound range calculation
    */
    let heart_lower_bound = null;
    let heart_upper_bound = null;
    let heart_mean = null;
    let heart_sd = null;

    if (heart_data_modified?.length) {
      const heart_value = heart_data.map((e) => e.value).filter((e) => e) as number[];
      const mean = math_helper.mean(heart_value);
      const sd = math_helper.sample_sd(heart_value);

      heart_lower_bound = Math.max(0, Math.round(mean - 3 * sd));
      heart_upper_bound = Math.max(0, Math.round(mean + 3 * sd));

      if (heart_lower_bound < config.heart.heart_level) heart_lower_bound = config.heart.heart_level;

      heart_mean = structuredClone(mean);
      heart_sd = structuredClone(sd);
    }

    /* 
    steps bound range calculation
    */
    let steps_lower_bound = null;
    let steps_upper_bound = null;
    let steps_mean = null;
    let steps_sd = null;

    if (steps_data_modified?.length) {
      const steps_value = steps_data.map((e) => e.value).filter((e) => e !== null) as number[];
      const mean = math_helper.mean(steps_value);
      const sd = math_helper.sample_sd(steps_value);

      steps_lower_bound = Math.max(0, Math.round(mean - 3 * sd));
      steps_upper_bound = Math.max(0, Math.round(mean + 3 * sd));

      steps_mean = structuredClone(mean);
      steps_sd = structuredClone(sd);
    }

    return {
      heart: {
        heartCurrentDay: structuredClone(heart_data_modified).map((e) => ({
          time: format(parse(e.time, 'HH:mm', new Date()), 'hh:mm a'),
          value: e.value,
        })),
        heartCurrentDayStats: heart_stats,
        lowerBound: heart_lower_bound,
        upperBound: heart_upper_bound,
        mean: heart_mean,
        sd: heart_sd,
        reuse_heartCurrentDay: structuredClone(heart_data_modified),
      },
      steps: {
        stepsCurrentDay: structuredClone(steps_data_modified).map((e) => ({
          time: format(parse(e.time, 'HH:mm', new Date()), 'hh:mm a'),
          value: e.value,
        })),
        stepsCurrentDayStats: steps_stats,
        lowerBound: steps_lower_bound,
        upperBound: steps_upper_bound,
        mean: steps_mean,
        sd: steps_sd,
        reuse_stepsCurrentDay: structuredClone(steps_data_modified),
      },
      heartStepsAnomaly: null,
      tanakaAnomaly: tanaka_anomaly
        ? tanaka_anomaly.map((e) => ({
            ...e,
            time: format(parse(e.time, 'HH:mm', new Date()), 'hh:mm a'),
          }))
        : null,
      reuse_heartStepsAnomaly: structuredClone(gmm_anomaly),
      reuse_tanakaAnomaly: structuredClone(tanaka_anomaly),
      gmmData: null,
      age: age,
      tanakaMaxHr: max_hr,
      apiData: true,
      startDate: start_date,
      endDate: end_date,
    };
  } catch (error) {
    console.log(`heart_steps_anomaly - ${id}: error`, error);
    await notify(`heart_steps_anomaly - ${id}: error`, error);
  }
}
