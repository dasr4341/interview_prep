import logo from 'assets/images/logo.svg';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { routes } from '../routes';
import '../scss/modules/_nav.scss';
import { AiOutlineClose, AiOutlineMenu } from 'react-icons/ai';
import { useState } from 'react';
import version from '../version.json';
import { FiSettings } from 'react-icons/fi';
import usePermission, { useAdminLinks } from 'lib/use-permission';
import { UserPermissionNames } from 'generatedTypes';
import { useSelector } from 'react-redux';
import { RootState } from 'lib/store/app-store';

export function makeNavLink(route: string, label: string, isActiveFlag?: boolean) {
  const activeNavClasses = 'bg-white text-primary px-6 py-3 lg:-ml-6 lg:-mr-12 lg:rounded-l-full';
  return (
    <NavLink to={route} className={({ isActive }) => ((isActive || isActiveFlag) ? activeNavClasses : 'text-white')}
      data-test-id="navLink-el">
      {label}
    </NavLink>
  );
}

export function makeNavLinkStyle2(route: string, label: string) {
  return (
    <NavLink to={route} className={({ isActive }) => 'text-primary block pb-2' + (isActive ? ' font-bold underline navlink-underline-active' : '')}
    data-test-id="navLink-el">
      {label}
    </NavLink>
  );
}

export function makeSettingsNavLinks(route: string[], label: string, pathname: string) {
  const includePath = pathname.split('/').slice(0, 4).join('/');
  const isActive = route.includes(includePath);
  return (
    <NavLink to={route[0]} className={'text-primary block pb-2' + (isActive ? ' font-bold underline' : '')} data-test-id="navLink-el">
      {label}
    </NavLink>
  );
}

export function Nav(): JSX.Element {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const user = useSelector((state: RootState) => state.auth.user);

  const rolePermission = usePermission(UserPermissionNames.ROLE_MANAGEMENT);
  const userPermission = usePermission(UserPermissionNames.USER);
  const eventPermission = usePermission(UserPermissionNames.EVENTS);
  const companyListPermission = usePermission(UserPermissionNames.LISTS);
  const templatePermission = usePermission(UserPermissionNames.EMAIL_MESSAGE_TEMPLATES);
  const groupPermission = usePermission(UserPermissionNames.GROUPS);
  const useCasePermission = usePermission(UserPermissionNames.USE_CASE_COLLECTIONS);
  const thresholdPermission = usePermission(UserPermissionNames.THRESHOLDS);
  const integrationsPermission = usePermission(UserPermissionNames.INTEGRATIONS);
  const myInsightsPermission = usePermission(UserPermissionNames.MY_INSIGHTS);
  const teamInsightsPermission = usePermission(UserPermissionNames.TEAM_INSIGHTS);
  const eventInsightsPermission = usePermission(UserPermissionNames.EVENTS_INSIGHTS);
  const dataObjectPermission = usePermission(UserPermissionNames.DATA_OBJECT_COLLECTIONS);
  const companiesPermission = usePermission(UserPermissionNames.COMPANIES);
  const notesPermission = usePermission(UserPermissionNames.NOTES);
  const settingsPermission = usePermission(UserPermissionNames.SETTINGS);
  const adminMenuPermission = usePermission(UserPermissionNames.SETTINGS_ADMIN_MENU);
  const adminLinks = useAdminLinks();

  const [insightsMenuOpen, setInsightsMenuOpen] = useState(false);
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);

  return (
    <div className="nav-wrapper sticky">
      <div className="bg-primary-light nav-mobile flex items-center justify-between">
        <Link to="/" className="h1">
          <img src={logo} alt={logo} />
        </Link>
        <button className="p-2 text-white" onClick={() => setOpen(true)}>
          <AiOutlineMenu />
        </button>
      </div>
      <nav
        className={`side-nav bg-primary-light flex flex-col h-screen shadow-nav text-white overflow-auto p-2
          ${open ? 'open' : ''}`}>
        <div className="flex flex-1 flex-col space-y-4 p-6 lg:space-y-8 lg:p-10 text-white">
          <div className="flex justify-between  items-center  mb-8">
            <Link to="/" className="h1">
              <img src={logo} alt={logo} />
            </Link>
            <button onClick={() => setOpen(false)} className="p-2 cursor-pointer lg:invisible">
              <AiOutlineClose />
            </button>
          </div>
          {user.currentUser.customer.onboarded && (
            <>
            {eventPermission?.capabilities?.VIEW && makeNavLink(routes.events.match, 'Events')}
            {companiesPermission?.capabilities?.VIEW && makeNavLink(routes.companies.match, 'Companies', location.pathname.includes('/companies'))}

              {(myInsightsPermission?.capabilities.VIEW || teamInsightsPermission?.capabilities.VIEW) && (
                <div
                  className={`flex flex-col px-8 -ml-8 -mr-12 rounded-l-2xl overflow-auto 
                  ${(location.pathname.includes('/dashboard') || insightsMenuOpen) ? 'bg-white py-4' : ''}`}>
                  <div 
                    onClick={() => setInsightsMenuOpen(!insightsMenuOpen)}
                    className={' block cursor-pointer ' + ((location.pathname.includes('/dashboard') || insightsMenuOpen) ? ' font-bold text-primary mb-2' : 'text-white')}>
                    Insights
                  </div>

                  {(location.pathname.includes('/dashboard') || insightsMenuOpen) && (
                    <>
                      <div className="pl-4 text-xs">
                        {myInsightsPermission?.capabilities.VIEW && makeNavLinkStyle2(routes.dashboardMe.match, 'My Insights')}
                        {teamInsightsPermission?.capabilities.VIEW && makeNavLinkStyle2(routes.dashboardTeamScreen.match, 'Team Insights')}
                        {eventInsightsPermission?.capabilities.VIEW && makeNavLinkStyle2(routes.dashboardEvent.match, 'Company Insights')}
                        {teamInsightsPermission?.capabilities.VIEW && makeNavLinkStyle2(routes.dashboardPipelineScreen.match, 'Pipeline Insights')}
                      </div>
                    </>
                  )}
                </div>
              )}
              {settingsPermission?.capabilities.VIEW && (
                <div
                  className={`flex flex-col py-4 px-8 -ml-8 -mr-12 rounded-l-2xl overflow-auto 
            ${location.pathname.includes('/settings') ? 'bg-white' : ''}`}>
                  <NavLink to={routes.settingsProfile.match} 
                  className={() => ' block' + (location.pathname.includes('/settings') ? ' font-bold text-primary' : 'text-white')}
                  data-test-id="parent-nav-el">
                    <FiSettings className="mr-2 inline-block" />
                    Settings
                  </NavLink>

                <div className="pl-4">
                  {location.pathname.includes('/settings') && (
                    <>
                      <h3
                        className={`text-primary mt-2 pt-4 pb-4 ${
                          location.pathname.includes('/settings/preferences') ? 'font-bold' : ''
                        }`}>
                        <Link to={routes.settingsProfile.match}>Preferences</Link>
                      </h3>
                      {location.pathname.includes('/settings/preferences') && (
                        <div className="pl-4 mb-2 nav-link-fontsize">
                          {makeSettingsNavLinks([
                            routes.settingsProfile.match,
                            routes.twoStepAuth.match
                            ], 
                            'Profile',
                            location.pathname)}
                          {notesPermission?.capabilities.VIEW && makeNavLinkStyle2(routes.notes.match, 'My Notes')}
                          {makeNavLinkStyle2(routes.settingsNotifications.match, 'Notifications')}
                        </div>
                      )}
                      {templatePermission?.capabilities.VIEW &&
                        makeSettingsNavLinks(
                          [routes.templateList.match, routes.templateAdd.match],
                          'Templates',
                          location.pathname
                        )}

                        {adminMenuPermission?.capabilities.VIEW && (
                          <>
                            {adminLinks && adminLinks.length > 0 && (
                              <div onClick={() => setAdminMenuOpen(!adminMenuOpen)}>
                                <h3 className={`text-primary mt-3 cursor-pointer ${(location.pathname.includes('/admin') || adminMenuOpen) ? 'font-bold pb-2' : ''}`}>Admin</h3>
                              </div>
                            )}
                          </>
                        )}

                        {adminMenuPermission?.capabilities.VIEW && (location.pathname.includes('/admin') || adminMenuOpen) && (
                          <div className="flex flex-col pl-4 text-xs">
                            {thresholdPermission?.capabilities?.VIEW && makeNavLinkStyle2(routes.thresholdScreen.match, 'Thresholds')}
                            {integrationsPermission?.capabilities.VIEW &&
                              makeSettingsNavLinks(
                                [routes.integrationLists.match, routes.integrationDetails.match, routes.integrationOkta.match],
                                'Integrations',
                                location.pathname
                              )}
                            {rolePermission?.capabilities.VIEW &&
                              makeSettingsNavLinks(
                                [routes.roleList.match, routes.roleCreate.match, routes.roleDetails.match, routes.roleEdit.match],
                                'Role Management',
                                location.pathname
                              )}
                            {userPermission?.capabilities.VIEW &&
                              makeSettingsNavLinks(
                                [routes.userListGrid.match, routes.UserDetails.match, routes.selectedUserListGrid.match, routes.userInheritedPermission.match],
                                'Users',
                                location.pathname
                              )}
                            {groupPermission?.capabilities.VIEW && makeSettingsNavLinks([routes.groupList.match, routes.groupDetails.match], 'Groups', location.pathname)}
                            {companyListPermission?.capabilities.VIEW &&
                              makeSettingsNavLinks(
                                [
                                  routes.companyGroupList.match,
                                  routes.companyList.match,
                                  routes.companyMgmtDetail.match,
                                  routes.companyGroupCreate.match,
                                  routes.selectedCompanyList.match,
                                ],
                                'Companies',
                                location.pathname
                              )}
                            {dataObjectPermission?.capabilities?.VIEW && makeNavLinkStyle2(routes.dataObjects.match, 'Data Objects')}
                            {useCasePermission?.capabilities.VIEW && makeSettingsNavLinks([routes.useCaseList.match, routes.useCaseDetails.match], 'Use Cases', location.pathname)}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )}
              {!settingsPermission?.capabilities.VIEW && notesPermission?.capabilities.VIEW && makeNavLink(routes.notes.match, 'My Notes')}
            </>
          )}
        </div>
        <footer className="border-t border-border grid grid-cols-1 space-y-4 p-8">
          <div className="flex justify-between col-span-2">
            {user.currentUser.customer.onboarded && (
              <NavLink to={routes.feedback.match} className={({ isActive }) => (isActive ? 'selected-footer-nav' : '')} data-testid="feedback-link">
                Feedback
              </NavLink>
            )}
            <Link to={routes.logout.match} data-test-id="logout">
              Logout
            </Link>
          </div>
          <div className="col-span-2 flex flex-col">
            <a href="https://pretaa.com/support/">Help</a>
          </div>
          <label>Version {version.version}</label>
          <label className="invisible">Build {version.build}</label>
        </footer>
      </nav>
    </div>
  );
}
