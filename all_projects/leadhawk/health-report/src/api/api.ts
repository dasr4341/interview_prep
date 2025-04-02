import { Api, Source_System, Status } from '../enum/enum.js';
import { activity_helper } from '../helper/activity_helper.js';
import { Parameters } from '../interface/api_interface.js';
import { api_call } from './api_call.js';

export async function api(id: string, access_token: string, source_system: Source_System, api: Api, parameters: Parameters) {
  const source_system_api_response = await api_call(id, access_token, source_system, api, parameters);

  if (source_system === Source_System.FITBIT) {
    switch (api) {
      case Api.HEART: {
        if (source_system_api_response?.status === Status.FAILURE || !source_system_api_response?.data?.length) {
          return { ...source_system_api_response, data: null };
        }
        return source_system_api_response;
      }
      case Api.STEPS: {
        if (source_system_api_response?.status === Status.FAILURE || !source_system_api_response?.data?.length) {
          return { ...source_system_api_response, data: null };
        }
        return source_system_api_response;
      }
      case Api.SPO2: {
        if (source_system_api_response?.status === Status.FAILURE || !source_system_api_response?.data?.length) {
          return { ...source_system_api_response, data: null };
        }
        return source_system_api_response;
      }
      case Api.SLEEP: {
        if (source_system_api_response?.status === Status.FAILURE || !source_system_api_response?.data?.length) {
          return { ...source_system_api_response, data: null };
        }
        const data = source_system_api_response.data.map((e: any) => ({ dateOfSleep: e.dateOfSleep, minutesAsleep: e.minutesAsleep }));
        const fix_sleep_data = activity_helper.sleep_fix_repeating_iterations(data);
        return { ...source_system_api_response, data: fix_sleep_data };
      }
      case Api.HRV: {
        if (source_system_api_response?.status === Status.FAILURE || !source_system_api_response?.data?.length) {
          return { ...source_system_api_response, data: null };
        }
        const data = source_system_api_response.data.map((e: any) => ({
          dateTime: e.dateTime,
          value: { dailyRmssd: e.value.dailyRmssd === 0 ? null : Math.round(e.value.dailyRmssd) },
        }));
        return { ...source_system_api_response, data };
      }
      case Api.TEMP: {
        if (source_system_api_response?.status === Status.FAILURE || !source_system_api_response?.data?.length) {
          return { ...source_system_api_response, data: null };
        }
        const data = source_system_api_response.data.map((e: any) => ({ dateTime: e.dateTime, value: e.value }));
        return { ...source_system_api_response, data };
      }
      case Api.RESTING_HEART_RATE: {
        if (source_system_api_response?.status === Status.FAILURE || !source_system_api_response?.data) {
          return { ...source_system_api_response, data: null };
        }
        return source_system_api_response;
      }
      case Api.PROFILE: {
        if (source_system_api_response?.status === Status.FAILURE || !source_system_api_response?.data) {
          return { ...source_system_api_response, data: null };
        }
        return source_system_api_response;
      }
      case Api.DEVICE: {
        if (source_system_api_response?.status === Status.FAILURE || !source_system_api_response?.data) {
          return { ...source_system_api_response, data: null };
        }
        const deviceSyncTime = source_system_api_response?.data?.lastSyncTime;
        const deviceBattery = source_system_api_response?.data?.batteryLevel;
        const deviceName = source_system_api_response?.data?.deviceVersion;
        const data = {
          raw_device_time: deviceSyncTime ? new Date(`${deviceSyncTime}Z`) : null,
          deviceSyncTime: deviceSyncTime ? deviceSyncTime.split('T').join(' ').split('.')[0] : '',
          deviceBattery: deviceBattery ? String(deviceBattery) : '',
          deviceName: deviceName ? deviceName : '',
          deviceFactoryModelRawName: '',
        };
        return { ...source_system_api_response, data };
      }
      default:
        break;
    }
  } else if (source_system === Source_System.APPLEWATCH) {
    switch (api) {
      case Api.HEART: {
        if (source_system_api_response?.status === Status.FAILURE || !source_system_api_response?.data?.length) {
          return { ...source_system_api_response, data: null };
        }
        const data = source_system_api_response.data.map((e: any) => ({ time: e.time.split(' ')[1], value: Math.round(e.value) }));
        return { ...source_system_api_response, data };
      }
      case Api.STEPS: {
        if (source_system_api_response?.status === Status.FAILURE || !source_system_api_response?.data?.length) {
          return { ...source_system_api_response, data: null };
        }
        const data = source_system_api_response.data.map((e: any) => ({ ...e, time: e.time.split(' ')[1] }));
        return { ...source_system_api_response, data };
      }
      case Api.SPO2: {
        if (source_system_api_response?.status === Status.FAILURE || !source_system_api_response?.data?.length) {
          return { ...source_system_api_response, data: null };
        }
        const data = source_system_api_response.data.map((e: any) => ({ dateTime: e.time, value: { avg: e.value } }));
        return { ...source_system_api_response, data };
      }
      case Api.SLEEP: {
        if (source_system_api_response?.status === Status.FAILURE || !source_system_api_response?.data?.length) {
          return { ...source_system_api_response, data: null };
        }
        const data = source_system_api_response.data.map((e: any) => {
          const sleep_aggregate = Number(e.value.asleepCore + e.value.asleepDeep + e.value.asleepREM);
          return {
            dateOfSleep: e.time,
            minutesAsleep: !sleep_aggregate ? null : sleep_aggregate,
          };
        });
        return { ...source_system_api_response, data };
      }
      case Api.HRV: {
        if (source_system_api_response?.status === Status.FAILURE || !source_system_api_response?.data?.length) {
          return { ...source_system_api_response, data: null };
        }
        const data = source_system_api_response.data.map((e: any) => ({ dateTime: e.time, value: { dailyRmssd: Math.round(e.value) } }));
        return { ...source_system_api_response, data };
      }
      case Api.TEMP: {
        if (source_system_api_response?.status === Status.FAILURE || !source_system_api_response?.data?.length) {
          return { ...source_system_api_response, data: null };
        }
        const data = source_system_api_response.data.map((e: any) => ({ dateTime: e.time, value: { nightlyRelative: e.value } }));
        return { ...source_system_api_response, data };
      }
      case Api.RESTING_HEART_RATE: {
        if (source_system_api_response?.status === Status.FAILURE || !source_system_api_response?.data) {
          return { ...source_system_api_response, data: null };
        }
        return source_system_api_response;
      }
      case Api.PROFILE: {
        if (source_system_api_response?.status === Status.FAILURE || !source_system_api_response?.data) {
          return { ...source_system_api_response, data: null };
        }
        return source_system_api_response;
      }
      case Api.DEVICE: {
        if (source_system_api_response?.status === Status.FAILURE || !source_system_api_response?.data) {
          return { ...source_system_api_response, data: null };
        }
        const deviceSyncTime = source_system_api_response?.data?.deviceSyncTime;
        const deviceBattery = source_system_api_response?.data?.deviceBattery;
        const deviceName = source_system_api_response?.data?.deviceFactoryModelName;
        const deviceFactoryModelRawName = source_system_api_response?.data?.deviceFactoryModelRawName;
        const data = {
          raw_device_time: deviceSyncTime ? new Date(`${deviceSyncTime.split(' ').join('T')}Z`) : null,
          deviceSyncTime: deviceSyncTime ?? '',
          deviceBattery: deviceBattery ? String(deviceBattery) : '',
          deviceName: deviceName ? deviceName : '',
          deviceFactoryModelRawName: deviceFactoryModelRawName ? deviceFactoryModelRawName : '',
        };
        return { ...source_system_api_response, data };
      }
      case Api.STEPS_DAILY: {
        if (source_system_api_response?.status === Status.FAILURE || !source_system_api_response?.data?.length) {
          return { ...source_system_api_response, data: null };
        }
        const data = source_system_api_response.data.map((e: any) => ({ ...e, time: e.time.split(' ')[1] }));
        return { ...source_system_api_response, data };
      }
      case Api.STEPS_TOTAL: {
        if (source_system_api_response?.status === Status.FAILURE || !source_system_api_response?.data?.length) {
          return { ...source_system_api_response, data: null };
        }
        return source_system_api_response;
      }
      default:
        break;
    }
  }
}

// const data = await api(
//   'c0a97133-c147-46c0-a5b8-9f011bec6216',
//   'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyMzhWNUQiLCJzdWIiOiJCOVJRV1IiLCJpc3MiOiJGaXRiaXQiLCJ0eXAiOiJhY2Nlc3NfdG9rZW4iLCJzY29wZXMiOiJyc29jIHJzZXQgcm94eSBycHJvIHJudXQgcnNsZSByY2YgcmFjdCBybG9jIHJyZXMgcndlaSByaHIgcnRlbSIsImV4cCI6MTY5NzA0MDEyOCwiaWF0IjoxNjk3MDExMzI4fQ.1p3gQ3MjuA0OzuWvgrxywikL122XGUqtRNAgK9lm-cE',
//   Source_System.FITBIT,
//   Api.DEVICE,
//   {
//     start_date: '2023-08-25',
//     end_date: '2023-08-28',
//     start_time: '00:00',
//     end_time: '23:59',
//     date: '2023-08-25',
//   }
// );

// console.log(data);
