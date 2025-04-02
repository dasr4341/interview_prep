import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { makeSettingsNavLinks } from 'components/NavBar/SideNavBar';
import { routes } from 'routes';
import MenuLink from 'components/NavBar/MenuLinks';
import { EventReportPageTypes } from 'screens/FacilityAdmin/EventReport/EventReportPageLayout';
import useGetPrivilege, { CapabilitiesType } from 'lib/getPrivilege';
import { UserPermissionNames } from 'health-generatedTypes';

export default function ReportingNav({ onClick }: { onClick: () => void }) {
  const careTeamPrivilege = useGetPrivilege(UserPermissionNames.COUNSELLOR_REPORTS, CapabilitiesType.VIEW);
  const adminPrivilege = useGetPrivilege(UserPermissionNames.FACILITY_ADMIN_REPORTS, CapabilitiesType.VIEW);

  const navigate = useNavigate();
  const location = useLocation();
  const { patientId } = useParams();
  const [reportMenuOpen, setReportMenuOpen] = useState(false);


  const navLinks = useMemo(
    () =>
      [
        routes.report.anomaliesReported.match,
        routes.report.poorSurveyScores.match,
        routes.report.selfHarmReport.match,
        routes.report.helpLineContacted.match,
        routes.report.geoFencesBreached.match,
      ]
        .map((e) => {
          return [e, `${e}${patientId}`];
        })
        .flat(),
    [patientId]
  );

  useEffect(() => {
    setReportMenuOpen(false);
  }, [location.pathname]);

  return (
    <React.Fragment>
      {(adminPrivilege || careTeamPrivilege) && (
          <div
            className={`flex flex-col px-8 -ml-6 -mr-12 rounded-l-2xl 
            ${location.pathname.includes('/dashboard/report') || 
            location.pathname.includes('/dashboard/report-admin') || 
            reportMenuOpen ? 'bg-white' : ''}`}>
            <div
              className={
                ' block py-3 cursor-pointer' +
                (location.pathname.includes('/dashboard/report') || 
                location.pathname.includes('/dashboard/report-admin') || 
                reportMenuOpen
                  ? ' text-primary'
                  : ' text-white')
              }
              onClick={() => {
                setReportMenuOpen(!reportMenuOpen);
                if (careTeamPrivilege) {
                  navigate(routes.report.anomaliesReported.match);
                } else if (adminPrivilege) {
                  navigate(routes.eventReport.EventReportTemplate.build(EventReportPageTypes.ALL));
                }
              }}>
              Reporting
            </div>

            {((careTeamPrivilege && adminPrivilege) || careTeamPrivilege || adminPrivilege) && (
              <>
              {(location.pathname.includes('/dashboard/report') || 
              location.pathname.includes('/dashboard/report-admin') || 
              reportMenuOpen) && (
                <div className="pl-4 nav-link-fontsize">
                  {(careTeamPrivilege) && (
                    <React.Fragment>
                      {makeSettingsNavLinks(navLinks, 'Events Stats', location.pathname)}
                      <MenuLink
                        onClick={onClick}
                        text="Assessment Stats"
                        to={routes.assessmentsReport.patientsOverview.match}
                        activeMenuPaths="/dashboard/report/assessment-stats"
                      />
                    </React.Fragment>
                  )}
  
                  {adminPrivilege && (
                    <MenuLink
                      onClick={onClick}
                      text='Care Teams'
                      activeMenuPaths="/dashboard/report-admin"
                      to={routes.eventReport.EventReportTemplate.build(EventReportPageTypes.ALL)}
                    />
                  )}
                </div>
              )}
              </>
            )}
            
          </div>
        )}
    </React.Fragment>
  );
}
