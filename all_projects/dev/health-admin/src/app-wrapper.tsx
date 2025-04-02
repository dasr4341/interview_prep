import React, { Suspense, useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { lazyWithPreload } from 'react-lazy-with-preload';
import ReactIdleTimer from 'lib/react-idle-timer';

import { Overlay, Text } from '@mantine/core';
import { useNetwork } from '@mantine/hooks';
import { PatientRoutesConfig } from 'router/patient-routes-config';

import { routes } from './routes';
import { LoginScreen } from './screens/LoginScreen/LoginScreen';
import { LogoutScreen } from './screens/LogoutScreen';
import { MainScreen } from './screens/MainScreen';
import './scss/modules/_app-wrapper.scss';
import { AuthRoutes, authRoutesPreload } from './screens/auth/AuthRoutes';

import { useAppDispatch, useAppSelector } from 'lib/store/app-store';

import 'react-toastify/dist/ReactToastify.css';
import 'reactjs-popup/dist/index.css';

import { LoadingIndicator } from 'components/LoadingIndicator';
import Redirects from 'components/Redirects';
import { FullScreenLoadingIndicator } from 'components/FullScreenLoader';
import { eventEmitter } from 'apiClient';
import { config } from 'config';
import { appSliceActions } from 'lib/store/slice/app/app.slice';
import { authSliceActions } from 'lib/store/slice/auth/auth.slice';
import RefreshToken from 'components/RefreshToken';
import SessionExpired from 'screens/Dashboard/SessionExpired/SessionExpired';
import { PatientAddRoutes, patientRoutesPreload } from 'screens/Settings/Admin/PatientForm/PatientRoutes';

import { GeoFenceRoutes, geoFenceRoutesPreload } from 'screens/Settings/Geofencing/GeofencingRoutes';
import { SchedulingManagerRoutes, schedulerRoutesPreload } from 'screens/surveys/SchedulingManager/SchedulingManagerRoutes';
import { PatientSurveyRoutes, patientSurveyRoutePreload } from 'screens/Patient/PatientSurveys/PatientSurveysRoutes';
import AppPermissionGuard from 'guards/AppPermissionGuard';
import { UserPermissionNames } from 'health-generatedTypes';
import { ReportingRoutes, reportRoutesPreload } from 'screens/Report/ReportingRoutes';
import UnAuthGuard from 'guards/UnAuthGuard';
import { CapabilitiesType } from 'lib/getPrivilege';
import { ReportRoutesByFacilityAdmin, reportRoutesByFacilityAdminPreload } from 'screens/FacilityAdmin/EventReport/EventReportRoutes';
import PretaaContactContextList from 'screens/PretaaContacts/PretaaContactContext';
import { setLastViewUrl } from 'lib/api/users';
import { AssessmentTemplateRoutes, assessmentRoutesPreload } from 'screens/surveys/CounsellorAssessmentTemplate/AssessmentTemplateRoutes';
import { CounsellorGeoFencingRoutes, counsellorGeoFencingRoutesPreload, } from 'screens/Settings/Geofencing/CounsellorGeoFencingRoutes';
import { AssessmentReportingRoutes, assessmentStatsRoutePreload } from 'screens/Report/AssessmentReport/AssessmentReportRoutes';
import { AppleOnboardingRoutes, appleOnboardingRoutesPreload } from 'screens/auth/AppleOnboarding/AppleOnboardingRoutes';
import AgGridCheckboxContext from 'screens/Settings/Employee/components/EmployeeList/AgGridCheckboxContext';
import { templateRoutesPreload, templatesRoutes } from 'screens/surveys/templatesRoutes';
import { ClientManagementRoutes, clientManagementRoutesPreload } from 'screens/Settings/Clients/ClientManagementWrapper';
import { AuthRoutesConfig } from 'router/AuthRoutes';
import useTemplatePreload from 'lib/useTemplatePreload';


const RegisterSupporter = lazyWithPreload(() => import('screens/RegisterSupporter/RegisterSupporter'));
const NoMatch = lazyWithPreload(() => import('screens/NotFound'));
const UnAuthorizedScreen = lazyWithPreload(() => import('screens/Unauthorized'));
const UnreachableScreen = lazyWithPreload(() => import('screens/Unreachable/Unreachable'));
const Dashboard = lazyWithPreload(() => import('screens/Dashboard/Dashboard'));
const OwnerPermissionGuard = lazyWithPreload(() => import('guards/OwnerPermissionGuard'));


// supporter payment
const SupporterPayment = lazyWithPreload(() => import('screens/Payment/SupporterPayment'));
const SupporterSuccessPayment = lazyWithPreload(() => import('screens/Payment/SupporterSuccessPayment'));
const SupporterCancelPayment = lazyWithPreload(() => import('screens/Payment/SupporterCancelPayment'));

// Geofencing map
const GoogleMap = lazyWithPreload(() => import('screens/GoogleMap/Map'));

// Surveys components

const SurveyFormSubmitted = lazyWithPreload(() => import('screens/surveys/Patient/SurveyFormSubmitted'));
const SurveyFormPreview = lazyWithPreload(() => import('screens/surveys/SurveyFormPreview'));

const RegisterPatient = lazyWithPreload(() => import('screens/auth/AuthenticateWithFitbit/RegisterPatient'));
const FitbitConfirm = lazyWithPreload(() => import('screens/auth/FitbitConfirm/FitbitConfirm'));
const FitbitInvitation = lazyWithPreload(() => import('screens/auth/FitbitInvitation/FitbitInvitation'));
const FitbitThankyou = lazyWithPreload(() => import('screens/auth/FitbitThankyou/FitbitThankyou'));
const FitbitJoinTheProgramme = lazyWithPreload(() => import('screens/auth/FitbitJoinTheProgramme/FitbitJoinTheProgramme'));
const StartOathWithFitbit = lazyWithPreload(() => import('screens/auth/StartOathWithFitbit'));
const Notes = lazyWithPreload(() => import('screens/notes/Notes'));
const NotesDetails = lazyWithPreload(() => import('screens/notes/NotesDetails'));

const Events = lazyWithPreload(() => import('screens/EventsScreen/EventsScreen'));
const FilteredEvents = lazyWithPreload(() => import('screens/EventsScreen/FilteredEvents'));
const EventReports = lazyWithPreload(() => import('screens/EventsScreen/EventReports'));
const PretaaContacts = lazyWithPreload(() => import('screens/PretaaContacts/PretaaContacts'));
const EventDetailsPage = lazyWithPreload(() => import('screens/EventDetailsScreen/EventDetailsPage'));
const PretaaContactsDetails = lazyWithPreload(() => import('screens/PretaaContacts/PretaaContactsDetails'));
const PatientFeedback = lazyWithPreload(() => import('screens/Patient/PatientFeedback'));
const PatientTimeline = lazyWithPreload(() => import('screens/Patient/PatientTimeline'));
const PatientManagementList = lazyWithPreload(() => import('screens/Settings/Admin/PatientManagement'));

const EmployeeManagement = lazyWithPreload(() => import('screens/Settings/Employee/EmployeeManagement'));
const EmployeeManagementCsvUpload = lazyWithPreload(() => import('screens/Settings/Employee/EmployeeManagementCsvUpload'));
const EmployeeDetails = lazyWithPreload(() => import('screens/Settings/Employee/Details/EmployeeDetails'));
const EmployeeDetailsScreen = lazyWithPreload(() => import('screens/Settings/Employee/Details/DetailsScreen/DetailsScreen'));
const EmployeePatientsScreen = lazyWithPreload(() => import('screens/Settings/Employee/Details/PatientsScreen/PatientsScreen'));
const SurveyList = lazyWithPreload(() => import('screens/Owner/SurveyList/SurveyList'));
const SurveyDetails = lazyWithPreload(() => import('screens/Owner/SurveyList/components/SurveyDetails/SurveyDetails'));
const SurveyDetailsView = lazyWithPreload(() => import('screens/Owner/SurveyList/components/SurveyDetails/SurveyDetailsView'));
const SurveyJsonView = lazyWithPreload(() => import('screens/Owner/SurveyList/components/SurveyDetails/SurveyJsonView'));
const SurveyCreateForm = lazyWithPreload(() => import('screens/Owner/SurveyList/components/SurveyForm/SurveyCreateForm'));


const ProfileNonSso = lazyWithPreload(() => import('screens/Settings/Profile/ProfileNonSso'));
const ProfileChangePassword = lazyWithPreload(() => import('screens/Settings/TwoFactorAuthentication/ChangePasswordPage'));
const ProfileContactsForm = lazyWithPreload(() => import('screens/Settings/Profile/ProfileContactsForm'));

const TwoFactorAuthentication = lazyWithPreload(() => import('screens/Settings/TwoFactorAuthentication/TwoFactorAuthentication'));
const PatientManagementDetails = lazyWithPreload(() => import('screens/Settings/Admin/PatientManagement/PatientManagementDetails'));
const PatientManagementUserDetails = lazyWithPreload(() => import('screens/Settings/Admin/PatientManagement/UserDetails'));
const PatientManagementCareTeams = lazyWithPreload(() => import('screens/Settings/Admin/PatientManagement/PatientCareTeams'));
const NotificationPage = lazyWithPreload(() => import('screens/Settings/Notification/NotificationPage'));
const AddOrEditCareTeam = lazyWithPreload(() => import('screens/Settings/CareTeam/AddOrEditCareTeam'));
const CareTeamTypes = lazyWithPreload(() => import('screens/SuperAdmin/CareTeamTypesList/CareTeamTypes'));


const lazyLoadedPages = [
  TwoFactorAuthentication,
  PatientManagementDetails,
  PatientManagementUserDetails,
  PatientManagementCareTeams,
  NotificationPage,
  AddOrEditCareTeam,
  CareTeamTypes,
  ProfileNonSso,
  ProfileChangePassword,
  ProfileContactsForm,
  SurveyCreateForm,
  SurveyJsonView,
  SurveyDetailsView,
  SurveyDetails,
  SurveyList,
  EmployeePatientsScreen,
  EmployeeDetailsScreen,
  EmployeeDetails,
  EmployeeManagementCsvUpload,
  EmployeeManagement,
  Events,
  FilteredEvents,
  EventReports,
  PretaaContacts,
  EventDetailsPage,
  PretaaContactsDetails,
  PatientFeedback,
  PatientTimeline,
  PatientManagementList,
  RegisterPatient,
  FitbitConfirm,
  FitbitInvitation,
  FitbitThankyou,
  FitbitJoinTheProgramme,
  StartOathWithFitbit,
  Notes,
  NotesDetails,
  SurveyFormSubmitted,
  SurveyFormPreview,
  GoogleMap,
  SupporterCancelPayment,
  SupporterSuccessPayment,
  RegisterSupporter,
  NoMatch,
  UnAuthorizedScreen,
  UnreachableScreen,
  Dashboard,
  OwnerPermissionGuard 
];

export default function AppWrapper() {
  const networkStatus = useNetwork();

  const redirectUrl = useAppSelector((state) => state.app.redirectUrl);
  const dispatch = useAppDispatch();
  const pageLoader = useAppSelector((state) => state.app.loading);
  const navigate = useNavigate();
  const currentUser = useAppSelector(state => state.auth.user);
  const pretaaAdmin = useAppSelector(state => state.auth.pretaaAdmin);

  useTemplatePreload({ templates: lazyLoadedPages });
  useTemplatePreload({ templates: appleOnboardingRoutesPreload });
  useTemplatePreload({ templates: authRoutesPreload });
  useTemplatePreload({ templates: reportRoutesByFacilityAdminPreload });
  useTemplatePreload({ templates: patientSurveyRoutePreload });
  useTemplatePreload({ templates: assessmentStatsRoutePreload });
  useTemplatePreload({ templates: reportRoutesPreload });
  useTemplatePreload({ templates: patientRoutesPreload });
  useTemplatePreload({ templates: clientManagementRoutesPreload });
  useTemplatePreload({ templates: counsellorGeoFencingRoutesPreload });
  useTemplatePreload({ templates: geoFenceRoutesPreload });
  useTemplatePreload({ templates: assessmentRoutesPreload });
  useTemplatePreload({ templates: schedulerRoutesPreload });
  useTemplatePreload({ templates: templateRoutesPreload });

  // On complete of application loading based on current user logged in 
  // Load current user  data on page refresh 
  useEffect(() => {
    if (localStorage.getItem(config.storage.token) && localStorage.getItem(config.storage.user_store)) {
      dispatch(authSliceActions.getCurrentUser());
    } else if (localStorage.getItem(config.storage.token) && localStorage.getItem(config.storage.owner_store)) {
      dispatch(authSliceActions.getPretaaAdminUser());
    }
  }, []);


  // Different kind of event application event listener 
  useEffect(() => {
    eventEmitter.on(config.emitter.forBidden, () => {
      navigate(routes.unauthorized.match);
    });
    eventEmitter.on(config.emitter.tokenIncorrect, () => {
      const admin = localStorage.getItem(config.storage.owner_store);
      const user = localStorage.getItem(config.storage.user_store);

      if (user) {
        navigate(routes.sessionExpired.match);
      } else if (admin) {
        navigate(routes.sessionExpired.buildUrl({ type: 'pretaa-admin' }));
      }
      dispatch(authSliceActions.setUser(null));
    });
    eventEmitter.on(config.emitter.api_server_down, () => {
      navigate(routes.unreachable.match);
    });
    if (!currentUser && !pretaaAdmin) {
      dispatch(appSliceActions.setAppLoading(false));
    }
  }, []);



  // If redirect URL has been set from store redirect to that page 
  useEffect(() => {
    if (redirectUrl) {
      navigate(redirectUrl);
    }
  }, [redirectUrl]);

  // Set last known url for redirecting after login 
  useEffect(() => {
    setLastViewUrl();
  }, []);

  return (
    <>
      {!networkStatus?.online && (
        <Overlay
          color="#000"
          opacity={0.85}>
          <div className="h-full flex items-center justify-center">
            <Text
              size="sm"
              color="white">
              Your internet connectivity status: {networkStatus.online ? 'Online' : 'Offline'}
            </Text>
          </div>
        </Overlay>
      )}

      <RefreshToken />
      <Redirects />

      {pageLoader && <FullScreenLoadingIndicator />}
      <Suspense fallback={<LoadingIndicator />}>
        <Routes>
          <Route
            path={routes.home.match}
            element={<MainScreen />}
          />

          {/* Auth */}
          <Route
            path={routes.owner.login.match}
            element={<UnAuthGuard />}>
            <Route
              path={routes.owner.login.match}
              element={<LoginScreen />}
            />
          </Route>
          <Route
            path={routes.registerSupporter.match}
            element={<RegisterSupporter />}
          />
          {AuthRoutesConfig}
          {AuthRoutes}
          <Route
            path={routes.fhsJoinTheProgramme.match}
            element={<FitbitJoinTheProgramme />}
          />
          <Route
            path={routes.fhsOnboarding.match}
            element={<RegisterPatient />}
          />
          <Route
            path={routes.fhsConfirm.match}
            element={<FitbitConfirm />}
          />
          <Route
            path={routes.fhsInvitation.match}
            element={<FitbitInvitation />}
          />
          <Route
            path={routes.fhsThankyou.match}
            element={<FitbitThankyou />}
          />
          <Route
            path={routes.linkWithFitbit.match}
            element={<StartOathWithFitbit />}
          />

          {/* fitbit onboarding connect */}
          {AppleOnboardingRoutes}

          <Route
            path={routes.logout.match}
            element={<LogoutScreen />}
          />

          {/* supporter payment */}
          <Route
            path={routes.supporterPayment.match}
            element={<SupporterPayment />}
          />
          <Route
            path={routes.supporterSuccessPayment.match}
            element={<SupporterSuccessPayment />}
          />
          <Route
            path={routes.supporterCanceledPayment.match}
            element={<SupporterCancelPayment />}
          />

          <Route
            path={routes.dashboard.match}
            element={<Dashboard />}>
            {PatientRoutesConfig}

            <Route
              path={routes.googlemap.match}
              element={<GoogleMap />}
            />

            {/* events */}
            <Route element={<AppPermissionGuard privileges={UserPermissionNames.EVENTS} />}>
              <Route
                path={routes.events.default.match}
                element={<Events />}
              />
              <Route
                path={routes.events.assessment.match}
                element={<FilteredEvents />}
              />
              <Route
                element={<EventReports />}
                path={routes.eventsReports.withReport.match}
              />
              <Route
                element={<EventReports />}
                path={routes.eventsReports.noReport.match}
              />
              <Route
                path={routes.eventDetailsPage.match}
                element={<EventDetailsPage />}
              />
              <Route
                path={routes.eventSurveyDetailsPage.match}
                element={<SurveyFormSubmitted />}
              />
              <Route
                path={routes.eventSurveySubmitPage.match}
                element={<SurveyFormPreview />}
              />
            </Route>

            <Route element={<AppPermissionGuard privileges={UserPermissionNames.TIMELINE} />}>
              <Route
                path={routes.eventTimeline.match}
                element={<PatientTimeline />}
              />
            </Route>
            <Route element={<AppPermissionGuard privileges={UserPermissionNames.CONTACTS} />}>
              <Route
                path={routes.contactsDetails.match}
                element={<PretaaContactsDetails />}
              />
            </Route>

            <Route element={<AppPermissionGuard privileges={UserPermissionNames.NOTIFICATION_SETTINGS} />}>
              {/* Settings */}
              <Route
                path={routes.notification.match}
                element={<NotificationPage />}
              />
            </Route>

            <Route element={<AppPermissionGuard privileges={UserPermissionNames.CONTACTS} />}>
              {/* Profile Contacts */}
              <Route
                path={routes.profileContacts.match}
                element={
                  <PretaaContactContextList>
                    <PretaaContacts />
                  </PretaaContactContextList>
                }
              />
              <Route
                path={routes.profileContactDetails.match}
                element={<PretaaContactsDetails />}
              />
              <Route
                element={
                  <AppPermissionGuard
                    privileges={UserPermissionNames.CONTACTS}
                    capabilitiesType={CapabilitiesType.CREATE}
                  />
                }>
                <Route
                  path={routes.profileContactFormCreate.match}
                  element={<ProfileContactsForm />}
                />
              </Route>
              <Route
                element={
                  <AppPermissionGuard
                    privileges={UserPermissionNames.CONTACTS}
                    capabilitiesType={CapabilitiesType.EDIT}
                  />
                }>
                <Route
                  path={routes.profileContactFormEdit.match}
                  element={<ProfileContactsForm />}
                />
              </Route>
            </Route>

            {/* GeoFencing for Patient */}
            <Route element={<AppPermissionGuard privileges={UserPermissionNames.COUNSELLOR_GEOFENCES} />}>
              {CounsellorGeoFencingRoutes}
            </Route>

            {/* GeoFencing */}
            <Route element={<AppPermissionGuard privileges={UserPermissionNames.GEOFENCES} />}>{GeoFenceRoutes}</Route>

            <Route element={<AppPermissionGuard privileges={UserPermissionNames.USER} />}>
              <Route
                path={routes.profileNonSso.match}
                element={<ProfileNonSso />}
              />
              <Route
                path={routes.changePassword.match}
                element={<ProfileChangePassword />}
              />
              <Route
                path={routes.twoFactorAuth.match}
                element={<TwoFactorAuthentication />}
              />
              <Route
                element={<PatientFeedback />}
                path={routes.feedback.match}
              />
            </Route>

            {PatientAddRoutes}

            <Route element={<AppPermissionGuard privileges={UserPermissionNames.CARETEAM_TYPE_MANAGEMENT} />}>
              <Route path={routes.careTeamTypesLabelEdit.match} element={<CareTeamTypes />} />
            </Route>
            
            <Route element={<AppPermissionGuard privileges={UserPermissionNames.EMPLOYEE_MANAGEMENT} />}>
              <Route path={routes.admin.employeeUpload.match} element={<EmployeeManagementCsvUpload />} />
              <Route path={routes.admin.employee.list.match} element={ <AgGridCheckboxContext><EmployeeManagement /></AgGridCheckboxContext>} />
              <Route path={routes.admin.careTeam.create.match} element={<AddOrEditCareTeam />} />
              <Route path={routes.admin.careTeam.edit.match} element={<AddOrEditCareTeam />} />
              <Route path={routes.admin.employeeDetails.match} element={<EmployeeDetails />}>
                <Route path={routes.admin.employeeDetailsScreen.match} element={<EmployeeDetailsScreen />} />
                <Route path={routes.admin.employeePatientsScreen.match} element={<EmployeePatientsScreen />} />
              </Route>
            </Route>

            <Route element={<AppPermissionGuard privileges={UserPermissionNames.PATIENT_MANAGEMENT} />}>
            <Route path={routes.admin.patientList.match} element={<AgGridCheckboxContext><PatientManagementList /></AgGridCheckboxContext>} />
              <Route path={routes.admin.patientDetails.match} element={<PatientManagementDetails />}>
                <Route path={routes.admin.patientDetails.userDetails.match} element={<PatientManagementUserDetails />} />
                <Route path={routes.admin.patientDetails.responder.match} element={<PatientManagementCareTeams />} />
              </Route>
            </Route>

            {/* notes */}
            <Route element={<AppPermissionGuard privileges={UserPermissionNames.NOTES} />}>
              <Route
                element={<Notes />}
                path={routes.notes.match}
              />
              <Route
                element={<NotesDetails />}
                path={routes.notesDetails.match}
              />
              <Route
                element={<NotesDetails />}
                path={routes.eventNotesDetails.match}
              />

              <Route
                path={routes.eventNotesPage.match}
                element={<Notes />}
              />

             
            </Route>

            {SchedulingManagerRoutes}
            {PatientSurveyRoutes}
            {templatesRoutes}

            {/* Counsellor Assessment Template */}
            {AssessmentTemplateRoutes}

            {/* Pretaa Admin */}
            <Route element={<OwnerPermissionGuard />}>
              {ClientManagementRoutes}

              <Route
                path={routes.owner.surveyList.match}
                element={<SurveyList />}
              />
              <Route
                path={routes.owner.surveyDetails.outlet.match}
                element={<SurveyDetails />}>
                <Route
                  path={routes.owner.surveyDetails.details.match}
                  element={<SurveyDetailsView />}
                />
                <Route
                  path={routes.owner.surveyDetails.jsonView.match}
                  element={<SurveyJsonView />}
                />
              </Route>
              <Route
                path={routes.owner.addSurvey.match}
                element={<SurveyCreateForm />}
              />
            </Route>

            {/* Reporting */}
            <Route element={<AppPermissionGuard privileges={UserPermissionNames.COUNSELLOR_REPORTS} />}>
              {ReportingRoutes}
              {AssessmentReportingRoutes}
            </Route>
         
            <Route element={<AppPermissionGuard privileges={UserPermissionNames.FACILITY_ADMIN_REPORTS} />}>
              {/* Reporting for facility admin */}
              {ReportRoutesByFacilityAdmin}
            </Route>
          </Route>

          {/* Errors pages */}
          <Route
            path={routes.sessionExpired.match}
            element={<SessionExpired />}
          />
          <Route
            path={routes.unauthorized.match}
            element={<UnAuthorizedScreen />}
          />
          <Route
            path={routes.unreachable.match}
            element={<UnreachableScreen />}
          />
          <Route
            path="*"
            element={<NoMatch />}
          />

          {/* Download pdf */}
          <Route
            element={<SurveyFormSubmitted />}
            path={routes.downloadAssessmentPdf.match}
          />
        </Routes>
      </Suspense>
      <ToastContainer />
      <ReactIdleTimer />
    </>
  );
}

