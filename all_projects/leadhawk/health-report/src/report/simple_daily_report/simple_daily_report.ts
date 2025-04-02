import { ReportController } from '../../db/dynamodb/report_controller.js';
import { Source_System } from '../../enum/enum.js';
import { Simple_Daily_Report_Args, Simple_Daily_Report_Data } from '../../interface/report_interface.js';

export async function simple_daily_report(
  id: string,
  date: string,
  simple_daily_report_args: Simple_Daily_Report_Args,
  source_system: Source_System
) {
  /* 
  heart
  */

  const heart_min_range = 0;
  let heart_max_range = 200;

  const heart_lower_bound = simple_daily_report_args.heart.lowerBound;
  const heart_upper_bound = simple_daily_report_args.heart.upperBound;

  const heart_valid_lower_bound = heart_lower_bound !== null && heart_lower_bound !== undefined ? true : false;
  const heart_valid_upper_bound = heart_upper_bound !== null && heart_upper_bound !== undefined ? true : false;

  if (heart_valid_upper_bound && (heart_upper_bound as number) > heart_max_range) {
    heart_max_range = heart_upper_bound as number;
  }

  const heart_avg = simple_daily_report_args.heart.stats.avg;

  const is_heart_anomaly = [simple_daily_report_args.heart.isGMMAnomaly, simple_daily_report_args.heart.isTanakaAnomaly].some((e) => e);

  let heart_lower_bound_percent_space: number | null = null;
  let heart_upper_bound_percent_space: number | null = null;
  let heart_bound_percent_space: number | null = null;

  if (heart_valid_lower_bound && heart_valid_upper_bound) {
    heart_lower_bound_percent_space = (((heart_lower_bound as number) - heart_min_range) / (heart_max_range - heart_min_range)) * 100;
    heart_upper_bound_percent_space = (((heart_upper_bound as number) - heart_min_range) / (heart_max_range - heart_min_range)) * 100;
    heart_bound_percent_space = heart_upper_bound_percent_space - heart_lower_bound_percent_space;
  }

  /* 
  steps
  */

  const steps_min_range = 0;
  let steps_max_range = 20.0;

  let steps_lower_bound = simple_daily_report_args.steps.lowerBound;
  let steps_upper_bound = simple_daily_report_args.steps.upperBound;

  const steps_valid_lower_bound = steps_lower_bound !== null && steps_lower_bound !== undefined ? true : false;
  const steps_valid_upper_bound = steps_upper_bound !== null && steps_upper_bound !== undefined ? true : false;

  if (steps_valid_lower_bound) {
    steps_lower_bound = Number(((steps_lower_bound as number) / 1000).toFixed(1));
  }

  if (steps_valid_upper_bound) {
    steps_upper_bound = Number(((steps_upper_bound as number) / 1000).toFixed(1));
  }

  if (steps_valid_upper_bound && (steps_upper_bound as number) > steps_max_range) {
    steps_max_range = steps_upper_bound as number;
  }

  const steps_value = simple_daily_report_args.steps.value && Number(((simple_daily_report_args.steps.value as number) / 1000).toFixed(2));

  let steps_lower_bound_percent_space: number | null = null;
  let steps_upper_bound_percent_space: number | null = null;
  let steps_bound_percent_space: number | null = null;

  if (steps_valid_lower_bound && steps_valid_upper_bound) {
    steps_lower_bound_percent_space = (((steps_lower_bound as number) - steps_min_range) / (steps_max_range - steps_min_range)) * 100;
    steps_upper_bound_percent_space = (((steps_upper_bound as number) - steps_min_range) / (steps_max_range - steps_min_range)) * 100;
    steps_bound_percent_space = steps_upper_bound_percent_space - steps_lower_bound_percent_space;
  }

  /* 
  spo2
  */

  let spo2_min_range = 85;
  const spo2_max_range = 100;

  const spo2_lower_bound = simple_daily_report_args.spo2.lowerBound;
  const spo2_upper_bound = simple_daily_report_args.spo2.upperBound;

  const spo2_valid_lower_bound = spo2_lower_bound !== null && spo2_lower_bound !== undefined ? true : false;
  const spo2_valid_upper_bound = spo2_upper_bound !== null && spo2_upper_bound !== undefined ? true : false;

  if (spo2_valid_lower_bound && (spo2_lower_bound as number) < spo2_min_range) {
    spo2_min_range = (spo2_lower_bound as number) - 10;
  }

  const spo2_value = simple_daily_report_args.spo2.value;

  if (spo2_value !== null && spo2_value !== undefined) {
    if (spo2_value < spo2_min_range) spo2_min_range = spo2_value;
  }

  let spo2_lower_bound_percent_space: number | null = null;
  let spo2_upper_bound_percent_space: number | null = null;
  let spo2_bound_percent_space: number | null = null;

  if (spo2_valid_lower_bound && spo2_valid_upper_bound) {
    spo2_lower_bound_percent_space = (((spo2_lower_bound as number) - spo2_min_range) / (spo2_max_range - spo2_min_range)) * 100;
    spo2_upper_bound_percent_space = (((spo2_upper_bound as number) - spo2_min_range) / (spo2_max_range - spo2_min_range)) * 100;
    spo2_bound_percent_space = spo2_upper_bound_percent_space - spo2_lower_bound_percent_space;
  }

  /* 
  sleep
  */

  const sleep_min_range = 0;
  const sleep_max_range = 24;

  let sleep_lower_bound = simple_daily_report_args.sleep.lowerBound;
  let sleep_upper_bound = simple_daily_report_args.sleep.upperBound;

  const sleep_valid_lower_bound = sleep_lower_bound !== null && sleep_lower_bound !== undefined ? true : false;
  const sleep_valid_upper_bound = sleep_upper_bound !== null && sleep_upper_bound !== undefined ? true : false;

  if (sleep_valid_lower_bound) {
    sleep_lower_bound = Number(((sleep_lower_bound as number) / 60).toFixed(1));
  }

  if (sleep_valid_upper_bound) {
    sleep_upper_bound = Number(((sleep_upper_bound as number) / 60).toFixed(1));
  }

  const sleep_value = simple_daily_report_args.sleep.value && Number((simple_daily_report_args.sleep.value / 60).toFixed(1));

  let sleep_lower_bound_percent_space: number | null = null;
  let sleep_upper_bound_percent_space: number | null = null;
  let sleep_bound_percent_space: number | null = null;

  if (sleep_valid_lower_bound && sleep_valid_upper_bound) {
    sleep_lower_bound_percent_space = (((sleep_lower_bound as number) - sleep_min_range) / (sleep_max_range - sleep_min_range)) * 100;
    sleep_upper_bound_percent_space = (((sleep_upper_bound as number) - sleep_min_range) / (sleep_max_range - sleep_min_range)) * 100;
    sleep_bound_percent_space = sleep_upper_bound_percent_space - sleep_lower_bound_percent_space;
  }

  /* 
  hrv 
  */
  let hrv_min_range = 0;
  let hrv_max_range = 120;

  const hrv_lower_bound = simple_daily_report_args.hrv.lowerBound;
  const hrv_upper_bound = simple_daily_report_args.hrv.upperBound;

  const hrv_valid_lower_bound = hrv_lower_bound !== null && hrv_lower_bound !== undefined ? true : false;
  const hrv_valid_upper_bound = hrv_upper_bound !== null && hrv_upper_bound !== undefined ? true : false;

  if (hrv_valid_upper_bound && (hrv_upper_bound as number) > hrv_max_range) {
    hrv_max_range = (hrv_upper_bound as number) + 10;
  }

  const hrv_value = simple_daily_report_args.hrv.value;

  if (hrv_value !== null && hrv_value !== undefined) {
    if (hrv_value < hrv_min_range) hrv_min_range = hrv_value;
    if (hrv_value > hrv_max_range) hrv_max_range = hrv_value;
  }

  let hrv_lower_bound_percent_space: number | null = null;
  let hrv_upper_bound_percent_space: number | null = null;
  let hrv_bound_percent_space: number | null = null;

  if (hrv_valid_lower_bound && hrv_valid_upper_bound) {
    hrv_lower_bound_percent_space = (((hrv_lower_bound as number) - hrv_min_range) / (hrv_max_range - hrv_min_range)) * 100;
    hrv_upper_bound_percent_space = (((hrv_upper_bound as number) - hrv_min_range) / (hrv_max_range - hrv_min_range)) * 100;
    hrv_bound_percent_space = hrv_upper_bound_percent_space - hrv_lower_bound_percent_space;
  }

  /* 
  temp 
  */
  let temp_min_range = -10;
  let temp_max_range = 10;

  if (source_system === Source_System.APPLEWATCH) {
    temp_min_range = 94;
    temp_max_range = 108;
  }

  const temp_lower_bound = simple_daily_report_args.temp.lowerBound;
  const temp_upper_bound = simple_daily_report_args.temp.upperBound;

  const temp_valid_lower_bound = temp_lower_bound !== null && temp_lower_bound !== undefined ? true : false;
  const temp_valid_upper_bound = temp_upper_bound !== null && temp_upper_bound !== undefined ? true : false;

  if (temp_valid_lower_bound && (temp_lower_bound as number) < temp_min_range) {
    temp_min_range = (temp_lower_bound as number) - 5;
  }

  if (temp_valid_upper_bound && (temp_upper_bound as number) > temp_max_range) {
    temp_max_range = (temp_upper_bound as number) + 5;
  }

  const temp_value = simple_daily_report_args.temp.value;

  if (temp_value !== null && temp_value !== undefined) {
    if (temp_value < temp_min_range) temp_min_range = temp_value;
    if (temp_value > temp_max_range) temp_max_range = temp_value;
  }

  let temp_lower_bound_percent_space: number | null = null;
  let temp_upper_bound_percent_space: number | null = null;
  let temp_bound_percent_space: number | null = null;

  if (temp_valid_lower_bound && temp_valid_upper_bound) {
    temp_lower_bound_percent_space = (((temp_lower_bound as number) - temp_min_range) / (temp_max_range - temp_min_range)) * 100;
    temp_upper_bound_percent_space = (((temp_upper_bound as number) - temp_min_range) / (temp_max_range - temp_min_range)) * 100;
    temp_bound_percent_space = temp_upper_bound_percent_space - temp_lower_bound_percent_space;
  }

  /* 
  time to fall asleep 
  */
  //wip

  /*
  create simple daily report data object
  */
  console.log(`simple_daily_report - ${id}: creating simple daily report data object`);

  const data: Simple_Daily_Report_Data = {
    heart: {
      minRange: heart_min_range,
      maxRange: heart_max_range,
      lowerBound: heart_lower_bound,
      upperBound: heart_upper_bound,
      value: heart_avg,
      isAnomaly: is_heart_anomaly,
      lowerBoundPercentSpace: heart_lower_bound_percent_space,
      upperBoundPercentSpace: heart_upper_bound_percent_space,
      boundPercentSpace: heart_bound_percent_space,
    },
    steps: {
      minRange: steps_min_range,
      maxRange: steps_max_range,
      lowerBound: steps_lower_bound,
      upperBound: steps_upper_bound,
      value: steps_value,
      raw_value: simple_daily_report_args.steps.value as number,
      sdAnomaly: simple_daily_report_args.steps.sdAnomaly,
      lowerBoundPercentSpace: steps_lower_bound_percent_space,
      upperBoundPercentSpace: steps_upper_bound_percent_space,
      boundPercentSpace: steps_bound_percent_space,
    },
    spo2: {
      minRange: spo2_min_range,
      maxRange: spo2_max_range,
      lowerBound: spo2_lower_bound,
      upperBound: spo2_upper_bound,
      value: spo2_value,
      medicalAnomaly: simple_daily_report_args.spo2.isMedicalAnomaly,
      sdAnomaly: simple_daily_report_args.spo2.sdAnomaly,
      lowerBoundPercentSpace: spo2_lower_bound_percent_space,
      upperBoundPercentSpace: spo2_upper_bound_percent_space,
      boundPercentSpace: spo2_bound_percent_space,
    },
    sleep: {
      minRange: sleep_min_range,
      maxRange: sleep_max_range,
      lowerBound: sleep_lower_bound,
      upperBound: sleep_upper_bound,
      value: sleep_value,
      medicalAnomaly: simple_daily_report_args.sleep.isMedicalAnomaly,
      sdAnomaly: simple_daily_report_args.sleep.sdAnomaly,
      lowerBoundPercentSpace: sleep_lower_bound_percent_space,
      upperBoundPercentSpace: sleep_upper_bound_percent_space,
      boundPercentSpace: sleep_bound_percent_space,
    },
    hrv: {
      minRange: hrv_min_range,
      maxRange: hrv_max_range,
      lowerBound: hrv_lower_bound,
      upperBound: hrv_upper_bound,
      value: hrv_value,
      sdAnomaly: simple_daily_report_args.hrv.sdAnomaly,
      lowerBoundPercentSpace: hrv_lower_bound_percent_space,
      upperBoundPercentSpace: hrv_upper_bound,
      boundPercentSpace: hrv_bound_percent_space,
    },
    temp: {
      minRange: temp_min_range,
      maxRange: temp_max_range,
      lowerBound: temp_lower_bound,
      upperBound: temp_upper_bound,
      value: temp_value,
      sdAnomaly: simple_daily_report_args.temp.sdAnomaly,
      lowerBoundPercentSpace: temp_lower_bound_percent_space,
      upperBoundPercentSpace: temp_upper_bound_percent_space,
      boundPercentSpace: temp_bound_percent_space,
    },
    timeToFallAsleep: {
      minRange: 0,
      maxRange: 30,
      lowerBound: null,
      upperBound: null,
      value: null,
    },
    score: 0,
    score_date: '',
    id: simple_daily_report_args.id,
    userId: simple_daily_report_args.userId,
    dataId: simple_daily_report_args.dataId,
    name: simple_daily_report_args.name,
    timezone: simple_daily_report_args.timezone,
    sourceSystem: simple_daily_report_args.sourceSystem,
    reportType: simple_daily_report_args.reportType,
    reportName: simple_daily_report_args.reportName,
    reportId: simple_daily_report_args.reportId,
    datePublished: simple_daily_report_args.datePublished,
    eventDate: simple_daily_report_args.eventDate,
    pdfDate: simple_daily_report_args.pdfDate,
  };

  /* 
  biometrics score calculation 
  */

  const report_controller = new ReportController();

  const score_anomaly = simple_daily_report_args.scoreAnomaly;
  const user = await report_controller.get(id);

  let score = user?.score ?? 0;
  let score_date = user?.score_date;

  console.log(`simple_daily_report - ${id}: score: ${score}, score_date: ${score_date}, score_anomaly: ${score_anomaly}`);

  if (score_date && score_date === date) {
    console.log(`simple_daily_report - ${id}: score: ${score} is already inserted for the date: ${score_date}`);
  } else {
    if (score_anomaly) {
      score = -3;
    } else {
      score = score + 1;
      score = score > 3 ? 3 : score;
    }
    score_date = date;

    await report_controller.update(id, { user_id: id, score, score_date });
  }

  data.score = score;
  data.score_date = score_date;

  return data;
}
