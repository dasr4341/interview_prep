import { createSlice } from '@reduxjs/toolkit';
import { AuthState } from 'interface/authstate.interface';
import { config } from 'config';
import _ from 'lodash';
import { VerifyTwoFactorAuthenticationVariables } from 'generatedTypes';
import { resetState } from 'lib/api/users';

const userFromStore = localStorage.getItem('user_store');
const adminFromStore = localStorage.getItem('admin_store');
const sessionIdStore = localStorage.getItem(config.storage.session_id);

const initialAuthState: AuthState = {
  user: userFromStore ? JSON.parse(userFromStore) : null,
  admin: adminFromStore ? JSON.parse(adminFromStore) : null,
  sessionId: sessionIdStore ? sessionIdStore : null,
  twoFactorAuthToken: null,
  loginError: null,
  lastUrl: null
};

export const authSlice = createSlice({
  name: 'auth',
  initialState: initialAuthState,
  reducers: {
    login: (state, { payload }) => {
      console.log('logging in', _.cloneDeep(state), payload);
    },
    verifyOtp: (state, { payload }: { payload: VerifyTwoFactorAuthenticationVariables }) => {
      console.log('verify OTP', _.cloneDeep(state), payload);
    },
    setLoginError: (state, { payload }: { payload: string | null }) => {
      state.loginError = payload;
    },
    getCurrentUser: () => {
      console.log('initiating load current user');
    },
    getCurrentSuperAdmin: () => {
      console.log('initiating load current super user');
    },

    updateTwoFactorAuthToken: (state, { payload }: { payload: string }) => {
      console.log('Update Two factor AuthToken', _.cloneDeep(state), payload);
      state.twoFactorAuthToken = payload;
    },
    setUser: (state, { payload }) => {
      if (payload) {
        payload = _.cloneDeep(payload);

        if (payload.currentUser.customer.onboarded === false) {
          payload.pretaaGetCurrentUserPermission = [];
        }
        
        localStorage.setItem(config.storage.user_store, JSON.stringify(payload));
        state.user = payload;
      } else {
        resetState();
      }
      state.user = payload;
    },
    setAdmin: (state, { payload }) => {
      if (payload) {
        localStorage.setItem(config.storage.admin_store, JSON.stringify(payload));
      } else {
        resetState();
      }
      state.admin = payload;
    },
    setSessionId: (state, { payload }) => {
      localStorage.setItem(config.storage.session_id, payload);
      state.sessionId = payload;
    }
  },
});

export const authSliceActions = authSlice.actions;
export default authSlice.reducer;
