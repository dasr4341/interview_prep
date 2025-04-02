import { addDays, differenceInDays, subDays } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';

import { config } from '../../config/config.js';
import { Source_System, Timezone } from '../../enum/enum.js';
import { date_helper } from '../../helper/date_helper.js';
import { report_helper } from '../../helper/report_helper.js';
import { zoned_time } from '../../helper/timezone_helper.js';
import { DynamoDB_User } from '../../interface/dynamodb_interface.js';
import { create_daily_report } from './create_daily_report.js';

export async function compute_daily_reports(
  id: string,
  access_token: string,
  source_system: Source_System,
  name: string,
  age: number | null,
  timezone: Timezone,
  user: DynamoDB_User | null | undefined,
  retry: number,
  server_retry: number,
  file_prefix: string | null,
  user_id: string,
  dob: string | null,
  intake_date: string
) {
  /* set api time */
  console.log(`compute_daily_reports - ${id}: setting api time`);

  const _zonedTime = await zoned_time(timezone);
  const date = formatInTimeZone(_zonedTime, 'UTC', 'yyyy-MM-dd');
  console.log(`compute_daily_reports - ${id}: zonedTime:`, _zonedTime);

  /* check for last_daily_report_runtime  */
  console.log(`compute_daily_reports - ${id}: checking for last_daily_report_runtime from db: ${config.aws.dynamodb.report_table}`);
  const last_daily_report_runtime = user?.last_daily_report_runtime;
  console.log(`compute_daily_reports - ${id}: last_daily_report_runtime: ${last_daily_report_runtime}`);

  /* computing dates to generate report */
  const date_arr = [];

  /* computing daily report for day before eg: 10th daily report check is 9th report generation */
  const report_date = subDays(new Date(date), 1);
  console.log(`compute_daily_reports - ${id}: report_date:`, report_date);

  if (!last_daily_report_runtime) {
    const _intake_date = report_helper.fix_core_intake_date(intake_date);
    const diff_in_intake_and_report_date = differenceInDays(new Date(), new Date(_intake_date));

    let fill_value = 7;
    if (diff_in_intake_and_report_date < 7) fill_value = diff_in_intake_and_report_date;

    let i = 0;
    const res = new Array(fill_value).fill('_').map((e) => {
      const push_date = formatInTimeZone(subDays(new Date(report_date), i), 'UTC', 'yyyy-MM-dd');
      i++;
      return push_date;
    });

    date_arr.push(...res);
  }

  if (last_daily_report_runtime) {
    const delta = differenceInDays(new Date(report_date), new Date(last_daily_report_runtime));

    if (delta === 0) {
      date_arr.push(formatInTimeZone(report_date, 'UTC', 'yyyy-MM-dd'));
    } else {
      let start = addDays(new Date(last_daily_report_runtime), 1);
      let end = new Date(report_date);

      if (delta > 7) {
        start = subDays(new Date(report_date), 6);
        end = new Date(report_date);
      }

      const arr = date_helper.get_dates_between(start, end).map((e) => formatInTimeZone(e, 'UTC', 'yyyy-MM-dd'));

      date_arr.push(...arr);
    }
  }

  console.log(`compute_daily_reports - ${id}: computing reports for dates:`, date_arr);

  /* generating report */
  for (const date of date_arr) {
    try {
      console.log(`\ncompute_daily_reports - ${id}: computing daily report, date: ${date}`);
      const res = await create_daily_report(
        id,
        access_token,
        source_system,
        name,
        age,
        timezone,
        date,
        retry,
        server_retry,
        file_prefix,
        user_id,
        dob,
        intake_date
      );
      if (res === 'stop') break;
    } catch (error) {
      throw new Error(`compute_daily_reports - ${id}: failed to run generate_daily_report`);
    }
  }
}
