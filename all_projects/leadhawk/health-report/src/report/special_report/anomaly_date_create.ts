import { differenceInDays, subDays } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';

import { date_helper } from '../../helper/date_helper.js';
import { DynamoDB_User } from '../../interface/dynamodb_interface.js';

export async function anomaly_date_create(id: string, user: DynamoDB_User | null | undefined, zoned_time: Date) {
  let last_special_report_runtime: Date | undefined = undefined;

  if (!user?.last_special_report_runtime) {
    last_special_report_runtime = subDays(zoned_time, 1);
  } else {
    last_special_report_runtime = new Date(user?.last_special_report_runtime);
    if (differenceInDays(zoned_time, last_special_report_runtime) > 7) {
      last_special_report_runtime = subDays(zoned_time, 6);
    }
  }

  console.log(`anomaly_date_generation - ${id}: last_special_report_runtime`, last_special_report_runtime);

  const start_anomaly_date = last_special_report_runtime;
  const end_anomaly_date = zoned_time;

  console.log(`anomaly_date_generation - ${id}:`, { start_anomaly_date, end_anomaly_date });

  console.log(`anomaly_date_generation - ${id}: creating api array`);
  const delta = differenceInDays(
    new Date(formatInTimeZone(end_anomaly_date, 'UTC', 'yyyy-MM-dd')),
    new Date(formatInTimeZone(start_anomaly_date, 'UTC', 'yyyy-MM-dd'))
  );

  const anomaly_date_list = [];

  // do not touch this code, it just works, tampering this will result in catastrophic failure

  if (!delta && formatInTimeZone(zoned_time, 'UTC', 'yyyy-MM-dd') === formatInTimeZone(last_special_report_runtime, 'UTC', 'yyyy-MM-dd')) {
    anomaly_date_list.push([last_special_report_runtime, zoned_time]);
  } else {
    let end = date_helper.end_of_day(last_special_report_runtime);
    anomaly_date_list.push([last_special_report_runtime, end]);

    for (let i = 1; i < delta; i++) {
      anomaly_date_list.push([date_helper.add_seconds(end, 1), date_helper.end_of_day(date_helper.add_seconds(end, 1))]);
      end = date_helper.end_of_day(date_helper.add_seconds(end, 1));
    }
    anomaly_date_list.push([date_helper.start_of_day(zoned_time), zoned_time]);
  }

  console.log(`anomaly_date_generation - ${id}: anomaly_date_list`, anomaly_date_list);

  return anomaly_date_list;
}
