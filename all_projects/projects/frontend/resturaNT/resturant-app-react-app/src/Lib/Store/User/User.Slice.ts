/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice } from '@reduxjs/toolkit';
import { ResetPasswordState, ResetPasswordPayLoad, ForgetPasswordState, UpdateForgetPasswordState, UpdateForgetPasswordPayload, RegisterInterface } from '../../Interface/User/UserInterface';
import { CurrentUserInterface } from '../../Interface/User/UserInterface';


export interface UserSliceState {
  onlineState: boolean;
  currentUser: CurrentUserInterface | null;
  register: RegisterInterface | null;
  registerError: string | null;
  loginError: string | null;
  getProfileError: string | null;
  updateProfileError: string | null;
  forgetPassword: ForgetPasswordState;
  updateForgetPassword: UpdateForgetPasswordState;
  resetPassword: ResetPasswordState;
}

const initialState: UserSliceState = {
  onlineState: localStorage.getItem('onlineState') === 'true' ? true : false,
  currentUser: localStorage.getItem('currentUser') ? JSON.parse(localStorage.getItem('currentUser') as string) : null,
  register: null,
  registerError: null,
  loginError: null,
  getProfileError: null,
  updateProfileError: null,
  forgetPassword: {
    loading: false,
  },
  updateForgetPassword: {
    loading: false,
  },
  resetPassword: {
    loading: false,
    oldPassword: null,
    newPassword: null
  }
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    onlineState: () => {
      console.log('Setting online state...');
    },
    setOnlineState: (state, { payload }: { payload: boolean }) => {
      state.onlineState = payload;
      localStorage.setItem('onlineState', JSON.stringify(payload));
    },

    setCurrentUser: (state, { payload }: { payload: CurrentUserInterface | null }) => {
      state.currentUser = payload;
      console.log('Setting current user...', state.currentUser, payload);
    },

    register: (state, action) => {
      console.log('Signing in...', state.currentUser, action.payload);
    },
    setRegisterError: (state, { payload }: { payload: string | null }) => {
      state.registerError = payload;
    },
    login: (state, action) => {
      console.log('Logging in...', state.currentUser, action.payload);
    },

    forgetPassword: (state, action) => {
      console.log('forget password initiated ....');
    },
    setForgetPassword: (state, { payload }: { payload: ForgetPasswordState }) => {
      state.forgetPassword = payload;
    },
    updateForgetPassword: (state, { payload }: { payload: UpdateForgetPasswordPayload }) => {
      console.log('updateForgetPassword initiated ... ');
    },
    setUpdateForgetPassword: (state, { payload }: { payload: UpdateForgetPasswordState }) => {
      state.updateForgetPassword = payload;
    },

    loginError: (state, { payload }: { payload: string | null }) => {
      state.loginError = payload;
    },
    getProfile: () => {
      console.log('Getting profile...');
    },
    setGetProfileError: (state, { payload }: { payload: string | null }) => {
      state.getProfileError = payload;
    },

    updateProfile: (state, action) => {
      console.log('Updating profile...', state.currentUser, action.payload);
    },
    setUpdateProfileError: (state, { payload }: { payload: string | null }) => {
      state.updateProfileError = payload;
    },

    resetPassword: (state, { payload }: { payload: ResetPasswordPayLoad }) => {
      state.resetPassword.loading = true;
      console.log('reset password initiated', payload);
    },

    logout: () => {
      console.log('Logging out...');
    },
    registerUser: (state, action) => {
      console.log('Signing in...', state.register, action.payload);
    },
  },
});

// Action creators are generated for each case reducer function
export const userSliceActions = userSlice.actions;
export default userSlice.reducer;
