import { api } from '../api/api.js';
import { ReportController } from '../db/dynamodb/report_controller.js';
import { Api, Source_System, Status, Timezone } from '../enum/enum.js';
import { report_helper } from './report_helper.js';

export async function get_profile(id: string, access_token: string, source_system: Source_System) {
  console.log('get_profile: getting user profile');

  const report_controller = new ReportController();

  const user_data = await report_controller.get(id);
  let timezone = user_data?.time_zone ?? null;
  let dob = user_data?.dob ?? null;

  if (!timezone || !dob) {
    console.log('get_profile: calling api to get profile');
    let source_system_profile_data: { timezone: Timezone; dob: string } | null = null;
    const source_system_api_response = await api(id, access_token, source_system, Api.PROFILE, {});

    if (source_system_api_response?.status === Status.FAILURE) {
      return {
        timezone: null,
        dob: null,
      };
    }

    if (source_system === Source_System.FITBIT) {
      if (source_system_api_response) {
        const { timezone = null, dateOfBirth = null } = source_system_api_response.data;
        source_system_profile_data = { timezone: timezone, dob: dateOfBirth };
      }
    } else if (source_system === Source_System.APPLEWATCH) {
      if (source_system_api_response) {
        const { timeZone = null, dateOfBirth = null } = source_system_api_response.data;
        source_system_profile_data = { timezone: timeZone, dob: dateOfBirth };
      }
    }

    await report_controller.update(id, {
      user_id: id,
      time_zone: source_system_profile_data?.timezone as Timezone,
      dob: source_system_profile_data?.dob ? report_helper.fix_core_dob(source_system_profile_data?.dob) : source_system_profile_data?.dob,
    });

    timezone = source_system_profile_data?.timezone ?? null;
    dob = source_system_profile_data?.dob ?? null;
  }

  return {
    timezone,
    dob,
  };
}
