import { report_helper } from '../../helper/report_helper.js';
import { Daily_Report_Data } from '../../interface/report_interface.js';
import { notify, upload_data } from '../../utils/upload_util.js';

export async function upload_raw_data(
  id: string,
  data: Daily_Report_Data,
  heart_clone: any,
  steps_clone: any,
  spo2_clone: any,
  sleep_clone: any,
  hrv_clone: any,
  temp_clone: any,
  resting_hr_clone: any
) {
  try {
    console.log(`create_daily_report - ${id}: uploading raw api data`);
    const [
      heart_clone_buffer,
      steps_clone_buffer,
      spo2_clone_buffer,
      sleep_clone_buffer,
      hrv_clone_buffer,
      temp_clone_buffer,
      resting_hr_clone_buffer,
    ] = await Promise.allSettled([
      report_helper.create_buffer(heart_clone),
      report_helper.create_buffer(steps_clone),
      report_helper.create_buffer(spo2_clone),
      report_helper.create_buffer(sleep_clone),
      report_helper.create_buffer(hrv_clone),
      report_helper.create_buffer(temp_clone),
      report_helper.create_buffer(resting_hr_clone),
    ]);

    if (
      heart_clone_buffer.status === 'fulfilled' &&
      steps_clone_buffer.status === 'fulfilled' &&
      spo2_clone_buffer.status === 'fulfilled' &&
      sleep_clone_buffer.status === 'fulfilled' &&
      hrv_clone_buffer.status === 'fulfilled' &&
      temp_clone_buffer.status === 'fulfilled' &&
      resting_hr_clone_buffer.status === 'fulfilled'
    ) {
      await Promise.allSettled([
        upload_data(heart_clone_buffer.value, data.apiData.heart),
        upload_data(steps_clone_buffer.value, data.apiData.steps),
        upload_data(spo2_clone_buffer.value, data.apiData.spo2),
        upload_data(sleep_clone_buffer.value, data.apiData.sleep),
        upload_data(hrv_clone_buffer.value, data.apiData.hrv),
        upload_data(temp_clone_buffer.value, data.apiData.temp),
        upload_data(resting_hr_clone_buffer.value, data.apiData.restingHeartRate),
      ]);
    }
  } catch (error) {
    console.log(`upload_raw_data - ${id}: error`, error);
    await notify(`upload_raw_data - ${id}: error`, error);
  }
}
