
import { createSlice } from '@reduxjs/toolkit';
import { AuthState, ImperSonationLocation } from 'interface/authstate.interface';
import { config } from 'config';
import _ from 'lodash';
import { GetPretaaAdminUser_pretaaHealthAdminCurrentUser, GetUser } from 'health-generatedTypes';
import { Impersonation, getAppData, setAppData } from 'lib/set-app-data';

const userFromStore = localStorage.getItem('user_store');
const pretaaAdminUserFromStore = localStorage.getItem(config.storage.owner_store);
const appData = getAppData();

const initialAuthState: AuthState = {
  facilityId: null,
  facilitySourceSystem: null,
  user: userFromStore ? JSON.parse(userFromStore) : null,
  pretaaAdmin: pretaaAdminUserFromStore ? JSON.parse(pretaaAdminUserFromStore) : null,
  impersonate: appData.impersonate,
  selectedRole: appData.selectedRole,
  impersonateInProgress: appData.impersonateInProgress,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState: initialAuthState,
  reducers: {
    login: (state, { payload }) => {
      console.log('logging in', _.cloneDeep(state), payload);
    },
    getCurrentUser: () => {
      console.log('initiating load current user');
    },
    getPretaaAdminUser: () => {
      console.log('initiating load pretaa admin user');
    },
    setFacilityId: (state, { payload }: { payload: null | string }) => {
      state.facilityId = payload;
    },
    setFacilitySourceSystem: (state, { payload }: { payload: null | string[] }) => {
      state.facilitySourceSystem = payload;
    },
    setUser: (state, { payload }: { payload: GetUser | null }) => {
      if (payload) {
        localStorage.setItem(config.storage.user_store, JSON.stringify(payload));
        localStorage.removeItem(config.storage.owner_store);
        state.user = payload;
        state.pretaaAdmin = null;
      } else {
        localStorage.removeItem(config.storage.user_store);
        state.user = null;
      }
    },
    setSelectedRole: (state, { payload }: { payload: string }) => {
      state.selectedRole = payload;
    },
    setUserPaymentStatus: (state, { payload }: { payload: string | null }) => {
      if (payload && state.user?.pretaaHealthCurrentUser) {
        state.user.pretaaHealthCurrentUser.paidPaymentBy = payload;
      }
    },
    setPretaaAdminUser: (state, { payload }: { payload: GetPretaaAdminUser_pretaaHealthAdminCurrentUser | null }) => {
      if (payload) {
        localStorage.setItem(config.storage.owner_store, JSON.stringify(payload));
        localStorage.removeItem(config.storage.user_store);
        state.pretaaAdmin = payload;
        state.user = null;
      } else {
        localStorage.removeItem(config.storage.owner_store);
        state.pretaaAdmin = null;
      }
    },
    startOrStopImpersonation: (state, { payload }: { payload: { impersonateRequest: ImperSonationLocation; } }) => {
      console.log('updating impersonating state after token set');
    },
    resetAuthState: (state) => {
      state.user = null;
      state.pretaaAdmin = null;
      state.impersonate = [];
    },

    updateImpersonation: (state, { payload }: { payload: Impersonation[] }) => {
      state.impersonate = payload;
    },
    updateImpersonationState: (state, { payload}: { payload: boolean}) => {
      const appData = getAppData();
      state.impersonateInProgress = payload;
      appData.impersonateInProgress = payload;
      setAppData(appData);
    }
  },
});

export const authSliceActions = authSlice.actions;
export default authSlice.reducer;
