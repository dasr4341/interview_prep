import { config } from '../config/config.js';
import { daily_report } from '../daily_report.js';

if (config.dev_mode) {
  console.log('daily_report: local');
  const body = JSON.parse(config.users)[0];
  const { id, access_token = '', source_system, name, dob, retry = 0, server_retry = 0, user_id, intake_date } = body;
  await daily_report(id, access_token, source_system, name, dob, retry, server_retry, null, user_id, intake_date);
}
