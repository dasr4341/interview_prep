import { config } from '../config/config.js';
import { monthly_report } from '../monthly_report.js';

if (config.dev_mode) {
  console.log('monthly_report: local');
  const body = JSON.parse(config.users);
  for await (const user of body) {
    const { id, source_system, name, user_id, start_report_at, end_report_at } = user;
    await monthly_report(id, source_system, name, null, user_id, start_report_at, end_report_at);
  }
}
