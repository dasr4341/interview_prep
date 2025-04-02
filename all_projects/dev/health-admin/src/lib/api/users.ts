import { config } from 'config';
import { format } from 'date-fns';
import { GetPretaaAdminUser_pretaaHealthAdminCurrentUser, GetUser, UserPermissionNames, UserStaffTypes, UserTypeRole } from 'health-generatedTypes';
import { PlatformType } from 'interface/health-data-connector.interface';
import { getAppData } from 'lib/set-app-data';
import { cloneDeep } from 'lodash';
import { routes } from 'routes';
import { TabNames } from 'screens/auth/AppleOnboarding/lib/apple-onboarding-interface';

export function getLastViewUrl() {
  return sessionStorage.getItem(config.storage.last_url);
}
export function setLastViewUrl() {
  const user = localStorage.getItem(config.storage.user_store);
  const admin = localStorage.getItem(config.storage.owner_store);
  const lastUrl = getLastViewUrl();

  const routesExcludes = [
    routes.login.match
  ];

  const includedDeepLinkUrl = [
    routes.eventDetailsPage.machPath,
    routes.eventSurveyDetailsPage.matchPath,
    'dashboard/patient/surveys/list/submit'
  ];

  console.log({ routesExcludes });

  const isMatched = includedDeepLinkUrl.some(u => location.pathname.includes(u));

  if (
    !location.pathname.includes(routes.owner.matchPath) &&
    !routesExcludes.includes(location.pathname) &&
    isMatched &&
    !lastUrl
    && !user
    && !admin
  ) {
    console.log('setting last known url', location.pathname);
    sessionStorage.setItem(
      config.storage.last_url,
      location.href.replace(location.origin, '')
    );
  }
}


export function clearLastViewUrl() {
  sessionStorage.removeItem(config.storage.last_url);
}


export function resetState() {
  localStorage.removeItem(config.storage.token);
  localStorage.removeItem(config.storage.refreshToken);
  localStorage.removeItem(config.storage.loginTime);
  localStorage.removeItem(config.storage.user_store);
  localStorage.removeItem(config.storage.owner_store);
  sessionStorage.removeItem(config.storage.last_url);
  localStorage.removeItem(config.storage.app_data);
}

export function setAuthToken({ token, refreshToken }: { token: string; refreshToken: string }) {
  localStorage.setItem(config.storage.token, token);
  localStorage.setItem(config.storage.refreshToken, refreshToken);
  localStorage.setItem(config.storage.loginTime, JSON.stringify(format(new Date(), 'MM-dd-yyy HH:mm')));
}

export function getRedirectUrl(user: GetUser | null) {
  const appData = getAppData();
  const isDev = process.env.NODE_ENV === 'development' || localStorage.getItem(config.storage.app_env) === 'development';
  
  const lastUrl = getLastViewUrl();
  const isImpersonationState = appData.impersonate.length;

  if (lastUrl && user && !isImpersonationState) {
    return lastUrl;
  }


  if (isDev) {
    console.trace('process redirect url', { user: cloneDeep(user) });
  }

  let viewRoutes: string = routes.unauthorized.match;
  const permissions: UserPermissionNames[] = [
    UserPermissionNames.EVENTS,
    UserPermissionNames.NOTES,
    UserPermissionNames.PATIENTS,
    UserPermissionNames.SURVEY_TEMPLATES,
    UserPermissionNames.SURVEYS,
    UserPermissionNames.CAMPAIGN_SCHEDULER,
    UserPermissionNames.PATIENT_MANAGEMENT,
    UserPermissionNames.EMPLOYEE_MANAGEMENT,
  ];

  for (const pName of permissions) {
    const currentPermissions = user?.pretaaHealthGetCurrentUserPermissions.find(p => p.name === pName);
    if (currentPermissions) {
      if (currentPermissions.capabilities.VIEW && currentPermissions.name === UserPermissionNames.EVENTS) {
        viewRoutes = routes.events.default.match;
      } else if (currentPermissions.capabilities.VIEW && currentPermissions.name === UserPermissionNames.NOTES) {
        viewRoutes = routes.notes.match;
      } else if (currentPermissions.capabilities.VIEW && currentPermissions.name === UserPermissionNames.PATIENTS) {
        viewRoutes = routes.patientList.match;
      } else if (currentPermissions.capabilities.VIEW && currentPermissions.name === UserPermissionNames.SURVEY_TEMPLATES) {
        viewRoutes = routes.standardTemplate.match;
      } else if (currentPermissions.capabilities.VIEW && currentPermissions.name === UserPermissionNames.SURVEYS && appData.selectedRole === UserTypeRole.PATIENT) {
        viewRoutes = routes.patientSurveyList.list.match;
      }  else if (currentPermissions.capabilities.VIEW && currentPermissions.name === UserPermissionNames.CAMPAIGN_SCHEDULER) {
        viewRoutes = routes.schedulingManagerList.match;
      } else if (currentPermissions.capabilities.VIEW && currentPermissions.name === UserPermissionNames.PATIENT_MANAGEMENT) {
        viewRoutes = routes.admin.patientList.match;
      } else if (currentPermissions.capabilities.VIEW && currentPermissions.name === UserPermissionNames.EMPLOYEE_MANAGEMENT) {
        viewRoutes = routes.admin.employee.list.build(UserStaffTypes.COUNSELLOR);
      }
      break;
    }

  }
  

  if (isDev) {
    console.log('authorized routes url', viewRoutes);
  }
  if (user?.pretaaHealthCurrentUser.patientDetails?.appleTokenInvalid && user?.pretaaHealthCurrentUser.patientDetails?.platformType === PlatformType.APPLEWATCH
     && user.pretaaHealthCurrentUser.userRoles?.some(e => e.roleSlug === UserTypeRole.PATIENT)) {
    return routes.appleOnboarding.connect.build(TabNames.CONNECT);
  } else if (user?.pretaaHealthCurrentUser.fitbitTokenInvalid && user?.pretaaHealthCurrentUser.patientDetails?.platformType === PlatformType.FITBIT && 
    user.pretaaHealthCurrentUser.userRoles?.some(e => e.roleSlug === UserTypeRole.PATIENT)) {
    return routes.linkWithFitbit.match;
  } else if (user?.pretaaHealthCurrentUser.patientDetails?.platformType === null && user.pretaaHealthCurrentUser.userRoles?.some(r => r.roleSlug === UserTypeRole.PATIENT)) {
    return routes.fhsJoinTheProgramme.match;
  } else if (
    user?.pretaaHealthCurrentUser.id &&
    !user?.pretaaHealthCurrentUser.paidPaymentBy &&
    user.pretaaHealthCurrentUser.userRoles?.some(e => e.roleSlug === UserTypeRole.SUPPORTER)
  ) {
    // Payment not done
    return routes.supporterPayment.match;
  } else if (
    user?.pretaaHealthCurrentUser.id &&
    user?.pretaaHealthCurrentUser.paidPaymentBy &&
    user.pretaaHealthCurrentUser.userRoles?.some(e => e.roleSlug === UserTypeRole.SUPPORTER) &&
    !user?.pretaaHealthCurrentUser.patientPermissionToSupporter
  ) {
    // Payment is done but, invitation request is not accepted by the patient
    // redirection to event page 
    return viewRoutes;
  } else if (user?.pretaaHealthCurrentUser.id) {
    return viewRoutes;
  } else {
    return routes.login.match;
  }

}

export function getRedirectUrlForPretaaAdmin(user: GetPretaaAdminUser_pretaaHealthAdminCurrentUser | null ) {
  let viewRoutes: string = routes.unauthorized.match;

  if (user?.id) {
    viewRoutes = routes.owner.clientManagement.match;
  } 

  return viewRoutes;
}