import { RootState } from 'lib/store/app-store';
import { appSliceActions } from 'lib/store/slice/app/app.slice';
import { AppData, GetFacilityId, GetPretaaAdminUser, PatientEventActionTypes, UserPermissionNames } from './../../../../health-generatedTypes';
import { appDataQuery } from './../../../../graphql/app-data.query';
import { delay, fork, put, select,  takeEvery } from 'redux-saga/effects';
import { GetUser, UserTypeRole } from 'health-generatedTypes';
import { authSliceActions } from './auth.slice';
import { client } from 'apiClient';
import { getUserQuery } from 'graphql/user.query';
import { getPretaaAdminUserQuery } from 'graphql/pretaaAdminUser.query';
import { ImperSonationLocation } from 'interface/authstate.interface';
import { getRedirectUrl } from 'lib/api/users';
import { cloneDeep } from 'lodash';
import { routes } from 'routes';
import messageData from 'lib/messages';
import { AppEvents } from 'interface/app.events';
import { getFacilityId } from 'graphql/get-facility-id.query';
import * as Sentry from '@sentry/browser';
import catchError from 'lib/catch-error';
import { getAppData, setAppData } from 'lib/set-app-data';
import { userRolesOptions } from 'interface/auth.interface';

function* getUser() {
  try {
    yield put(appSliceActions.setAppLoading(true));
    const { data }: { data: GetUser } = yield client.query<GetUser>({
      query: getUserQuery,
    });

    const currentRole = data.pretaaHealthCurrentUser.userRoles?.map(e => e.roleSlug) as UserTypeRole[];


    let pretaaAppData = getAppData();

    /**
     As per scope first facility need be set as selected 
     */
    if (data.pretaaHealthCurrentUser.userFacilities?.length && pretaaAppData.selectedFacilityId?.length === 0) {
      pretaaAppData = { ...pretaaAppData, selectedFacilityId: [data.pretaaHealthCurrentUser.userFacilities[0].id] };
      setAppData(pretaaAppData);
    }
    

    let facilityId: string | null = null;
    let facilitySourceSystem: string[] | null = null;
    

    if (currentRole.includes(UserTypeRole.SUPPORTER) && !data.pretaaHealthCurrentUser.paidPaymentBy) {
      console.log(messageData.errorList.paymentNotDone);
    } else if (
      currentRole.includes(UserTypeRole.SUPPORTER) &&
      !!data.pretaaHealthCurrentUser.paidPaymentBy &&
      data.pretaaHealthCurrentUser.patientPermissionToSupporter !== PatientEventActionTypes.ACCEPTED
    ) {
      // payment is done, invitation is not accepted by patient
      console.error(messageData.errorList.supporterInvitationPendingByPatient);
    } else if (data.pretaaHealthGetCurrentUserPermissions.some(e => e.name === UserPermissionNames.EVENTS && e.capabilities.VIEW)) {
      const { data: appData }: { data: AppData } = yield client.query<AppData>({
        query: appDataQuery,
      });

      yield put(appSliceActions.setAppData(appData));
    }
    const userData = cloneDeep(data);
    userData.pretaaHealthGetCurrentUserPermissions = data.pretaaHealthGetCurrentUserPermissions.filter((f) => {
      return Object.values(f.capabilities).filter((n) => n > 0).length;
    });


    // Sort and filter based on role priority
    if (userData.pretaaHealthCurrentUser.userRoles?.length) {
      const roles: any = [];
      userRolesOptions.forEach(e => {
        if (userData.pretaaHealthCurrentUser.userRoles?.some(r => r.roleSlug === e.roleSlug)) {
          roles.push(e);
        }
      });

      userData.pretaaHealthCurrentUser.userRoles = roles;

      //  Set highest roles if available
      if (roles.length && !pretaaAppData.selectedRole) {
        pretaaAppData = { ...pretaaAppData, selectedRole: roles[0].roleSlug };
        setAppData(pretaaAppData);
      }
    }

    if (userData.pretaaHealthCurrentUser.userFacilities?.length === 0) {
      yield put(appSliceActions.setAppEvents(AppEvents.LOGIN_FAILED));
      yield put(appSliceActions.setAppLoading(false));
      return;
    }

    if (data.pretaaHealthGetCurrentUserPermissions.some(e => e.name === UserPermissionNames.PATIENT_MANAGEMENT && e.capabilities.VIEW )) {
      const { data: facilityResponse }: { data: GetFacilityId } = yield client.query<GetFacilityId>({
        query: getFacilityId,
      });

      if (facilityResponse?.pretaaHealthCurrentUser?.employeeMeta?.facilities) {
        facilityId = facilityResponse?.pretaaHealthCurrentUser?.employeeMeta?.facilities[0]?.fitbitIdField || null;
        facilitySourceSystem = facilityResponse.pretaaHealthCurrentUser.employeeMeta.facilities.map(f => f.sourceSystem.slug);
      }
    }


    if (data) {
      Sentry.setUser({ id: data.pretaaHealthCurrentUser.id, 
        roles:  userData.pretaaHealthCurrentUser.userRoles,
         selectedRole: pretaaAppData.selectedRole,
         selectedFacilities: pretaaAppData.selectedFacilityId
      });
      yield put(authSliceActions.setUser(userData));
      yield put(authSliceActions.setSelectedRole(pretaaAppData.selectedRole as string));
      yield put(authSliceActions.setFacilityId(facilityId));
      yield put(authSliceActions.setFacilitySourceSystem(facilitySourceSystem));
    }

    if (pretaaAppData.roleSwitching) {
      pretaaAppData.roleSwitching = false;
      setAppData(pretaaAppData);
      const url = getRedirectUrl(userData)
      yield put(appSliceActions.redirectToPage(url));
    }
    yield put(appSliceActions.setAppEvents(AppEvents.LOGIN_SUCCESSFUL));
  } catch (e) {
    console.error('Auth Middle ware ', e);
    catchError(e, true);
  }
  
  yield delay(500);
  yield put(appSliceActions.setAppLoading(false));
}

function* getPretaaAdminUser() {
  try {
    
    const { data }: { data: GetPretaaAdminUser } = yield client.query<GetPretaaAdminUser>({
      query: getPretaaAdminUserQuery,
    });

    if (data) {
      yield put(authSliceActions.setPretaaAdminUser(data.pretaaHealthAdminCurrentUser));
      yield put(appSliceActions.setAppEvents(AppEvents.ADMIN_LOGIN_SUCCESSFUL));
    }
    yield put(appSliceActions.setAppLoading(false));
  } catch (e) {
    console.error('Auth Middle ware ', e);
    yield put(authSliceActions.setPretaaAdminUser(null));
  }

}

function* getCurrentUser() {
  yield getUser();
}

function* getCurrentUserSaga() {
  yield takeEvery(authSliceActions.getCurrentUser, getCurrentUser);
}

function* getPretaaAdminUserSaga() {
  yield takeEvery(authSliceActions.getPretaaAdminUser, getPretaaAdminUser);
}



function* impersonationUser() {
  yield getCurrentUser();
  const currentUser: GetUser = yield select((state: RootState) => state.auth.user);
  const redirectToPage = getRedirectUrl(currentUser);
  yield put(appSliceActions.redirectToPage(redirectToPage));
  yield delay(200);
  yield put(authSliceActions.updateImpersonationState(false));
}

 /**
   * Available Impersonation States 
   * Pretaa Admin Impersonation Start 
   * Pretaa Admin Go Back 
   * Staff Impersonation Multiple Times 
   * Go Back 
   * Once End of the state don't display impersonation state
  */

function* startImpersonation({ payload }: { payload: { impersonateRequest: ImperSonationLocation; } }) {
  const state: RootState = yield select();
  const loggedUser = state.auth.user;
  const loggedAdmin = state.auth.pretaaAdmin;
  const appData =  getAppData();
  setAppData(appData);
  yield put(authSliceActions.updateImpersonationState(true));

  if (payload.impersonateRequest === ImperSonationLocation.forWard) {

    if (loggedUser) {
      const user = {
        userId: loggedUser.pretaaHealthCurrentUser.id,
        userName: `${loggedUser.pretaaHealthCurrentUser.firstName} ${loggedUser.pretaaHealthCurrentUser.lastName}`,
        selectedRole: appData.selectedRole,
        selectedFacilityId: appData.selectedFacilityId,
      };
      appData.impersonate.push(user);
    } else if (loggedAdmin) {
      const user = {
        userId: loggedAdmin.id,
        userName: `${loggedAdmin.title}`,
        selectedRole: 'pretaa-admin',
        selectedFacilityId: [],
      };
      yield appData.impersonate.push(user);
    }
    yield impersonationUser();
  } else {
    const lastUser = appData.impersonate[appData.impersonate.length - 1];
    appData.impersonate.splice(-1);
    if (lastUser.selectedRole === 'pretaa-admin') {
      yield getPretaaAdminUser();
      yield delay(1000);
     location.href = routes.owner.clientManagement.match;
    } else {
      yield impersonationUser();
    }
  }
  yield put(authSliceActions.updateImpersonation(appData.impersonate));
  setAppData(appData);
}

function* startImpersonationSaga() {
  yield takeEvery(authSliceActions.startOrStopImpersonation, startImpersonation);
}

export default function* authSagas() {
  yield fork(getCurrentUserSaga);
  yield fork(getPretaaAdminUserSaga);
  yield fork(startImpersonationSaga);
}
