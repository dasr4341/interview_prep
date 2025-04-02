import fs from 'node:fs/promises';
import path from 'node:path';
import { addDays, addMinutes, format, subDays, subMinutes } from 'date-fns';
import dotenv from 'dotenv';
dotenv.config();

import { Source_System, Timezone } from '../src/enum/enum.js';
import { report_helper } from '../src/helper/report_helper.js';
import { zoned_time } from '../src/helper/timezone_helper.js';
import { create_daily_report } from '../src/report/daily_report/create_daily_report.js';
import { create_monthly_report } from '../src/report/monthly_report/create_monthly_report.js';
import { anomaly_date_create } from '../src/report/special_report/anomaly_date_create.js';
import { create_weekly_report } from '../src/report/weekly_report/create_weekly_report.js';
import { special_report } from '../src/special_report.js';
import { check } from './check.js';
import { cleanup } from './cleanup.js';

async function generate() {
  try {
    /* constants */
    const _id = 'TESTID';
    const _name = 'Test Test';
    const _user_id = 'e5c8e065-8e98-4db0-92ca-d5eedb6e619a';
    const _dob = '1993-01-01';
    const _age = report_helper.get_age(_dob);
    const _timezone = Timezone['Asia/Kolkata'];

    /* update device sync time */
    const device_data = JSON.parse(await fs.readFile(path.join(process.cwd(), 'test', 'files', 'devices.json'), { encoding: 'utf-8' }));
    const initial_last_sync_time = device_data[0].lastSyncTime;
    device_data[0].lastSyncTime = new Date().toISOString();
    await fs.writeFile(path.join(process.cwd(), 'test', 'files', 'devices.json'), JSON.stringify(device_data, null, 2), {
      encoding: 'utf-8',
    });

    await cleanup();

    /* daily report test */
    const _path = path.join(process.cwd(), 'test', 'files', 'daily_report');
    const _dir = await fs.readdir(_path);

    for (const e of _dir) {
      await create_daily_report(_id, '', Source_System.FITBIT, _name, _age, _timezone, e, 0, 0, null, _user_id, _dob);
    }

    /* weekly report test */
    let weekly_start_date = '2023-10-01';
    const weekly_date_array = [];

    for (let i = 0; i < 7; i++) {
      weekly_date_array.push({
        start_date: weekly_start_date,
        end_date: format(addDays(new Date(weekly_start_date), 6), 'yyyy-MM-dd'),
      });
      weekly_start_date = format(addDays(new Date(weekly_start_date), 7), 'yyyy-MM-dd');
    }

    for (const e of weekly_date_array) {
      await create_weekly_report(_id, Source_System.FITBIT, _name, _timezone, null, _user_id, e.start_date, e.end_date);
    }

    /* monthly report test */
    let monthly_start_date = '2023-10-01';
    const monthly_date_array = [];

    for (let i = 0; i < 2; i++) {
      monthly_date_array.push({
        start_date: monthly_start_date,
        end_date: format(addDays(new Date(monthly_start_date), 30), 'yyyy-MM-dd'),
      });
      monthly_start_date = format(addDays(new Date(monthly_start_date), 31), 'yyyy-MM-dd');
    }

    for (const e of monthly_date_array) {
      await create_monthly_report(_id, Source_System.FITBIT, _name, _timezone, null, _user_id, e.start_date, e.end_date);
    }

    /* special report test ?? */
    const _zoned_time = await zoned_time(_timezone);
    const anomaly_dates = await anomaly_date_create('TESTID', null, _zoned_time);

    for (const [i, e] of anomaly_dates.entries()) {
      const date = format(e[1], 'yyyy-MM-dd');
      const _path = path.join(process.cwd(), 'test', 'files', 'special_report', `date_${i + 1}`);
      const _path_daily = path.join(process.cwd(), 'test', 'files', 'daily_report');

      const seed_time_1 = format(addMinutes(new Date(format(anomaly_dates[i][0], 'yyyy-MM-dd HH:mm')), 1), 'HH:mm:ss');
      const seed_time_2 = format(subMinutes(new Date(format(anomaly_dates[i][1], 'yyyy-MM-dd HH:mm')), 1), 'HH:mm:ss');

      /* sleep */
      const sleep_data = JSON.parse(await fs.readFile(path.join(_path, 'sleep.json'), { encoding: 'utf-8' }));
      let j = 0;
      for (let i = sleep_data.sleep.length - 1; i >= 0; i--) {
        sleep_data.sleep[i].dateOfSleep = format(subDays(new Date(date), j), 'yyyy-MM-dd');
        j++;
      }
      await fs.mkdir(path.join(_path_daily, date), { recursive: true });
      await fs.writeFile(path.join(_path_daily, date, `${date}-sleep.json`), JSON.stringify(sleep_data, null, 2), { encoding: 'utf-8' });

      /* hrv */
      const hrv_data = JSON.parse(await fs.readFile(path.join(_path, 'hrv.json'), { encoding: 'utf-8' }));
      let k = 0;
      for (let i = hrv_data.hrv.length - 1; i >= 0; i--) {
        hrv_data.hrv[i].dateTime = format(subDays(new Date(date), k), 'yyyy-MM-dd');
        k++;
      }
      await fs.mkdir(path.join(_path_daily, date), { recursive: true });
      await fs.writeFile(path.join(_path_daily, date, `${date}-hrv.json`), JSON.stringify(hrv_data, null, 2), { encoding: 'utf-8' });

      /* spo2 */
      const spo2_data = JSON.parse(await fs.readFile(path.join(_path, 'spo2.json'), { encoding: 'utf-8' }));
      let l = 0;
      for (let i = spo2_data.length - 1; i >= 0; i--) {
        spo2_data[i].dateTime = format(subDays(new Date(date), l), 'yyyy-MM-dd');
        l++;
      }
      await fs.mkdir(path.join(_path_daily, date), { recursive: true });
      await fs.writeFile(path.join(_path_daily, date, `${date}-spo2.json`), JSON.stringify(spo2_data, null, 2), { encoding: 'utf-8' });

      /* temp */
      const temp_data = JSON.parse(await fs.readFile(path.join(_path, 'temp.json'), { encoding: 'utf-8' }));
      let m = 0;
      for (let i = temp_data.tempSkin.length - 1; i >= 0; i--) {
        temp_data.tempSkin[i].dateTime = format(subDays(new Date(date), m), 'yyyy-MM-dd');
        m++;
      }
      await fs.mkdir(path.join(_path_daily, date), { recursive: true });
      await fs.writeFile(path.join(_path_daily, date, `${date}-temp.json`), JSON.stringify(temp_data, null, 2), { encoding: 'utf-8' });

      /* heart */
      const heart_data = JSON.parse(await fs.readFile(path.join(_path, 'heart.json'), { encoding: 'utf-8' }));
      heart_data['activities-heart'][0].dateTime = date;
      const seed_index_1 = heart_data['activities-heart-intraday'].dataset.findIndex((e: any) => e.time === seed_time_1);
      const seed_index_2 = heart_data['activities-heart-intraday'].dataset.findIndex((e: any) => e.time === seed_time_2);
      heart_data['activities-heart-intraday'].dataset[seed_index_1].value = 191;
      heart_data['activities-heart-intraday'].dataset[seed_index_2].value = 195;
      await fs.mkdir(path.join(_path_daily, date), { recursive: true });
      await fs.writeFile(path.join(_path_daily, date, `${date}-heart.json`), JSON.stringify(heart_data, null, 2), { encoding: 'utf-8' });

      /* steps */
      const steps_data = JSON.parse(await fs.readFile(path.join(_path, 'steps.json'), { encoding: 'utf-8' }));
      steps_data['activities-steps'][0].dateTime = date;
      await fs.mkdir(path.join(_path_daily, date), { recursive: true });
      await fs.writeFile(path.join(_path_daily, date, `${date}-steps.json`), JSON.stringify(steps_data, null, 2), { encoding: 'utf-8' });
    }

    await special_report(_id, '', Source_System.FITBIT, _name, _dob, null, _user_id);

    for (const e of anomaly_dates) {
      const date = format(e[1], 'yyyy-MM-dd');
      await fs.rm(path.join(process.cwd(), 'test', 'files', 'daily_report', date), { recursive: true, force: true });
    }

    /* check status */
    await check(50, 7, 2, anomaly_dates.length);

    /* updating lastSyncTime to initial value */
    device_data[0].lastSyncTime = initial_last_sync_time;
    await fs.writeFile(path.join(process.cwd(), 'test', 'files', 'devices.json'), JSON.stringify(device_data, null, 2), {
      encoding: 'utf-8',
    });
  } catch (error) {
    console.log('generate error', error);
  }
}

generate();
