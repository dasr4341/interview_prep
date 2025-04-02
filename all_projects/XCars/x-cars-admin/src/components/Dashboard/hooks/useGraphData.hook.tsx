import { DashboardReportType } from '@/generated/graphql';
import { GET_DASHBOARD_REPORT_BY_DATES } from '@/graphql/dashboard-analytics.query';
import { useLazyQuery } from '@apollo/client';
import { useEffect, useMemo } from 'react';

const useGraphData = ({
  type,
  startDate,
  endDate,
}: {
  startDate: string | Date | null;
  endDate: string | Date | null;
  type: DashboardReportType;
}) => {
  const variables = useMemo(() => {
    return {
      type: type,
      startDate,
      endDate,
    };
  }, [type, startDate, endDate]);
  const [fetchGraphDataCallback, { data, loading }] = useLazyQuery(
    GET_DASHBOARD_REPORT_BY_DATES
  );
  useEffect(() => {
    if (startDate && endDate) {
      fetchGraphDataCallback({
        variables: variables,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variables, fetchGraphDataCallback]);
  return {
    dataArr: data?.getReportByDateRangeDashboard.data || [],
    loading,
  };
};

export default useGraphData;
