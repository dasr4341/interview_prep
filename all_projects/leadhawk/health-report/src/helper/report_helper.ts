import fs from 'fs';
import path from 'path';
import { formatInTimeZone } from 'date-fns-tz';

export const report_helper = {
  report_id: (user_id: string, MMdd: string) => {
    const id = user_id
      .slice(0, 6)
      .split('')
      .map((e) => e.charCodeAt(0))
      .join('');
    return `${id}${MMdd}`;
  },

  decodeReportId: (report_id: string) => {
    const user_id = report_id.slice(0, -4);
    const res = [];
    for (let i = 0; i < user_id.length; i += 2) {
      res.push(Number(user_id.slice(i, i + 2)));
    }
    return String.fromCharCode(...res);
  },

  create_buffer: (data: object) => {
    const _ = data ? JSON.stringify(data) : JSON.stringify({});
    return Buffer.from(_);
  },

  create_json: (arr_data: { data: object; name: string }[]) => {
    for (const data of arr_data) {
      fs.writeFileSync(path.join(process.cwd(), 'debug', 'json', `${data.name.split('.').at(0)}.json`), JSON.stringify(data.data, null, 2));
    }
  },

  get_age: (dob: string) => {
    return Math.floor((new Date().getTime() - new Date(dob).getTime()) / (1000 * 60 * 60 * 24 * 365));
  },

  fix_core_dob: (dob: string) => {
    return formatInTimeZone(new Date(dob), 'UTC', 'yyyy-MM-dd');
  },

  fix_core_intake_date: (intake_date: string) => {
    return formatInTimeZone(new Date(intake_date), 'UTC', 'yyyy-MM-dd');
  },

  applewatch_temperature_support: (factory_model_raw_name: string) => {
    if (!factory_model_raw_name) return false;

    const model = /watch(?<major>\d),(?<minor>\d*)/gim.exec(factory_model_raw_name)?.groups;

    if (model?.major && model.minor) {
      if (Number(model.major) > 6) {
        return true;
      }
      if (Number(model.major) === 6 && Number(model.minor) >= 14) {
        return true;
      }
      return false;
    }

    return false;
  },
};

report_helper.applewatch_temperature_support('Watch6,9');
