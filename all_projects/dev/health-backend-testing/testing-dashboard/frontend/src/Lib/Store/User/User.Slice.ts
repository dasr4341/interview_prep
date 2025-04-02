import { createSlice } from '@reduxjs/toolkit';
import { ForgetPasswordPayload, LoginPayload, User } from '../../Api/Fake/Users/users.interface';
import appConfig from '../../appConfig';

export interface ForgetPasswordState {
  loading: boolean;
  token: string | null
}

export interface UserSliceState {
  currentUser: null | User;
  login: {
    loading: boolean;
  },
  forgetPassword: ForgetPasswordState
}

const userData = localStorage.getItem(appConfig.storage.user) ? 
  JSON.parse(localStorage.getItem(appConfig.storage.user) as string) : null;

const initialState: UserSliceState = {
  currentUser: userData,
  login: {
    loading: false
  },
  forgetPassword: {
    loading: false,
    token: null,
  }
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, { payload }: { payload: LoginPayload }) => {
      state.login.loading = true;
      console.log('logging in', state.currentUser, payload);
    },
    forgetPassword: (state, { payload }: { payload: ForgetPasswordPayload }) => {
      state.forgetPassword.loading = true;
      console.log('forget password initiate', payload);
    },
    updateForgetPassword: (state, { payload }: { payload: ForgetPasswordState }) => {
      state.forgetPassword = payload;
      console.log('updateForgetPassword initiate', state, payload);
    },
    setUser: (state, { payload }: { payload: User }) => {
      state.currentUser = payload;
      state.login.loading = payload ? false : true;
      if (payload) {
        localStorage.setItem(appConfig.storage.user, JSON.stringify(payload));
      } else {
        localStorage.removeItem(appConfig.storage.user);
      }
    },
    logout: (state) => {
      state.currentUser = null;
      localStorage.removeItem(appConfig.storage.user);
    }
  }
});

// Action creators are generated for each case reducer function
export const userSliceActions = userSlice.actions;

export default userSlice.reducer;
