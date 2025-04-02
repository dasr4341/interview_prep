import { config } from '../config/config.js';
import { Api, Source_System } from '../enum/enum.js';
import { Parameters } from '../interface/api_interface.js';
import { notify } from '../utils/upload_util.js';

export async function url_builder(id: string, source_system: Source_System, api: Api, parameters: Parameters) {
  try {
    if (source_system === Source_System.FITBIT) {
      const base_url = config.source_system.fitbit.base_url;

      switch (api) {
        case Api.HEART: {
          const { start_date, end_date, start_time, end_time } = parameters;
          return `${base_url}/1/user/-/activities/heart/date/${start_date}/${end_date}/1min/time/${start_time}/${end_time}.json`;
        }
        case Api.STEPS: {
          const { start_date, end_date, start_time, end_time } = parameters;
          return `${base_url}/1/user/-/activities/steps/date/${start_date}/${end_date}/1min/time/${start_time}/${end_time}.json`;
        }
        case Api.SPO2: {
          const { start_date, end_date } = parameters;
          return `${base_url}/1/user/-/spo2/date/${start_date}/${end_date}.json`;
        }
        case Api.SLEEP: {
          const { start_date, end_date } = parameters;
          return `${base_url}/1.2/user/-/sleep/date/${start_date}/${end_date}.json`;
        }
        case Api.HRV: {
          const { start_date, end_date } = parameters;
          return `${base_url}/1/user/-/hrv/date/${start_date}/${end_date}.json`;
        }
        case Api.TEMP: {
          const { start_date, end_date } = parameters;
          return `${base_url}/1/user/-/temp/skin/date/${start_date}/${end_date}.json`;
        }
        case Api.RESTING_HEART_RATE: {
          const { date } = parameters;
          return `${base_url}/1/user/-/activities/heart/date/${date}/1d.json`;
        }
        case Api.PROFILE: {
          return `${base_url}/1/user/-/profile.json`;
        }
        case Api.DEVICE: {
          return `${base_url}/1/user/-/devices.json`;
        }
        default:
          break;
      }
    } else if (source_system === Source_System.APPLEWATCH) {
      const base_url = config.source_system.applewatch.base_url;

      switch (api) {
        case Api.HEART: {
          const { start_date, end_date, start_time, end_time } = parameters;
          return `${base_url}/activities/heart/date/${start_date}/${end_date}/time/${start_time}/${end_time}?userId=${id}`;
        }
        case Api.STEPS: {
          const { start_date, end_date, start_time, end_time } = parameters;
          return `${base_url}/activities/steps/date/${start_date}/${end_date}/time/${start_time}/${end_time}?userId=${id}`;
        }
        case Api.SPO2: {
          const { start_date, end_date } = parameters;
          return `${base_url}/activities/spo2/date/${start_date}/${end_date}?userId=${id}`;
        }
        case Api.SLEEP: {
          const { start_date, end_date } = parameters;
          return `${base_url}/activities/sleep/date/${start_date}/${end_date}?userId=${id}`;
        }
        case Api.HRV: {
          const { start_date, end_date } = parameters;
          return `${base_url}/activities/hrv/date/${start_date}/${end_date}?userId=${id}`;
        }
        case Api.TEMP: {
          const { start_date, end_date } = parameters;
          return `${base_url}/activities/appleSleepingWristTemperature/date/${start_date}/${end_date}?userId=${id}`;
        }
        case Api.RESTING_HEART_RATE: {
          const { date } = parameters;
          return `${base_url}/activities/restingHeartRate/date/${date}?userId=${id}`;
        }
        case Api.PROFILE: {
          return `${base_url}/user/profile?userId=${id}`;
        }
        case Api.DEVICE: {
          return `${base_url}/user/device?userId=${id}`;
        }
        case Api.STEPS_DAILY: {
          const { start_date, end_date, start_time, end_time } = parameters;
          return `${base_url}/activities/stepsDaily/date/${start_date}/${end_date}/time/${start_time}/${end_time}?userId=${id}`;
        }
        case Api.STEPS_TOTAL: {
          const { date } = parameters;
          return `${base_url}/activities/stepsTotal/date/${date}?userId=${id}`;
        }
        default:
          break;
      }
    }
  } catch (error) {
    console.log('url_builder: error', error);
    await notify('url_builder: error', error);
  }
}
