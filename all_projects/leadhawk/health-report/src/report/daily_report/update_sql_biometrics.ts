import { parse } from 'date-fns';

import { context } from '../../db/postgresql/prisma_context.js';
import { Update_Sql_Db_Args } from '../../interface/report_interface.js';
import { notify } from '../../utils/upload_util.js';

export async function update_sql_biometrics(update_sql_db_args: Update_Sql_Db_Args) {
  const {
    id,
    user_id,
    source_system,
    date,
    name,
    dob,
    timezone,
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
    simpleDailyReport,
    device_name,
  } = update_sql_db_args;

  try {
    /*
    user
    */
    console.log(`update_sql_db - ${id}, upsert user in sql db`);
    const user_res = await context.prisma.user.upsert({
      where: {
        pretaa_user_id_source_system_id_source_system: {
          pretaa_user_id: user_id,
          source_system_id: id,
          source_system: source_system,
        },
      },
      update: {
        name: name,
        dob: dob ? new Date(dob) : null,
        timezone: timezone,
      },
      create: {
        pretaa_user_id: user_id,
        source_system_id: id,
        source_system: source_system,
        timezone: timezone,
        name: name,
        dob: dob ? new Date(dob) : null,
      },
    });

    /*
    heart
    */
    console.log(`update_sql_db - ${id}: insert heart in sql db`);
    const sql_heart_data = heart_data
      .filter((e) => e.value !== null)
      .map((e) => ({
        user_id: user_res.id,
        date: new Date(date),
        time: parse(e.time, 'HH:mm', new Date(date)),
        value: Number(e.value),
        source_system: source_system,
      }));

    await context.prisma.heart.createMany({
      data: sql_heart_data,
      skipDuplicates: true,
    });

    /*
    steps
    */
    console.log(`update_sql_db - ${id}: insert steps in sql db`);
    const sql_steps_data = steps_data
      .filter((e) => e.value !== null)
      .map((e) => ({
        user_id: user_res.id,
        date: new Date(date),
        time: parse(e.time, 'HH:mm', new Date(date)),
        value: Number(e.value),
        source_system: source_system,
      }));

    await context.prisma.steps.createMany({
      data: sql_steps_data,
      skipDuplicates: true,
    });

    /*
    spo2
    */
    console.log(`update_sql_db - ${id}: insert spo2 in sql db`);
    const sql_spo2_data = spo2_7day_data.at(-1)?.value.avg;

    if (sql_spo2_data)
      await context.prisma.spo2.upsert({
        where: { user_id_date: { user_id: user_res.id, date: new Date(date) } },
        update: {},
        create: {
          user_id: user_res.id,
          date: new Date(date),
          value: sql_spo2_data,
          source_system: source_system,
        },
      });

    /*
    sleep
    */
    console.log(`update_sql_db - ${id}: insert sleep in sql db`);
    const sql_sleep_data = sleep_7day_data.at(-1)?.minutesAsleep;

    if (sql_sleep_data)
      await context.prisma.sleep.upsert({
        where: { user_id_date: { user_id: user_res.id, date: new Date(date) } },
        update: {},
        create: {
          user_id: user_res.id,
          date: new Date(date),
          value: sql_sleep_data,
          source_system: source_system,
        },
      });

    /*
    hrv
    */
    console.log(`update_sql_db - ${id}: insert hrv in sql db`);
    const sql_hrv_data = hrv_7day_data.at(-1)?.value.dailyRmssd;

    if (sql_hrv_data)
      await context.prisma.hrv.upsert({
        where: { user_id_date: { user_id: user_res.id, date: new Date(date) } },
        update: {},
        create: {
          user_id: user_res.id,
          date: new Date(date),
          value: sql_hrv_data,
          source_system: source_system,
        },
      });

    /*
    temp
    */
    console.log(`update_sql_db - ${id}: insert temp in sql db`);
    const sql_temp_data = temp_7day_data.at(-1)?.value.nightlyRelative;

    if (sql_temp_data)
      await context.prisma.temp.upsert({
        where: { user_id_date: { user_id: user_res.id, date: new Date(date) } },
        update: {},
        create: {
          user_id: user_res.id,
          date: new Date(date),
          value: sql_temp_data,
          source_system: source_system,
        },
      });

    /* daily summary */
    console.log(`update_sql_db - ${id}: insert report metadata in sql db`);
    const sorted_heart = heart_data.filter((e) => e.value).sort((a, b) => Number(b.value) - Number(a.value));
    await context.prisma.dailySummary.upsert({
      where: { user_id_date: { user_id: user_res.id, date: new Date(date) } },
      update: {},
      create: {
        user_id: user_res.id,
        date: new Date(date),
        source_system: source_system,

        heart_min: sorted_heart[sorted_heart.length - 1]?.value ?? null,
        heart_max: sorted_heart[0]?.value ?? null,
        heart_mean: heart_mean,
        heart_sd: heart_sd,
        heart_lower_bound: heart_lower_bound,
        heart_upper_bound: heart_upper_bound,
        heart_min_range: simpleDailyReport.heart.minRange,
        heart_max_range: simpleDailyReport.heart.maxRange,

        steps_total: simpleDailyReport.steps.raw_value,
        steps_mean: steps_mean,
        steps_sd: steps_sd,
        steps_lower_bound: steps_lower_bound,
        steps_upper_bound: steps_upper_bound,
        steps_min_range: simpleDailyReport.steps.minRange,
        steps_max_range: simpleDailyReport.steps.maxRange,

        spo2_value: sql_spo2_data ?? null,
        spo2_mean: spo2_sd_anomaly.mean,
        spo2_sd: spo2_sd_anomaly.sd,
        spo2_lower_bound: spo2_lower_bound,
        spo2_upper_bound: spo2_upper_bound,
        spo2_min_range: simpleDailyReport.spo2.minRange,
        spo2_max_range: simpleDailyReport.spo2.maxRange,

        sleep_value: sql_sleep_data ?? null,
        sleep_mean: sleep_sd_anomaly.mean,
        sleep_sd: sleep_sd_anomaly.sd,
        sleep_lower_bound: sleep_lower_bound,
        sleep_upper_bound: sleep_upper_bound,
        sleep_min_range: simpleDailyReport.sleep.minRange,
        sleep_max_range: simpleDailyReport.sleep.maxRange,

        hrv_value: sql_hrv_data ?? null,
        hrv_mean: hrv_sd_anomaly.mean,
        hrv_sd: hrv_sd_anomaly.sd,
        hrv_lower_bound: hrv_lower_bound,
        hrv_upper_bound: hrv_upper_bound,
        hrv_min_range: simpleDailyReport.hrv.minRange,
        hrv_max_range: simpleDailyReport.hrv.maxRange,

        temp_value: sql_temp_data ?? null,
        temp_mean: temp_sd_anomaly.mean,
        temp_sd: temp_sd_anomaly.sd,
        temp_lower_bound: temp_lower_bound,
        temp_upper_bound: temp_upper_bound,
        temp_min_range: simpleDailyReport.temp.minRange,
        temp_max_range: simpleDailyReport.temp.maxRange,
      },
    });

    /* device */
    console.log(`update_sql_db - ${id}, upsert device in sql db`);

    if (device_name)
      await context.prisma.device.upsert({
        where: { user_id: user_res.id },
        update: { device_name: device_name },
        create: { user_id: user_res.id, device_name: device_name },
      });
  } catch (error) {
    console.log(`update_sql_db - ${id}: error`, error);
    await notify(`update_sql_db - ${id}: error`, error);
  }
}
