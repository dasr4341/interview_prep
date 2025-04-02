import { DisclosureIcon } from 'components/icons/DisclosureIcon';
import { Link } from 'react-router-dom';
import { routes } from 'routes';
import DoughnutChart from '../charts/DoughnutChart';
import NameInitials from 'components/ui/nameInitials/NameInitials';
import { PretaaGetManagerAndReporteeData_pretaaGetManagerAndReporteeData_reportees } from 'generatedTypes';
import Humanize from 'humanize-plus';
import { useSelector } from 'react-redux';
import { RootState } from 'lib/store/app-store';
import { useMemo } from 'react';

interface Props {
  reportee: PretaaGetManagerAndReporteeData_pretaaGetManagerAndReporteeData_reportees;
}

export default function ReporteeListRow({ reportee }: Props) {
  const salesStages = useSelector((state: RootState) => state.dataSource.salesStage);

  const reporteeChartData = useMemo(() => {
    return {
      backgroundColor:
        reportee?.stageWiseRevenue?.map((r) => {
          const s = salesStages.find((o) => o.displayName === r.label);
          return s?.color || '';
        }) || [],
      customData:
        reportee?.stageWiseRevenue?.map(
          ({ revenueAmount }: { label: string; revenueAmount: number }) => revenueAmount
        ) || [],
      cutout: '75%',
    };
  }, [reportee.stageWiseRevenue, salesStages]);

  return (
    <>
      <div data-test-id="team-members-wrap"className="bg-white border-b border-gray-350 px-5 py-6 flex flex-col md:flex-row md:items-center">
        <div data-test-id ="pipeline-insight"className="flex space-x-3 w-full md:w-2/5 items-center">
          <NameInitials name={reportee.reportee?.name} />
          <div className="flex-1 flex flex-col">
            <label data-test-id="team_name"className="block font-bold text-primary">{reportee.reportee?.name}</label>
            {Number(reportee.reportee?._count?.userReportee) > 0 && (
              <span data-test-id="direct-report"className="text-gray-600 font-semibold uppercase text-xs">
                {reportee.reportee?._count?.userReportee} Direct Report
              </span>
            )}
          </div>
          <DoughnutChart
            backgroundColor={reporteeChartData.backgroundColor}
            customData={reporteeChartData.customData}
            cutout={reporteeChartData.cutout}
            value={'$' + (Humanize.compactInteger(Number(reportee.totalRevenue), 1) || 0) }
            canvasStyle={{
              height: '70px',
              width: '70px',
            }}
            valueClass="text-sm font-semibold text-primary"
          />
        </div>
        <div className="flex space-x-2 w-full pt-4 md:pt-0 md:w-3/5 items-center md:pl-5 xl:pl-9 justify-end">
          <div data-test-id="team-details-arrow"className="w-1/5 text-right">
            <Link
              to={routes.dashboardPipelineDetailScreen.build(String(reportee.reportee?.id))}
              className="outline-none inline-block">
              <DisclosureIcon />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
