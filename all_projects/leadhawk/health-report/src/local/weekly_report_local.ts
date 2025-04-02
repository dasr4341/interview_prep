import { config } from '../config/config.js';
import { weekly_report } from '../weekly_report.js';

if (config.dev_mode) {
  console.log('weekly_report: local');
  const body = JSON.parse(config.users);
  for await (const user of body) {
    const { id, source_system, name, user_id, start_report_at, end_report_at } = user;
    await weekly_report(id, source_system, name, null, user_id, start_report_at, end_report_at);
  }
}
