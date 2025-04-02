import { addMinutes, format, subDays } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';

import { config } from '../config/config.js';
import { Api } from '../enum/enum.js';
import { HRV, Heart, Sleep, Spo2, Steps, Steps_Total, Temp } from '../interface/activity_interface.js';
import { Stats } from '../interface/report_interface.js';
import { SD_Anomaly } from '../interface/report_interface.js';
import { date_helper } from './date_helper.js';
import { math_helper } from './math_helper.js';

export const activity_helper = {
  /*
  timeseries
  */
  heart_steps_timeseries: (
    api: Api.HEART | Api.STEPS,
    data: Heart[] | Steps[],
    start_time: string,
    respect_end_time: boolean,
    remove_ss: boolean,
    fill_value: null | 0
  ): Heart[] | Steps[] => {
    let timeseries_blueprint = new Array(1440).fill('x').map((e, i) => {
      return {
        time: format(addMinutes(new Date('2000-01-01 00:00:00'), i), 'HH:mm:ss'),
        value: fill_value,
      };
    });

    timeseries_blueprint = timeseries_blueprint.concat(timeseries_blueprint);

    const startIndex = timeseries_blueprint.findIndex((e) => e.time === start_time);
    const slicedArr = timeseries_blueprint.slice(startIndex, startIndex + 1440);

    const finalArr = [];

    const dataSet = structuredClone(data);
    for (let i = 0; i < slicedArr.length; i++) {
      if (respect_end_time && !dataSet.length) break;

      if (dataSet[0]?.time === slicedArr[i].time) {
        finalArr.push(dataSet.splice(0, 1)[0]);
      } else {
        finalArr.push(slicedArr[i]);
      }
    }

    if (remove_ss) {
      return finalArr.map((e) => {
        return {
          time: e.time.split(':').slice(0, 2).join(':'),
          value: e.value,
        };
      });
    } else {
      return finalArr;
    }
  },

  steps_total_timeseries: (data: Steps_Total[], yyyyMMdd: string) => {
    const date_arr = date_helper
      .get_dates_between(subDays(new Date(yyyyMMdd), 29), new Date(yyyyMMdd))
      .map((e) => formatInTimeZone(e, 'UTC', 'yyyy-MM-dd'));

    const steps_total_arr: Steps_Total[] = [];

    for (const date of date_arr) {
      const index = data.findIndex((e) => e.dateTime === date);
      if (index === -1) {
        steps_total_arr.push({ dateTime: date, value: null });
      }
    }

    const new_steps_total_arr = steps_total_arr.concat(data);
    new_steps_total_arr.sort((a, b) => {
      return new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime();
    });

    return new_steps_total_arr;
  },

  spo2_timeseries: (data: Spo2[], yyyyMMdd: string): Spo2[] => {
    const date_arr = date_helper
      .get_dates_between(subDays(new Date(yyyyMMdd), 29), new Date(yyyyMMdd))
      .map((e) => formatInTimeZone(e, 'UTC', 'yyyy-MM-dd'));

    const spo2_arr: Spo2[] = [];

    for (const date of date_arr) {
      const index = data.findIndex((e) => e.dateTime === date);
      if (index === -1) {
        spo2_arr.push({
          dateTime: date,
          value: { min: null, avg: null, max: null },
        });
      }
    }

    const new_spo2_arr = spo2_arr.concat(data);
    new_spo2_arr.sort((a, b) => {
      return new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime();
    });

    return new_spo2_arr;
  },

  sleep_timeseries: (data: Sleep[], yyyyMMdd: string): Sleep[] => {
    const date_arr = date_helper
      .get_dates_between(subDays(new Date(yyyyMMdd), 29), new Date(yyyyMMdd))
      .map((e) => formatInTimeZone(e, 'UTC', 'yyyy-MM-dd'));

    const sleep_arr: Sleep[] = [];

    for (const date of date_arr) {
      const index = data.findIndex((e) => e.dateOfSleep === date);
      if (index === -1) {
        sleep_arr.push({ dateOfSleep: date, minutesAsleep: null });
      }
    }

    const new_sleep_arr = sleep_arr.concat(data);
    new_sleep_arr.sort((a, b) => {
      return new Date(a.dateOfSleep).getTime() - new Date(b.dateOfSleep).getTime();
    });

    return new_sleep_arr;
  },

  hrv_timeseries: (data: HRV[], yyyyMMdd: string): HRV[] => {
    const date_arr = date_helper
      .get_dates_between(subDays(new Date(yyyyMMdd), 29), new Date(yyyyMMdd))
      .map((e) => formatInTimeZone(e, 'UTC', 'yyyy-MM-dd'));

    const hrv_arr: HRV[] = [];

    for (const date of date_arr) {
      const index = data.findIndex((e) => e.dateTime === date);
      if (index === -1) {
        hrv_arr.push({ dateTime: date, value: { dailyRmssd: null } });
      }
    }

    const new_hrv_arr = hrv_arr.concat(data);
    new_hrv_arr.sort((a, b) => {
      return new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime();
    });

    return new_hrv_arr;
  },

  temp_timeseries: (data: Temp[], yyyyMMdd: string): Temp[] => {
    const date_arr = date_helper
      .get_dates_between(subDays(new Date(yyyyMMdd), 29), new Date(yyyyMMdd))
      .map((e) => formatInTimeZone(e, 'UTC', 'yyyy-MM-dd'));

    const temp_arr: Temp[] = [];

    for (const date of date_arr) {
      const index = data.findIndex((e) => e.dateTime === date);
      if (index === -1) {
        temp_arr.push({ dateTime: date, value: { nightlyRelative: null } });
      }
    }

    const new_temp_arr = temp_arr.concat(data);
    new_temp_arr.sort((a, b) => {
      return new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime();
    });

    return new_temp_arr;
  },

  /*
  anomaly
  */
  steps_total_anomaly_15days: (steps_total_30_days: Steps_Total[]): SD_Anomaly => {
    if (steps_total_30_days.at(-1)?.value === null) {
      console.log('steps_total_anomaly_15days: current day data not available');
      return {
        isAnomaly: false,
        isRange: false,
        mean: null,
        sd: null,
        zscore: null,
        lowerBound: null,
        upperBound: null,
      };
    }

    const steps_total_recent_15days = steps_total_30_days.slice(-16, -1);

    const valid_steps_total_recent_15days = steps_total_recent_15days.filter((e) => e.value !== null && e.value !== undefined);

    if (valid_steps_total_recent_15days.length < 2) {
      console.log('steps_total_anomaly_15days: min 2 valid points not found');
      return {
        isAnomaly: false,
        isRange: false,
        mean: null,
        sd: null,
        zscore: null,
        lowerBound: null,
        upperBound: null,
      };
    }

    const valid_steps_total_values = valid_steps_total_recent_15days.map((e) => e.value) as number[];

    const mean = math_helper.mean(valid_steps_total_values);
    const sd = math_helper.sample_sd(valid_steps_total_values);
    const zscore = math_helper.point_zscore(steps_total_30_days.at(-1)?.value as number, mean, sd);
    const lowerBound = mean - config.steps_total.steps_total_zscore * sd;
    const upperBound = mean + config.steps_total.steps_total_zscore * sd;

    console.log(`steps_total_anomaly_15days: pontzscore: ${zscore}`);

    if (zscore > config.steps_total.steps_total_max_zscore || zscore < config.steps_total.steps_total_min_zscore) {
      return {
        isAnomaly: true,
        isRange: true,
        mean,
        sd,
        zscore,
        lowerBound,
        upperBound,
      };
    }

    return {
      isAnomaly: false,
      isRange: true,
      mean,
      sd,
      zscore,
      lowerBound,
      upperBound,
    };
  },

  spo2_anomaly_15days: (spo2_30_days: Spo2[]): SD_Anomaly => {
    if (spo2_30_days.at(-1)?.value.avg === null) {
      console.log('spo2_anomaly_15days: current day data not available');
      return {
        isAnomaly: false,
        isRange: false,
        mean: null,
        sd: null,
        zscore: null,
        lowerBound: null,
        upperBound: null,
      };
    }

    const spo2_recent_15days = spo2_30_days.slice(-16, -1);

    const valid_spo2_recent_15days = spo2_recent_15days.filter((e) => e.value.avg !== null && e.value.avg !== undefined);

    if (valid_spo2_recent_15days.length < 2) {
      console.log('spo2_anomaly_15days: min 2 valid points not found');
      return {
        isAnomaly: false,
        isRange: false,
        mean: null,
        sd: null,
        zscore: null,
        lowerBound: null,
        upperBound: null,
      };
    }

    const valid_spo2_values = valid_spo2_recent_15days.map((e) => e.value.avg) as number[];

    const mean = math_helper.mean(valid_spo2_values);
    const sd = math_helper.sample_sd(valid_spo2_values);
    const zscore = math_helper.point_zscore(spo2_30_days.at(-1)?.value.avg as number, mean, sd);
    const lowerBound = mean - config.spo2.spo2_zscore * sd;
    const upperBound = mean + config.spo2.spo2_zscore * sd;

    console.log(`spo2_anomaly_15days: pontzscore: ${zscore}`);

    if (zscore < config.spo2.spo2_min_zscore) {
      return {
        isAnomaly: true,
        isRange: true,
        mean,
        sd,
        zscore,
        lowerBound,
        upperBound,
      };
    }

    return {
      isAnomaly: false,
      isRange: true,
      mean,
      sd,
      zscore,
      lowerBound,
      upperBound,
    };
  },

  sleep_anomaly_15days: (sleep_30_days: Sleep[]): SD_Anomaly => {
    if (sleep_30_days.at(-1)?.minutesAsleep === null) {
      console.log('sleep_anomaly_15days: current day data not available');
      return {
        isAnomaly: false,
        isRange: false,
        mean: null,
        sd: null,
        zscore: null,
        lowerBound: null,
        upperBound: null,
      };
    }

    const sleep_recent_15days = sleep_30_days.slice(-16, -1);

    const valid_sleep_recent_15days = sleep_recent_15days.filter((e) => e.minutesAsleep !== null && e.minutesAsleep !== undefined);

    if (valid_sleep_recent_15days.length < 2) {
      console.log('sleep_anomaly_15days: min 2 valid points not found');
      return {
        isAnomaly: false,
        isRange: false,
        mean: null,
        sd: null,
        zscore: null,
        lowerBound: null,
        upperBound: null,
      };
    }

    const valid_sleep_values = valid_sleep_recent_15days.map((e) => e.minutesAsleep) as number[];

    const mean = math_helper.mean(valid_sleep_values);
    const sd = math_helper.sample_sd(valid_sleep_values);
    const zscore = math_helper.point_zscore(sleep_30_days.at(-1)?.minutesAsleep as number, mean, sd);
    const lowerBound = mean - config.sleep.sleep_zscore * sd;
    const upperBound = mean + config.sleep.sleep_zscore * sd;

    console.log(`sleep_anomaly_15days: pontzscore: ${zscore}`);

    if (zscore > config.sleep.sleep_max_zscore || zscore < config.sleep.sleep_min_zscore) {
      return {
        isAnomaly: true,
        isRange: true,
        mean,
        sd,
        zscore,
        lowerBound,
        upperBound,
      };
    }

    return {
      isAnomaly: false,
      isRange: true,
      mean,
      sd,
      zscore,
      lowerBound,
      upperBound,
    };
  },

  hrv_anomaly_15days: (hrv_30_days: HRV[]): SD_Anomaly => {
    if (hrv_30_days.at(-1)?.value.dailyRmssd === null) {
      console.log('hrv_anomaly_15days: current day data not available');
      return {
        isAnomaly: false,
        isRange: false,
        mean: null,
        sd: null,
        zscore: null,
        lowerBound: null,
        upperBound: null,
      };
    }

    const hrv_recent_15days = hrv_30_days.slice(-16, -1);

    const valid_hrv_recent_15days = hrv_recent_15days.filter((e) => e.value.dailyRmssd !== null && e.value.dailyRmssd !== undefined);

    if (valid_hrv_recent_15days.length < 2) {
      console.log('hrv_anomaly_15days: min 2 valid points not found');
      return {
        isAnomaly: false,
        isRange: false,
        mean: null,
        sd: null,
        zscore: null,
        lowerBound: null,
        upperBound: null,
      };
    }

    const valid_hrv_values = valid_hrv_recent_15days.map((e) => e.value.dailyRmssd) as number[];

    const mean = math_helper.mean(valid_hrv_values);
    const sd = math_helper.sample_sd(valid_hrv_values);
    const zscore = math_helper.point_zscore(hrv_30_days.at(-1)?.value.dailyRmssd as number, mean, sd);
    const lowerBound = mean - config.hrv.hrv_zscore * sd;
    const upperBound = mean + config.hrv.hrv_zscore * sd;

    console.log(`hrv_anomaly_15days: pontzscore: ${zscore}`);

    if (zscore > config.hrv.hrv_max_zscore || zscore < config.hrv.hrv_min_zscore) {
      return {
        isAnomaly: true,
        isRange: true,
        mean,
        sd,
        zscore,
        lowerBound,
        upperBound,
      };
    }

    return {
      isAnomaly: false,
      isRange: true,
      mean,
      sd,
      zscore,
      lowerBound,
      upperBound,
    };
  },

  temp_anomaly_15days: (temp_30_days: Temp[]): SD_Anomaly => {
    if (temp_30_days.at(-1)?.value.nightlyRelative === null) {
      console.log('temp_anomaly_15days: current day data not available');
      return {
        isAnomaly: false,
        isRange: false,
        mean: null,
        sd: null,
        zscore: null,
        lowerBound: null,
        upperBound: null,
      };
    }

    const temp_recent_15days = temp_30_days.slice(-16, -1);

    const valid_temp_recent_15days = temp_recent_15days.filter(
      (e) => e.value.nightlyRelative !== null && e.value.nightlyRelative !== undefined
    );

    if (valid_temp_recent_15days.length < 2) {
      console.log('temp_anomaly_15days: min 2 valid points not found');
      return {
        isAnomaly: false,
        isRange: false,
        mean: null,
        sd: null,
        zscore: null,
        lowerBound: null,
        upperBound: null,
      };
    }

    const valid_temp_values = valid_temp_recent_15days.map((e) => e.value.nightlyRelative) as number[];

    const mean = math_helper.mean(valid_temp_values);
    const sd = math_helper.sample_sd(valid_temp_values);
    const zscore = math_helper.point_zscore(temp_30_days.at(-1)?.value.nightlyRelative as number, mean, sd);
    const lowerBound = mean - config.temp.temp_zscore * sd;
    const upperBound = mean + config.temp.temp_zscore * sd;

    console.log(`temp_anomaly_15days: pontzscore: ${zscore}`);

    if (zscore > config.temp.temp_max_zscore || zscore < config.temp.temp_min_zscore) {
      return {
        isAnomaly: true,
        isRange: true,
        mean,
        sd,
        zscore,
        lowerBound,
        upperBound,
      };
    }

    return {
      isAnomaly: false,
      isRange: true,
      mean,
      sd,
      zscore,
      lowerBound,
      upperBound,
    };
  },

  /*
  slice
  */
  steps_total_slice: (steps_total_data: Steps_Total[], slice_length: number): Steps_Total[] => {
    return steps_total_data.slice(-slice_length);
  },

  spo2_slice: (spo2_data: Spo2[], slice_length: number): Spo2[] => {
    return spo2_data.slice(-slice_length);
  },

  sleep_slice: (sleep_data: Sleep[], slice_length: number): Sleep[] => {
    return sleep_data.slice(-slice_length);
  },

  hrv_slice: (hrv_data: HRV[], slice_length: number): HRV[] => {
    return hrv_data.slice(-slice_length);
  },

  temp_slice: (temp_data: Temp[], slice_length: number): Temp[] => {
    return temp_data.slice(-slice_length);
  },

  /*
  other
  */
  sleep_fix_repeating_iterations: (sleep_data: Sleep[]): Sleep[] => {
    if (!sleep_data.length) {
      return [];
    }
    const sleep_arr = structuredClone(sleep_data);
    let i = 0;
    while (i < sleep_arr.length - 1) {
      if (sleep_arr[i].dateOfSleep === sleep_arr[i + 1].dateOfSleep) {
        sleep_arr.splice(i, 2, {
          ...sleep_arr[i],
          minutesAsleep: (sleep_arr[i].minutesAsleep as number) + (sleep_arr[i + 1].minutesAsleep as number),
        });
      } else {
        i++;
      }
    }
    return sleep_arr;
  },

  stats: (arr: number[], upto_decimal: number): Stats => {
    if (!arr.length) return { max: null, avg: null, min: null };

    const init_max = Math.max(...arr);
    const init_avg = math_helper.mean(arr);
    const init_min = Math.min(...arr);

    return {
      max: activity_helper.decimal_slicer(init_max, upto_decimal),
      avg: activity_helper.decimal_slicer(init_avg, upto_decimal),
      min: activity_helper.decimal_slicer(init_min, upto_decimal),
    };
  },

  decimal_slicer: (num: number, upto_decimal: number) => {
    if (upto_decimal < 0) {
      console.log(`decimal_slicer: upto decimal ${upto_decimal} less than 0`);
      return num;
    }

    if (upto_decimal === 0) {
      return Math.round(num);
    }

    const splitted_num = String(num).split('.');

    const before_decimal = splitted_num[0];
    const after_decimal = splitted_num[1];

    const str = `${before_decimal}.${after_decimal ? after_decimal.slice(0, upto_decimal) : 0}`;

    return Number(str);
  },
};
