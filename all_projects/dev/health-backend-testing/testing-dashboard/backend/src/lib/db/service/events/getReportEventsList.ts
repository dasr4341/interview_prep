import { Request } from 'express';
import { getRemoteData } from '../../dbInstance';
import { ReportTestPayload } from '../../../../interface/report.interface';
import { EnvironmentList } from '../../../../config/config.enum';

export const getReportEventList = async (payload:ReportTestPayload,  dbInstance: EnvironmentList) => {

  try {
    const query = {
      text: `
      SELECT e.id, e.text_detail, e."text", e.created_at, 
      e."type", e.consolidated, e.patient_id, e.frequency, e.no_report,
      u.first_name, u.last_name, u.email, f.time_zone, f.name
      
      FROM public.events e
      Inner JOIN public.users u ON e.patient_id = u.id
      Inner join public.users_on_facilities uf on uf.user_id = e.patient_id
      Inner join public.facilities f on f.id = e.facility_id
      WHERE e.facility_id = $1
      and e."type" = 'REPORT'
      and e.consolidated = false
      and DATE(e.created_at) = $2
      and e.frequency = $3
      ORDER BY e.created_at DESC;
      `,
      values: [payload.facilityId, `${payload.date}`, payload.freQuency],
    };


    return await getRemoteData({ query, dbInstance });
  } catch (e) {
    throw e;
  }
};
