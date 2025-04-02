import { getRemoteData } from '../../dbInstance';
import { ReportLogsPayload } from './logsSchema';
import { format } from 'date-fns';
import { EnvironmentList } from '../../../../config/config.enum';

export const getReportLogs = async (payload: ReportLogsPayload, dbInstance: EnvironmentList) => {
  const startDate = `${format(new Date(payload.date), 'yyyy-MM-dd')}  00:00:00`;
  const endDate = `${format(new Date(payload.date), 'yyyy-MM-dd')}  24:00:00`;

  try {
    const query = {
      text: `
      select * 
      from daily_report_logs drg
      WHERE drg.user_id = $1
      and drg.created_at > $2
      and drg.created_at < $3
      ORDER BY drg.created_at DESC
      `,
      values: [payload.userId, startDate, endDate],
    };

    return await getRemoteData({ query, dbInstance });
  } catch (e) {
    throw e;
  }
};
