/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable max-len */
import React, { Suspense, useEffect, useState } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';

import { routes } from './routes';
import { Nav } from './components/Nav';
import { AdminNav } from './components/AdminNav';
import { LoginScreen } from './screens/LoginScreen/LoginScreen';
import { LogoutScreen } from './screens/LogoutScreen';
import { MainScreen } from './screens/MainScreen';
import './scss/modules/_app-wrapper.scss';

import { toast, ToastContainer } from 'react-toastify';

import { RootState } from 'lib/store/app-store';

import 'react-toastify/dist/ReactToastify.css';
import 'reactjs-popup/dist/index.css';
import { LoadingIndicator } from 'components/LoadingIndicator';

import OktaLoginScreen from 'screens/auth/okta/OktaLoginScreen';

import UserManagementGuard from 'guards/UserManagementGuard';
import { CompanyManagementViewGuard } from 'guards/CompanyManagementGuard';
import { CompanyListCreateGuard, CompanyListEditGuard, CompanyListViewGuard } from 'guards/CompanyListGuard';
import { ReferenceGuardCreate, ReferenceGuardView } from 'guards/ReferenceGuard';
import { EventViewGuard } from 'guards/EventGuard';
import { TimelineViewGuard } from 'guards/TimelineGuard';
import { TemplateCreateGuard, TemplateViewGuard } from 'guards/TemplateGuard';
import { GroupActionGuard, GroupViewGuard } from 'guards/GroupGuard';
import { UseCaseCreateGuard, UseCaseViewGuard } from 'guards/UseCaseGuard';
import { ThresholdViewGuard } from 'guards/ThresholdGuard';
import { IntegrationViewGuard } from 'guards/IntegrationGuard';
import { EmailExecuteGuard, EmailViewGuard } from 'guards/EmailGuard';
import { NotesGuardView } from 'guards/NotesGuard';
import { MyInsightsGuard, TeamInsightsGuard } from 'guards/DashboardGuard';
import AppIdle from './components/AppIdle';
import SourceSystemScreen from 'screens/settings/admin/sourceSystem/SourceSystemScreen';
import CompaniesGuard from 'guards/CompaniesGuard';
import { SuperUserLoginScreen } from 'screens/LoginScreen/SuperUserLoginScreen';
import SuperAdminAuthGuard from 'guards/SuperAdminAuthGuard';
import { useSelector } from 'react-redux';
import Analytics from 'components/Analytics';
import UnAuthGuard from 'guards/UnAuthGuard';
import { FullScreenLoadingIndicator } from 'components/FullScreenLoader';
import ImpersonationBar from './components/ImpersonatingBar';
import SourceSystemGuard from 'guards/SourceSystemGuard';
import RefreshToken from 'components/RefreshToken';
import { eventEmitter } from 'apiClient';
import { config } from 'config';

const DashboardPipelineDetailScreen = React.lazy(() => import('screens/dashboard/DashboardPipelineDetailScreen'));
const FeedbackScreen = React.lazy(() => import('screens/FeedbackScreen'));
const ForgetPasswordScreen = React.lazy(() => import('screens/auth/forgetPassword/ForgetPasswordScreen'));
const PasswordResetScreen = React.lazy(() => import('screens/auth/forgetPassword/PasswordResetScreen'));
const EventsScreen = React.lazy(() => import('screens/events/EventsScreen'));
const EventDetailScreen = React.lazy(() => import('screens/events/EventDetailScreen'));
const ProductsScreen = React.lazy(() => import('screens/products/ProductsScreen'));
const ProductDetailScreen = React.lazy(() => import('screens/products/ProductDetailScreen'));
const CompaniesScreen = React.lazy(() => import('screens/companies/CompaniesScreen'));
const CompanyContactsScreen = React.lazy(() => import('screens/companies/CompanyContactsScreen'));
const CompanyRatingScreen = React.lazy(() => import('screens/companies/CompanyRatingScreen'));
const CompanyContactScreen = React.lazy(() => import('screens/companies/CompanyContactScreen'));
const CompanyDetailScreen = React.lazy(() => import('screens/companies/CompanyDetailScreen'));
const CompanyMgmtDetailScreen = React.lazy(() => import('screens/settings/company-management/CompanyDetailScreen'));
const ReferenceListScreen = React.lazy(() => import('screens/reference/ReferenceListScreen'));
const OpportunitiesScreen = React.lazy(() => import('screens/opportunity/OpportunitiesScreen'));
const OpportunityDetailsScreen = React.lazy(() => import('screens/opportunity/OpportunityDetailsScreen'));

const CompanyDataSourceScreen = React.lazy(() => import('screens/companies/CompanyDataSourceScreen'));
const CompanyTicketsScreen = React.lazy(() => import('screens/companies/CompanyTicketsScreen'));
const CompanyRatingDetailScreen = React.lazy(() => import('screens/companies/CompanyRatingDetailScreen'));
const SettingsGroupsScreen = React.lazy(() => import('screens/settings/SettingsGroupsScreen'));
const SettingsNotificationsScreen = React.lazy(() => import('screens/settings/SettingsNotificationsScreen'));
const SettingsProfileScreen = React.lazy(() => import('screens/settings/SettingsProfileScreen'));
const SettingsResetPasswordScreen = React.lazy(() => import('screens/settings/SettingsResetPasswordScreen'));
const SettingsTwoStepAuth = React.lazy(() => import('screens/settings/SettingsTwoStepAuth'));
const SettingsUserUploadCSVFile = React.lazy(
  () => import('screens/settings/user/ImportUser/SettingsUserUploadCSVFile')
);
const UserDetailScreen = React.lazy(() => import('screens/settings/user/UserDetailsScreen'));
const UserGroupAction = React.lazy(() => import('screens/settings/groups/UserGroupAction'));
const UserGroupCreate = React.lazy(() => import('screens/settings/groups/UserGroupCreate'));
const UserGroupDetail = React.lazy(() => import('screens/settings/groups/UserGroupDetail'));
const TemplateFormScreen = React.lazy(() => import('screens/settings/template/TemplateFormScreen'));
const TemplateScreen = React.lazy(() => import('screens/settings/template/TemplateScreen'));
const TemplatesScreen = React.lazy(() => import('screens/settings/template/templatesScreen/TemplatesScreen'));
const UserFormScreen = React.lazy(() => import('screens/settings/user/UserFormScreen'));
const UserList = React.lazy(() => import('screens/user/UserList'));
const SelectedUserList = React.lazy(() => import('screens/user/SelectedUserList'));
const CompetitorsScreen = React.lazy(() => import('screens/competitors/CompetitorsScreen'));
const DashboardPipelineScreen = React.lazy(() => import('screens/dashboard/DashboardPipelineScreen'));
const DashboardTeamScreen = React.lazy(() => import('screens/dashboard/DashboardTeamScreen'));
const DashboardTeamDetailScreen = React.lazy(() => import('screens/dashboard/DashboardTeamDetailScreen'));
const DashboardEventScreen = React.lazy(() => import('screens/dashboard/DashboardCompanyScreen'));
const DashboardMyScreen = React.lazy(() => import('screens/dashboard/DashboardMyScreen'));
const ThresholdScreen = React.lazy(() => import('screens/settings/admin/thresholds/ThresholdScreen'));
const ControlPanelScreen = React.lazy(() => import('screens/ControlPanel/ControlPanelListScreen'));
const UseCaseFormScreen = React.lazy(() => import('screens/settings/usecase/UseCaseFormScreen'));
const UserGroupListScreen = React.lazy(() => import('screens/settings/groups/group-list/UserGroupListScreen'));
const CompanyListScreen = React.lazy(
  () => import('screens/settings/company-management/CompanyListScreen/CompanyListScreen')
);
const SelectedCompanyList = React.lazy(
  () => import('screens/settings/company-management/CompanyListScreen/SelectedCompanyList')
);
const UseCaseListScreen = React.lazy(() => import('screens/settings/usecase/UseCaseListScreen'));
const UseCaseDetailsScreen = React.lazy(() => import('screens/settings/usecase/UseCaseDetailsScreen'));
const CompanyGroupForm = React.lazy(() => import('screens/settings/company-management/CompanyGroupForm'));
const IntegrationListScreen = React.lazy(() => import('screens/settings/admin/integrations/IntegrationListScreen'));
const IntegrationDetailScreen = React.lazy(() => import('screens/settings/admin/integrations/IntegrationDetailScreen'));
const OktaUpdateFormScreen = React.lazy(() => import('screens/settings/admin/integrations/okta/OktaUpdateForm'));
const NoMatch = React.lazy(() => import('screens/NotFound'));
const UserAuthGuard = React.lazy(() => import('guards/UserAuthGuard'));
const AdminAuthGuard = React.lazy(() => import('guards/AdminAuthGuard'));
const CompanyGroupSelectScreen = React.lazy(() => import('screens/settings/groups/CompanyGroupSelect'));
const UserDetailsComponent = React.lazy(() => import('screens/settings/user/UserDetailsScreen/UserDetailsComponent'));
const UserDetailsUpdate = React.lazy(() => import('screens/settings/user/UserDetailsScreen/UserDetailsUpdate'));
const UserInheritedPermission = React.lazy(
  () => import('screens/settings/user/UserInheritedPermissions/UserInheritedPermissions')
);
const UserCompanyListScreen = React.lazy(() => import('screens/user/UserCompanyList'));
const UnAuthorizedScreen = React.lazy(() => import('screens/Unauthorized'));
const RoleManagementGuard = React.lazy(() => import('guards/RoleManagementGuard'));
const DataObjectGuard = React.lazy(() => import('guards/DataObjectGuard'));
const AddCustomerReference = React.lazy(() => import('screens/reference/AddCustomerReferencesScreen'));
const AddOpportunityReference = React.lazy(() => import('screens/reference/AddOpportunityReferencesScreen'));
const LaunchedList = React.lazy(() => import('screens/launch/LaunchList/LaunchedListScreen'));
const LaunchedDetail = React.lazy(() => import('screens/launch/LaunchDetailScreen'));
const SelectTemplateScreen = React.lazy(() => import('screens/launch/SelectTemplateScreen'));
const LaunchEmail = React.lazy(() => import('screens/launch/LaunchEmailScreen'));
const RoleManagementScreen = React.lazy(() => import('screens/role-management/RoleManagementScreen'));
const RoleManagementForm = React.lazy(() => import('screens/role-management/RoleManagementForm'));
const DataObjectsList = React.lazy(() => import('screens/data-objects/DataObjectsList'));
const DataObjectsDetails = React.lazy(() => import('screens/data-objects/DataObjectsDetails'));
const DataObjectFormName = React.lazy(() => import('screens/data-objects/DataObjectFormName'));
const NotesScreen = React.lazy(() => import('screens/notes/NotesScreen'));
const NoteDetailScreen = React.lazy(() => import('screens/notes/NoteDetailScreen'));

export default function AppWrapper() {
  const adminUser = useSelector((state: RootState) => state.auth.admin?.pretaaAdminCurrentUser);
  const user = useSelector((state: RootState) => state.auth.user?.currentUser);
  const location = useLocation();
  const [isStyleGuide, setIsStyleGuide] = useState(false);
  const pageLoader = useSelector((state: RootState) => state.controlPanel.startSwitching);
  const navigate = useNavigate();

  useEffect(() => {
    eventEmitter.on(config.emitter.forBidden, () => {
      navigate(routes.unauthorized.match);
    });
    eventEmitter.on(config.emitter.tokenIncorrect, () => {
      toast.error('Session expired!', { toastId: 'token-incorrect' });
    });
  }, []);



  useEffect(() => {
    if (location.pathname.includes('style-guide')) {
      setIsStyleGuide(true);
    }
  }, [location.pathname]);


  return (
    <>
      {pageLoader && (
        <FullScreenLoadingIndicator />
      )}
      <RefreshToken />
      <Analytics />
      <div className={`${(user || adminUser) ? 'h-screen bg-gray-50 grid-main-layout word-break' : ''}`}>
        {user && !isStyleGuide && !adminUser && <Nav />}
        {adminUser && !isStyleGuide && !user && <AdminNav />}
        
        <div className={`${user ? 'flex flex-col min-h-screen lg:px-0 lg:overflow-auto' : ''}`}>

          <ImpersonationBar />
          <Suspense fallback={<LoadingIndicator />}>
            <Routes>

              {/* Onboarding  */}
              <Route path={routes.setPassword.match} element={<UnAuthGuard />}>
               <Route path={routes.setPassword.match} element={<PasswordResetScreen />} />
              </Route>
              

              {/* Auth */}
              <Route path={routes.login.match} element={<LoginScreen />} />
              <Route path={routes.forgetPassword.match} element={<ForgetPasswordScreen />} />
              <Route path={routes.passwordReset.match} element={<UnAuthGuard />}>
                <Route path={routes.passwordReset.match} element={<PasswordResetScreen />} />
              </Route>

              <Route path={routes.oktaLogin.match} element={<UnAuthGuard />}>
                <Route path={routes.oktaLogin.match} element={<OktaLoginScreen />} />
              </Route>
              <Route path={routes.oktaCallBack.match} element={<UnAuthGuard />}>
                <Route path={routes.oktaCallBack.match} element={<OktaLoginScreen />} />
              </Route>
              

              <Route path={routes.logout.match} element={<LogoutScreen />} />
              <Route path={routes.twoStepAuth.match} element={<SettingsTwoStepAuth />} />
              <Route path={routes.integrationOkta.match} element={<AdminAuthGuard />}>
                <Route path={routes.integrationOkta.match} element={<OktaUpdateFormScreen />} />
              </Route>
              <Route path={routes.superUserLogin.match} element={<SuperUserLoginScreen />} />
              <Route path={routes.superUserForgetPassword.match} element={<ForgetPasswordScreen />} />
              <Route path={routes.superUserPasswordReset.match} element={<UnAuthGuard />}>
                <Route path={routes.superUserPasswordReset.match} element={<PasswordResetScreen />} />
              </Route>

              {/* Control Panel */}
              <Route path={routes.controlPanelScreen.match} element={<SuperAdminAuthGuard />}>
                <Route path={routes.controlPanelScreen.match} element={<ControlPanelScreen />} />
              </Route>
              <Route path={routes.superUserChangePassword.match} element={<SuperAdminAuthGuard />}>
                <Route path={routes.superUserChangePassword.match} element={<SettingsResetPasswordScreen />} />
              </Route>
              {/* Errors pages */}
              <Route path={routes.unauthorized.match} element={<UnAuthorizedScreen />} />

              <Route path={routes.home.match} element={<UserAuthGuard />}>
                <Route path={routes.home.match} element={<MainScreen />} />
                <Route path={routes.feedback.match} element={<FeedbackScreen />} />
              </Route>


              {/* Events */}
              <Route path={routes.events.match} element={<EventViewGuard />}>
                <Route path={routes.events.match} element={<EventsScreen />} />
              </Route>
              <Route path={routes.eventDetail.match} element={<EventViewGuard />}>
                <Route path={routes.eventDetail.match} element={<EventDetailScreen />} />
              </Route>

              {/* Notes */}
              <Route path={routes.notes.match} element={<NotesGuardView />}>
                <Route path={routes.notes.match} element={<NotesScreen />} />
              </Route>
              <Route path={routes.eventNotes.match} element={<NotesGuardView />}>
                <Route path={routes.eventNotes.match} element={<NotesScreen />} />
              </Route>
              <Route path={routes.companyNotes.match} element={<NotesGuardView />}>
                <Route path={routes.companyNotes.match} element={<NotesScreen />} />
              </Route>
              <Route path={routes.noteDetail.match} element={<NotesGuardView />}>
                <Route path={routes.noteDetail.match} element={<NoteDetailScreen />} />
              </Route>

              {/* Company related routes */}
              <Route path={routes.companyEventDetail.match} element={<EventViewGuard />}>
                <Route path={routes.companyEventDetail.match} element={<EventDetailScreen />} />
              </Route>
              <Route path={routes.products.match} element={<UserAuthGuard />}>
                <Route path={routes.products.match} element={<ProductsScreen />} />
              </Route>
              <Route path={routes.productDetail.match} element={<UserAuthGuard />}>
                <Route path={routes.productDetail.match} element={<ProductDetailScreen />} />
              </Route>
              <Route path={routes.companyProductDetail.match} element={<UserAuthGuard />}>
                <Route path={routes.companyProductDetail.match} element={<ProductDetailScreen />} />
              </Route>
              <Route path={routes.companies.match} element={<CompaniesGuard />}>
                <Route path={routes.companies.match} element={<CompaniesScreen />} />
              </Route>
              <Route path={routes.companyContacts.match} element={<UserAuthGuard />}>
                <Route path={routes.companyContacts.match} element={<CompanyContactsScreen />} />
              </Route>
              <Route path={routes.companyRatings.match} element={<UserAuthGuard />}>
                <Route path={routes.companyRatings.match} element={<CompanyRatingScreen />} />
              </Route>
              <Route path={routes.companyContact.match} element={<UserAuthGuard />}>
                <Route path={routes.companyContact.match} element={<CompanyContactScreen />} />
              </Route>
              <Route path={routes.companyTimeline.match} element={<TimelineViewGuard />}>
                <Route path={routes.companyTimeline.match} element={<EventsScreen />} />
              </Route>

              <Route path={routes.companyDataSource.match} element={<UserAuthGuard />}>
                <Route path={routes.companyDataSource.match} element={<CompanyDataSourceScreen />} />
              </Route>
              <Route path={routes.companyTickets.match} element={<UserAuthGuard />}>
                <Route path={routes.companyTickets.match} element={<CompanyTicketsScreen />} />
              </Route>
              <Route path={routes.companyRating.match} element={<UserAuthGuard />}>
                <Route path={routes.companyRating.match} element={<CompanyRatingScreen />} />
              </Route>
              <Route path={routes.companyDetailRating.match} element={<UserAuthGuard />}>
                <Route path={routes.companyDetailRating.match} element={<CompanyRatingDetailScreen />} />
              </Route>
              <Route path={routes.competitors.match} element={<UserAuthGuard />}>
                <Route path={routes.competitors.match} element={<CompetitorsScreen />} />
              </Route>
              <Route path={routes.addCustomerReference.match} element={<ReferenceGuardCreate />}>
                <Route path={routes.addCustomerReference.match} element={<AddCustomerReference />} />
              </Route>
              <Route path={routes.addOpportunityReference.match} element={<ReferenceGuardCreate />}>
                <Route path={routes.addOpportunityReference.match} element={<AddOpportunityReference />} />
              </Route>

              <Route path={routes.companyReferences.match} element={<ReferenceGuardView />}>
                <Route path={routes.companyReferences.match} element={<ReferenceListScreen />} />
              </Route>

              {/* Launch */}
              <Route path={routes.launchedList.match} element={<EmailViewGuard />}>
                <Route path={routes.launchedList.match} element={<LaunchedList />} />
              </Route>
              <Route path={routes.launchedCompanyList.match} element={<EmailViewGuard />}>
                <Route path={routes.launchedCompanyList.match} element={<LaunchedList />} />
              </Route>
              <Route path={routes.launchedDetail.match} element={<EmailViewGuard />}>
                <Route path={routes.launchedDetail.match} element={<LaunchedDetail />} />
              </Route>
              <Route path={routes.launchedEventDetail.match} element={<EmailViewGuard />}>
                <Route path={routes.launchedEventDetail.match} element={<LaunchedDetail />} />
              </Route>
              <Route path={routes.selectTemplate.match} element={<EmailExecuteGuard />}>
                <Route path={routes.selectTemplate.match} element={<SelectTemplateScreen />} />
              </Route>
              <Route path={routes.selectEventTemplate.match} element={<EmailExecuteGuard />}>
                <Route path={routes.selectEventTemplate.match} element={<SelectTemplateScreen />} />
              </Route>
              <Route path={routes.launchEmail.match} element={<EmailExecuteGuard />}>
                <Route path={routes.launchEmail.match} element={<LaunchEmail />} />
              </Route>

              {/* Messages */}
              <Route path={routes.messageDetail.match} element={<UserAuthGuard />}>
                <Route path={routes.messageDetail.match} element={<NoteDetailScreen />} />
              </Route>
              {/* User Settings */}
              <Route path={routes.settingsNotifications.match} element={<UserAuthGuard />}>
                <Route path={routes.settingsNotifications.match} element={<SettingsNotificationsScreen />} />
              </Route>
              <Route path={routes.settingsProfile.match} element={<UserAuthGuard />}>
                <Route path={routes.settingsProfile.match} element={<SettingsProfileScreen />} />
              </Route>
              <Route path={routes.settingsResetPassword.match} element={<UserAuthGuard />}>
                <Route path={routes.settingsResetPassword.match} element={<SettingsResetPasswordScreen />} />
              </Route>

              {/* Admin Settings */}
              <Route path={routes.settingsGroups.match} element={<AdminAuthGuard />}>
                <Route path={routes.settingsGroups.match} element={<SettingsGroupsScreen />} />
              </Route>

              {/* User Management */}
              <Route path={routes.settingsUserUploadCSVFile.match} element={<UserManagementGuard />}>
                <Route path={routes.settingsUserUploadCSVFile.match} element={<SettingsUserUploadCSVFile />} />
              </Route>
              <Route path={routes.UserDetailScreen.match} element={<UserManagementGuard />}>
                <Route path={routes.UserDetailScreen.match} element={<UserDetailScreen />}>
                  <Route path={routes.UserDetails.match} element={<UserDetailsComponent />} />
                  <Route path={routes.userCompanyAccess.match} element={<UserCompanyListScreen />} />
                </Route>
              </Route>
              <Route path={routes.userListGrid.match} element={<UserManagementGuard />}>
                <Route path={routes.userListGrid.match} element={<UserList />} />
              </Route>
              <Route path={routes.selectedUserListGrid.match} element={<UserManagementGuard />}>
                <Route path={routes.selectedUserListGrid.match} element={<SelectedUserList />} />
              </Route>
              <Route path={routes.updateUser.match} element={<UserManagementGuard />}>
                <Route path={routes.updateUser.match} element={<UserFormScreen />} />
              </Route>
              {/* End user management */}

              <Route path={routes.userInheritedPermission.match} element={<AdminAuthGuard />}>
                <Route path={routes.userInheritedPermission.match} element={<UserInheritedPermission />} />
              </Route>
              <Route path={routes.UserDetailsUpdate.match} element={<AdminAuthGuard />}>
                <Route path={routes.UserDetailsUpdate.match} element={<UserDetailsUpdate />} />
              </Route>
              <Route path={routes.templateList.match} element={<TemplateViewGuard />}>
                <Route path={routes.templateList.match} element={<TemplatesScreen />} />
              </Route>
              <Route path={routes.templateDetails.match} element={<TemplateViewGuard />}>
                <Route path={routes.templateDetails.match} element={<TemplateScreen />} />
              </Route>
              <Route path={routes.templateAdd.match} element={<TemplateCreateGuard />}>
                <Route path={routes.templateAdd.match} element={<TemplateFormScreen />} />
              </Route>
              <Route path={routes.templateEdit.match} element={<AdminAuthGuard />}>
                <Route path={routes.templateEdit.match} element={<TemplateFormScreen />} />
              </Route>
              <Route path={routes.userListGridForGroup.match} element={<AdminAuthGuard />}>
                <Route path={routes.userListGridForGroup.match} element={<UserList />} />
              </Route>
              <Route path={routes.groupDetails.match} element={<GroupViewGuard />}>
                <Route path={routes.groupDetails.match} element={<UserGroupDetail />} />
              </Route>

              <Route path={routes.createUserGroup.match} element={<GroupViewGuard />}>
                <Route path={routes.createUserGroup.match} element={<UserGroupCreate />} />
              </Route>
              <Route path={routes.userGroupAction.match} element={<GroupActionGuard />}>
                <Route path={routes.userGroupAction.match} element={<UserGroupAction />} />
              </Route>
              <Route path={routes.groupList.match} element={<GroupViewGuard />}>
                <Route path={routes.groupList.match} element={<UserGroupListScreen />} />
              </Route>
              <Route path={routes.useCaseCreate.match} element={<UseCaseCreateGuard />}>
                <Route path={routes.useCaseCreate.match} element={<UseCaseFormScreen />} />
              </Route>
              <Route path={routes.useCaseList.match} element={<UseCaseViewGuard />}>
                <Route path={routes.useCaseList.match} element={<UseCaseListScreen />} />
              </Route>
              <Route path={routes.useCaseDetails.match} element={<UseCaseViewGuard />}>
                <Route path={routes.useCaseDetails.match} element={<UseCaseDetailsScreen />} />
              </Route>
              <Route path={routes.companyDetail.match} element={<CompaniesGuard />}>
                <Route path={routes.companyDetail.match} element={<CompanyDetailScreen /> } />
              </Route>

              {/* Company List Routes */}
              <Route path={routes.companyGroupCreate.match} element={<CompanyListCreateGuard />}>
                <Route path={routes.companyGroupCreate.match} element={<CompanyGroupForm />} />
              </Route>
              <Route path={routes.companyGroupEdit.match} element={<CompanyListEditGuard />}>
                <Route path={routes.companyGroupEdit.match} element={<CompanyGroupForm />} />
              </Route>
              <Route path={routes.companyGroupList.match} element={<CompanyListViewGuard />}>
                <Route path={routes.companyGroupList.match} element={<CompanyGroupSelectScreen />} />
              </Route>
              {/* Company List routes end */}

              {/* Company Management Routes */}
              <Route path={routes.companyMgmtDetail.match} element={<CompanyManagementViewGuard />}>
                <Route path={routes.companyMgmtDetail.match} element={<CompanyMgmtDetailScreen />} />
              </Route>
              <Route path={routes.companyList.match} element={<CompanyManagementViewGuard />}>
                <Route path={routes.companyList.match} element={<CompanyListScreen />} />
              </Route>
              <Route path={routes.selectedCompanyList.match} element={<CompanyManagementViewGuard />}>
                <Route path={routes.selectedCompanyList.match} element={<SelectedCompanyList />} />
              </Route>
              {/* End Company Management */}

              <Route path={routes.integrationLists.match} element={<IntegrationViewGuard />}>
                <Route path={routes.integrationLists.match} element={<IntegrationListScreen />} />
              </Route>
              <Route path={routes.integrationDetails.match} element={<IntegrationViewGuard />}>
                <Route path={routes.integrationDetails.match} element={<IntegrationDetailScreen />} />
              </Route>
              <Route path={routes.thresholdScreen.match} element={<ThresholdViewGuard />}>
                <Route path={routes.thresholdScreen.match} element={<ThresholdScreen />} />
              </Route>

              <Route path={routes.roleList.match} element={<RoleManagementGuard />}>
                <Route path={routes.roleList.match} element={<RoleManagementScreen />} />
              </Route>
              <Route path={routes.roleCreate.match} element={<RoleManagementGuard />}>
                <Route path={routes.roleCreate.match} element={<RoleManagementForm />} />
              </Route>
              <Route path={routes.roleEdit.match} element={<RoleManagementGuard />}>
                <Route path={routes.roleEdit.match} element={<RoleManagementForm />} />
              </Route>

              <Route path={routes.dataObjects.match} element={<DataObjectGuard />}>
                <Route path={routes.dataObjects.match} element={<DataObjectsList />} />
              </Route>
              <Route path={routes.dataObjectsDetails.match} element={<DataObjectGuard />}>
                <Route path={routes.dataObjectsDetails.match} element={<DataObjectsDetails />} />
              </Route>
              <Route path={routes.dataObjectCreate.match} element={<DataObjectGuard />}>
                <Route path={routes.dataObjectCreate.match} element={<DataObjectFormName />} />
              </Route>

              {/* Dashboard */}
              <Route path={routes.dashboardPipelineScreen.match} element={<TeamInsightsGuard />}>
                <Route path={routes.dashboardPipelineScreen.match} element={<DashboardPipelineScreen />} />
              </Route>
              <Route path={routes.dashboardPipelineDetailScreen.match} element={<TeamInsightsGuard />}>
                <Route path={routes.dashboardPipelineDetailScreen.match} element={<DashboardPipelineDetailScreen />} />
              </Route>
              <Route path={routes.dashboardEvent.match} element={<AdminAuthGuard />}>
                <Route path={routes.dashboardEvent.match} element={<DashboardEventScreen />} />
              </Route>
              <Route path={routes.dashboardMe.match} element={<MyInsightsGuard />}>
                <Route path={routes.dashboardMe.match} element={<DashboardMyScreen />} />
              </Route>
              <Route path={routes.dashboardTeamScreen.match} element={<TeamInsightsGuard />}>
                <Route path={routes.dashboardTeamScreen.match} element={<DashboardTeamScreen />} />
              </Route>
              <Route path={routes.dashboardTeamDetailScreen.match} element={<TeamInsightsGuard />}>
                <Route path={routes.dashboardTeamDetailScreen.match} element={<DashboardTeamDetailScreen />} />
              </Route>

              {/* Opportunity Routes */}
              <Route path={routes.companyOpportunities.match} element={<UserAuthGuard />}>
                <Route path={routes.companyOpportunities.match} element={<OpportunitiesScreen />} />
              </Route>
              <Route path={routes.companyOpportunityDetail.match} element={<UserAuthGuard />}>
                <Route path={routes.companyOpportunityDetail.match} element={<OpportunityDetailsScreen />} />
              </Route>

              {/* Opportunity Routes */}
              <Route path={routes.sourceSystem.match} element={<SourceSystemGuard />}>
                <Route path={routes.sourceSystem.match} element={<SourceSystemScreen />} />
              </Route>

              <Route path="*" element={<NoMatch />} />
            </Routes>
          </Suspense>
        </div>
      </div>
      <ToastContainer />
      <AppIdle />
    </>
  );
}
