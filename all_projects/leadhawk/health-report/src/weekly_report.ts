import { Handler, SQSEvent } from 'aws-lambda';
import { differenceInDays } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';

import { Source_System, Timezone } from './enum/enum.js';
import { get_profile } from './helper/user_helper.js';
import { create_weekly_report } from './report/weekly_report/create_weekly_report.js';
import { notify } from './utils/upload_util.js';

export const handler: Handler = async (event: SQSEvent) => {
  try {
    console.log('handler weekly_report', event);

    const records = event.Records;
    for await (const record of records) {
      const body = JSON.parse(record.body);

      for await (const user of body) {
        const { id, source_system = Source_System.FITBIT, name, file_prefix = null, user_id, start_report_at, end_report_at } = user;

        if (name.includes('null')) {
          console.log('handler weekly_report: some parameters are missing', body);
          continue;
        }

        await weekly_report(id, source_system, name, file_prefix, user_id, start_report_at, end_report_at);
      }
    }
  } catch (error) {
    console.log('handler weekly_report: error', error);
    await notify('handler weekly_report: error', error);
  }
};

export async function weekly_report(
  id: string,
  source_system: Source_System,
  name: string,
  file_prefix: string | null,
  user_id: string,
  start_report_at: string,
  end_report_at: string
) {
  try {
    console.log(`weekly_report - ${id}: start`, { id, source_system, name, file_prefix, user_id, start_report_at, end_report_at });

    /* weekly report check if start_report_at is within 60 days */
    if (differenceInDays(new Date(), new Date(start_report_at)) > 60) {
      console.log(
        `weekly_report - ${id}: start_report_at: ${start_report_at}, current: ${formatInTimeZone(
          new Date(),
          'UTC',
          'yyyy-MM-dd'
        )}, not generating weekly report`
      );

      return;
    }

    /*
    set timezone
    */
    let user_timezone: Timezone | null = null;

    /*
    getting profile details and setting timezone
    */
    const user_profile = await get_profile(id, '', source_system);
    user_timezone = user_profile.timezone;

    if (!user_timezone) {
      console.log(`weekly_report - ${id}: timezone not avaialble`);
      return;
    }

    /*
    computing weekly report
    */
    console.log(`weekly_report - ${id}: computing weekly_report for user: ${id}`);
    await create_weekly_report(id, source_system, name, user_timezone, file_prefix, user_id, start_report_at, end_report_at);
  } catch (error) {
    console.log(`weekly_report - ${id}: error`, error);
    await notify(`weekly_report - ${id}: error`, error);
  } finally {
    console.log(`weekly_report - ${id}: end`);
  }
}
