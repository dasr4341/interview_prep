import { DisclosureIcon } from 'components/icons/DisclosureIcon';
import { LabeledValue } from 'components/LabeledValue';
import NameInitials from 'components/ui/nameInitials/NameInitials';
import { GetTeamInsights_pretaaGetTeamInsightDashboardData_reportees } from 'generatedTypes';
import { Link } from 'react-router-dom';
import { routes } from 'routes';

export default function TeamReporteeListRow({
  teamData,
}: {
  teamData?: GetTeamInsights_pretaaGetTeamInsightDashboardData_reportees;
}) {
  return (
    <>
      <div data-test-id="team-members-wrap" className="bg-white border-b border-gray-350 px-5 py-6 flex flex-col md:flex-row md:items-center">
        <div className="flex space-x-3 w-full md:w-2/5 items-center">
          <NameInitials name="Marley Bergson" />
          <div data-test-id ="team-name"className="flex-1 flex flex-col">
            <label className="block font-bold text-primary">
              {`${teamData?.reportee?.firstName} ${teamData?.reportee?.lastName}`}
            </label>
            {Number(teamData?.reportee?._count?.userReportee) > 0 && (
              <span className="text-gray-600 font-semibold uppercase text-xs">
                {teamData?.reportee?._count?.userReportee} Direct Report
              </span>
            )}
          </div>
        </div>
        <div className="flex space-x-2 w-full pt-4 md:pt-0 md:w-3/5 items-center">
          <div className="w-1/3 xl:w-2/5">
            <LabeledValue label="References Added">
              <span
                className={`text-primary-light font-medium
                 `}>
                {teamData?.referencesCount || 0}
              </span>
            </LabeledValue>
          </div>
          <div className="w-1/3 xl:w-1/5">
            <LabeledValue label="Launches">
              <span
                className={`text-primary-light font-medium
                 `}>
                {teamData?.launchesCount || 0}
              </span>
            </LabeledValue>
          </div>
          <div className="w-1/3 xl:w-2/5">
            <LabeledValue label="Ratings Given">
              <span
                className={`text-primary-light font-medium
                 `}>
                {teamData?.companyRatingsCount || 0}
              </span>
            </LabeledValue>
          </div>
          <div data-tes-id="member-name" className="w-1/3 xl:w-1/5 text-right">
            <Link
              to={routes.dashboardTeamDetailScreen.build(String(teamData?.reportee?.id), {
                name: `${teamData?.reportee?.firstName} ${teamData?.reportee?.lastName}`,
              })}
              className="outline-none inline-block">
              <DisclosureIcon />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
