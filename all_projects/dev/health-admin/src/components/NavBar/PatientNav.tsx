import React, { useEffect, useState } from 'react';
import { makeSettingsNavLinks } from './SideNavBar';
import { routes } from 'routes';
import { SurveyTemplateTypes, UserPermissionNames, UserTypeRole, UserStaffTypes } from 'health-generatedTypes';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { BsGear } from 'react-icons/bs';
import { useAppSelector } from 'lib/store/app-store';
import useGetPrivilege, { CapabilitiesType } from 'lib/getPrivilege';
import ReportingNav from 'screens/Report/ReportingNav';
import MenuLink from './MenuLinks';
import useRole from 'lib/useRole';
import useSelectedRole from 'lib/useSelectedRole';

export default function PatientNav({ onClick }: { onClick: () => void }) {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const isPatientOrSupporter = useRole({ roles: [UserTypeRole.PATIENT, UserTypeRole.SUPPORTER] });
  const isSelectedAdmin = useSelectedRole({ roles: [UserTypeRole.FACILITY_ADMIN, UserTypeRole.SUPER_ADMIN] });
  const isSelectedClinician = useSelectedRole({ roles: [UserTypeRole.COUNSELLOR] });

  const [settingsMenuOpen, setSettingsMenuOpen] = useState(false);

  const currentUser = useAppSelector((state) => state.auth.user?.pretaaHealthCurrentUser);
  const eventViewPrivilege = useGetPrivilege(UserPermissionNames.EVENTS, CapabilitiesType.VIEW);
  const noteViewPrivilege = useGetPrivilege(UserPermissionNames.NOTES, CapabilitiesType.VIEW);
  const patientViewPrivilege = useGetPrivilege(UserPermissionNames.PATIENTS, CapabilitiesType.VIEW);
  const hasPatientManagement = useGetPrivilege(UserPermissionNames.PATIENT_MANAGEMENT, CapabilitiesType.VIEW);
  const hasEmployeeManagement = useGetPrivilege(UserPermissionNames.EMPLOYEE_MANAGEMENT, CapabilitiesType.VIEW);
  const hasFacilitiesManagement = useGetPrivilege(UserPermissionNames.FACILITY_MANAGEMENT, CapabilitiesType.VIEW);
  const hasNotification = useGetPrivilege(UserPermissionNames.NOTIFICATION_SETTINGS, CapabilitiesType.VIEW);
  const hasGeoFence = useGetPrivilege(UserPermissionNames.GEOFENCES, CapabilitiesType.VIEW);
  const hasCareTeamTypeManagement = useGetPrivilege(UserPermissionNames.CARETEAM_TYPE_MANAGEMENT, CapabilitiesType.EDIT);

  useEffect(() => {
    setSettingsMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      {currentUser?.id && (
        <>
          {eventViewPrivilege && (
            <MenuLink
              onClick={onClick}
              to={routes.events.default.match}
              text="Events"
              level="level-1"
              activeMenuPaths="/dashboard/event"
            />
          )}
          {patientViewPrivilege && (
            <MenuLink
              onClick={onClick}
              to={routes.patientList.match}
              text="Patients"
              level="level-1"
              activeMenuPaths="/dashboard/patient"
            />
          )}

          {isPatientOrSupporter && (
            <MenuLink
              onClick={onClick}
              text="Assessment"
              to={routes.patientSurveyList.open.match}
              level="level-1"
              activeMenuPaths="/dashboard/patient/surveys"
            />
          )}

          {isSelectedAdmin && (
            <MenuLink
              onClick={onClick}
              to={routes.standardTemplate.match}
              text="Assessment"
              level="level-1"
              activeMenuPaths="/dashboard/surveys"
            />
          )}

          {isSelectedClinician && (
            <MenuLink
              onClick={onClick}
              to={routes.counsellorAssessmentTemplateList.build(SurveyTemplateTypes.STANDARD)}
              text="Assessment"
              level="level-1"
              activeMenuPaths="/dashboard/assessment"
            />
          )}


          <ReportingNav onClick={onClick} />


          {/* SETTINGS NAVIGATION */}
          <div
            className={`flex flex-col px-8 -ml-6 -mr-12 rounded-l-2xl py-3
          ${location.pathname.includes('/dashboard/settings') || settingsMenuOpen ? ' bg-white' : ''}`}>
            <div
              onClick={() => {
                setSettingsMenuOpen(!settingsMenuOpen);
                navigate(routes.profileNonSso.match);
              }}
              className={
                ' block cursor-pointer ' +
                (location.pathname.includes('/dashboard/settings') || settingsMenuOpen ? 'text-primary ' : 'text-white')
              }>
              <div
                className="flex flex-row items-center font-bold text-base"
                data-testid="settingsLink">
                <BsGear className="mr-2" /> Settings
              </div>
            </div>

            {(location.pathname.includes('/dashboard/settings') || settingsMenuOpen) && (
              <div className="px-2 mt-6">
                <div className="flex flex-col">
                  <div className="text-more text-primary font-bold">Preferences </div>
                  <div className="px-4 mt-1">
                    <div
                      className="nav-link-fontsize text-primary"
                      onClick={onClick}>
                      {makeSettingsNavLinks(
                        [
                          routes.profileNonSso.match,
                          routes.profileContacts.match,
                          routes.profileContactFormCreate.match,
                          routes.profileContactFormEdit.build(String(params.id)),
                          routes.changePassword.match,
                          routes.twoFactorAuth.match,
                          routes.profileContactDetails.build(String(params.contactType), String(params.contactId)),
                        ],
                        'Profile',
                        location.pathname
                      )}
                    </div>
                    {noteViewPrivilege && (
                      <MenuLink
                        onClick={onClick}
                        to={routes.notes.match}
                        text="Notes"
                        activeMenuPaths="/dashboard/settings/notes"
                      />
                    )}
                    {hasNotification && (
                      <MenuLink
                        onClick={onClick}
                        to={routes.notification.match}
                        text="Notifications"
                        activeMenuPaths="/dashboard/settings/notification"
                      />
                    )}

                    {hasGeoFence && (
                      <>
                        <MenuLink
                          text="Geofences"
                          onClick={onClick}
                          to={routes.geofencing.listView.match}
                          activeMenuPaths="/dashboard/settings/geofencing"
                        />
                        <MenuLink
                          text="Total Last Locations"
                          onClick={onClick}
                          to={routes.geofencing.totalLastLocation.match}
                          activeMenuPaths="/dashboard/settings/totalLastLocation"
                        />
                        <MenuLink
                          text="Total Geofences"
                          onClick={onClick}
                          to={routes.geofencing.totalGeofencing.match}
                          activeMenuPaths="/dashboard/settings/total-geofencing"
                        />
                      </>
                    )}
                  </div>
                </div>

                {(hasPatientManagement || hasEmployeeManagement || hasFacilitiesManagement) && (
                  <div className="flex flex-col">
                    <div className="text-more text-primary font-bold">Admin </div>
                    {hasPatientManagement && (
                      <div className="px-4 mt-1">
                        <MenuLink
                          text="Patient Management"
                          onClick={onClick}
                          to={routes.admin.patientList.match}
                          activeMenuPaths="/dashboard/settings/admin/patient"
                        />
                      </div>
                    )}
                    {hasEmployeeManagement && (
                      <div className="px-4 mt-1">
                        <MenuLink
                          text="Staff Management"
                          onClick={onClick}
                          to={routes.admin.employee.list.build(UserStaffTypes.COUNSELLOR)}
                          activeMenuPaths="/dashboard/settings/admin/care-team"
                        />
                      </div>
                    )}

                    {hasCareTeamTypeManagement && <div className="px-4 mt-1">
                      <MenuLink
                        text="Care Team Types"
                        onClick={onClick}
                        to={routes.careTeamTypesLabelEdit.match}
                        activeMenuPaths={routes.careTeamTypesLabelEdit.match}
                      />
                    </div>}

                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}
