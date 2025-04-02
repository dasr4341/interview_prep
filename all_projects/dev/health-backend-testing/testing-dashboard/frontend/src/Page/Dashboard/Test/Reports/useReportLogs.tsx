import { logsApi } from 'Lib/Api/Axios/logs/logsApi';
import { ReportLogApiResponse } from 'Lib/Api/Axios/logs/logsApi.interface';
import { useEffect, useState } from 'react';

export default function useReportLogs({
  userId,
  date,
}: {
  userId?: string | null;
  date?: string | null;
}) {
  const [columns] = useState<any>([
    {
      field: 'step',
    },
    {
      field: 'user_id',
    },
    {
      field: 'created_at',
    },
    {
      field: 'logs',
      width: 1500,
    },
  ]);
  const [rows, setRows] = useState<ReportLogApiResponse[]>([]);

  useEffect(() => {
    if (userId && date) {
      const getReportLogs = async () => {
        const response = await logsApi.getReportLogs<ReportLogApiResponse[]>({
          userId,
          date,
        });
        setRows(response.data);
      };
      getReportLogs();
    }
  }, [date, userId]);

  return {
    rows,
    columns,
  };
}
