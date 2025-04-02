import { SQSClient, SendMessageCommand, SendMessageCommandInput } from '@aws-sdk/client-sqs';
import { Handler, SQSEvent } from 'aws-lambda';

import { config } from './config/config.js';
import { ReportController } from './db/dynamodb/report_controller.js';
import { Source_System, Timezone } from './enum/enum.js';
import { report_helper } from './helper/report_helper.js';
import { get_profile } from './helper/user_helper.js';
import { compute_daily_reports } from './report/daily_report/compute_daily_report.js';
import { notify } from './utils/upload_util.js';

const sqs_client = new SQSClient({ region: config.aws.default_region });

export const handler: Handler = async (event: SQSEvent) => {
  try {
    console.log('handler daily_report', event);

    const records = event.Records;
    for await (const record of records) {
      const body = JSON.parse(record.body);
      const {
        id,
        access_token = '',
        source_system = Source_System.FITBIT,
        name,
        dob,
        retry = 0,
        server_retry = 0,
        file_prefix = null,
        user_id,
        intake_date,
      } = body;

      if (name.includes('null')) {
        console.log('handler daily_report: some parameters are missing', body);
        continue;
      }

      await daily_report(id, access_token, source_system, name, dob, retry, server_retry, file_prefix, user_id, intake_date);
    }
  } catch (error) {
    console.log('handler daily_report: error', error);
    await notify('handler daily_report: error', error);
  }
};

export async function daily_report(
  id: string,
  access_token: string,
  source_system: Source_System,
  name: string,
  dob: string,
  retry: number,
  server_retry: number,
  file_prefix: string | null,
  user_id: string,
  intake_date: string
) {
  try {
    console.log(`daily_report - ${id}: start`);

    /*
    server_retry > 3
    */
    if (server_retry > 3) {
      console.log(`daily_report: server_retry: ${server_retry} > 3, stopping now`);
      return;
    }

    /*
    0 < retry <= 5
    */
    if (retry > 0 && retry <= 5) {
      console.log(`daily_report: requeue, retry: ${retry}, requeuing to reset timeout`);
      const sqs_input: SendMessageCommandInput = {
        MessageBody: JSON.stringify({
          id: id,
          access_token: access_token,
          source_system: source_system,
          name: name,
          dob: dob,
          retry: retry + 1,
          file_prefix: file_prefix,
          user_id: user_id,
          intake_date: intake_date,
        }),
        QueueUrl: config.aws.sqs.fetch_url_daily_report,
        DelaySeconds: 900,
      };
      const sqs_command = new SendMessageCommand(sqs_input);
      const sqs_response = await sqs_client.send(sqs_command);
      console.log('daily_report: 0 < retry <= 5 sqs_response', sqs_response);
      return;
    }

    const report_controller = new ReportController();

    /*
    check for user in db
    */
    console.log(`daily_report - ${id}: checking for user in db: ${config.aws.dynamodb.report_table}`);

    const user = await report_controller.get(id);
    if (!user) await report_controller.create(id);

    /*
    set timezone, age
    */
    let user_timezone: Timezone | null = null;
    let user_dob: string | null = null;
    let age = null;

    /*
    getting profile details and setting timezone, dob
    */
    const user_profile = await get_profile(id, access_token, source_system);
    user_timezone = user_profile.timezone;
    user_dob = user_profile.dob;

    if (!user_timezone) {
      console.log('daily_report: timezone not avaialble');
      return;
    }

    /*
    if dob not available from profile and available from sqs update it
    */
    if (!user_dob && dob) {
      user_dob = report_helper.fix_core_dob(dob);
      await report_controller.update(id, { user_id: id, dob: dob });
    }

    /*
    set age
    */
    if (user_dob) age = report_helper.get_age(user_dob);

    /*
    start computing daily reports
    */
    console.log(`daily_report - ${id}: start computing daily reports`);
    await compute_daily_reports(
      id,
      access_token,
      source_system,
      name,
      age,
      user_timezone,
      user,
      retry,
      server_retry,
      file_prefix,
      user_id,
      user_dob,
      intake_date
    );
  } catch (error) {
    console.log(`daily_report - ${id}: error`, error);
    await notify(`daily_report - ${id}: error`, error);
  } finally {
    console.log(`daily_report - ${id}: end`);
  }
}
