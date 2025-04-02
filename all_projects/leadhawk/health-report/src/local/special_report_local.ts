import { config } from '../config/config.js';
import { special_report } from '../special_report.js';

if (config.dev_mode) {
  console.log('special_report: local');
  const body = JSON.parse(config.users);
  for await (const user of body) {
    const { id, access_token = '', source_system, name, dob, user_id } = user;
    await special_report(id, access_token, source_system, name, dob, null, user_id);
  }
}
