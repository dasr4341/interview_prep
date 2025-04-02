import { Api, Source_System, Status } from '../enum/enum.js';
import { Parameters } from '../interface/api_interface.js';
import { notify } from '../utils/upload_util.js';
import { url_builder } from './url_builder.js';

export async function api_call(id: string, access_token: string, source_system: Source_System, api: Api, parameters: Parameters) {
  try {
    /*
    build url
    */
    let source_system_url = '';
    if (source_system === Source_System.FITBIT) {
      source_system_url = (await url_builder(id, source_system, api, parameters)) as string;
    } else if (source_system === Source_System.APPLEWATCH) {
      source_system_url = (await url_builder(id, source_system, api, parameters)) as string;
    }

    /*
    api call
    */
    const authorization = source_system === Source_System.FITBIT ? `Bearer ${access_token}` : '';
    const accept_language = api === Api.TEMP ? 'en_US' : '';

    const start = performance.now();
    const source_system_api_resonse = await fetch(source_system_url, {
      headers: {
        Authorization: authorization,
        'Accept-Language': accept_language,
      },
    });
    const end = performance.now();

    /*
    api response
    */
    const { status: status_code, url } = source_system_api_resonse;
    console.log({ code: status_code, url: url, exec_time: `${end - start}ms` });

    /*
    code !== 200
    */
    if (status_code !== 200) {
      console.log(`api_call - ${id}: api failed`, source_system_api_resonse);
      if (![502, 503, 429].includes(status_code)) {
        await notify(`api_call - ${id}: status_code: ${status_code}`, {});
      }
      return Promise.resolve({ code: status_code, status: Status.FAILURE, data: null, raw_data: source_system_api_resonse });
    }

    /*
    api data
    */
    const source_system_data = await source_system_api_resonse.json();

    /*
    source_system
    */
    if (source_system === Source_System.FITBIT) {
      switch (api) {
        case Api.HEART: {
          return {
            code: status_code,
            status: Status.SUCCESS,
            data: source_system_data?.['activities-heart-intraday']?.dataset,
            raw_data: source_system_data,
          };
        }
        case Api.STEPS: {
          return {
            code: status_code,
            status: Status.SUCCESS,
            data: source_system_data?.['activities-steps-intraday']?.dataset,
            raw_data: source_system_data,
          };
        }
        case Api.SPO2: {
          return { code: status_code, status: Status.SUCCESS, data: source_system_data, raw_data: source_system_data };
        }
        case Api.SLEEP: {
          return { code: status_code, status: Status.SUCCESS, data: source_system_data?.sleep?.reverse(), raw_data: source_system_data };
        }
        case Api.HRV: {
          return { code: status_code, status: Status.SUCCESS, data: source_system_data?.hrv, raw_data: source_system_data };
        }
        case Api.TEMP: {
          return { code: status_code, status: Status.SUCCESS, data: source_system_data?.tempSkin, raw_data: source_system_data };
        }
        case Api.RESTING_HEART_RATE: {
          return {
            code: status_code,
            status: Status.SUCCESS,
            data: source_system_data?.['activities-heart']?.[0]?.value?.restingHeartRate,
            raw_data: source_system_data,
          };
        }
        case Api.PROFILE: {
          return { code: status_code, status: Status.SUCCESS, data: source_system_data?.user, raw_data: source_system_data };
        }
        case Api.DEVICE: {
          return {
            code: status_code,
            status: Status.SUCCESS,
            data: source_system_data?.filter((e: any) => e.deviceVersion !== 'MobileTrack')[0],
            raw_data: source_system_data,
          };
        }
        default:
          break;
      }
    } else if (source_system === Source_System.APPLEWATCH) {
      switch (api) {
        case Api.HEART: {
          return { code: status_code, status: Status.SUCCESS, data: source_system_data?.data, raw_data: source_system_data };
        }
        case Api.STEPS: {
          return { code: status_code, status: Status.SUCCESS, data: source_system_data?.data, raw_data: source_system_data };
        }
        case Api.SPO2: {
          return { code: status_code, status: Status.SUCCESS, data: source_system_data?.data, raw_data: source_system_data };
        }
        case Api.SLEEP: {
          return { code: status_code, status: Status.SUCCESS, data: source_system_data?.data, raw_data: source_system_data };
        }
        case Api.HRV: {
          return { code: status_code, status: Status.SUCCESS, data: source_system_data?.data, raw_data: source_system_data };
        }
        case Api.TEMP: {
          return { code: status_code, status: Status.SUCCESS, data: source_system_data?.data, raw_data: source_system_data };
        }
        case Api.RESTING_HEART_RATE: {
          return { code: status_code, status: Status.SUCCESS, data: source_system_data?.data[0]?.value, raw_data: source_system_data };
        }
        case Api.PROFILE: {
          return { code: status_code, status: Status.SUCCESS, data: source_system_data?.data, raw_data: source_system_data };
        }
        case Api.DEVICE: {
          return { code: status_code, status: Status.SUCCESS, data: source_system_data?.data, raw_data: source_system_data };
        }
        case Api.STEPS_DAILY: {
          return { code: status_code, status: Status.SUCCESS, data: source_system_data?.data, raw_data: source_system_data };
        }
        case Api.STEPS_TOTAL: {
          return { code: status_code, status: Status.SUCCESS, data: source_system_data?.data, raw_data: source_system_data };
        }
        default:
          break;
      }
    }
  } catch (error) {
    console.log(`api_call - ${id}: error`, error);
    await notify(`api_call - ${id}: error`, error);
  }
}
