import { reportsApi } from 'Lib/Api/Axios/reports/reports-api';

import { useState } from 'react';
import { ReportFilterFormValues } from './ReportFilterFormValues.interface';
import { format } from 'date-fns';
import {
  ReportRow,
  ReportTableColumn,
  ReportTableRow,
  ReportsData,
} from './ReportsData.interface';
import { notifications } from '@mantine/notifications';
import RowOptions from './RowOptions';
import useGetFacilities from 'Lib/customHooks/useGetFacilities';

export default function useReportTestData({ onError }: { 
  onError: (message: string | null) => void
}) {
  
  const facilities = useGetFacilities({ onError });

  const [reportsData, setReportsData] = useState<ReportsData | null>(null);
  const [reportsDataLoading, setReportsDataLoading] = useState(false);

  const [tableRows, setTableRows] = useState<ReportTableRow[][]>([]);
  const [tableColumns, setTableColumns] = useState<ReportTableColumn[]>([]);

  const [selectedFitbitUserId, setSelectedFitbitUserId] = useState<string | null>();


  function paramsTest(data: ReportRow) {
    setSelectedFitbitUserId(data.user_id);
  }


  const getReportsData = async (payload: ReportFilterFormValues) => {
    setReportsDataLoading(true);
    try {
      const response = await reportsApi.getReports({
        ...payload,
        date: format(payload.date, 'MM-dd-yyyy'),
      });
      setReportsData(response);
      // Todo: has incorrect data types. Data types need to change 
      const data  = response.table.rows.map((e: any) => {
        return {
          ...e,
          discharge_date: new Date(e.discharge_date)
        };
      });
      console.log(data);
      setTableRows(data);
      setTableColumns(response.table.columns.concat([{ field: 'options', headerName: '', cellRenderer: RowOptions, cellRendererParams: {
        paramsTest: paramsTest
      }
      } as any]));
      onError(null);
      notifications.show({ message: 'Reports data available' });
    } catch (e: any) {
      onError(e.message);
      notifications.show({ message: e.message });
    } finally {
      setReportsDataLoading(false);
    }
  };

  return {
    facilities,
    getReportsData,
    reportsDataLoading,
    reportsData,
    tableRows,
    tableColumns,
    selectedFitbitUserId,
    setSelectedFitbitUserId
  };
}
