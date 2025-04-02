export interface ResetPasswordApiResponse {
  success: boolean;
  message: string;
  data: string;
}

export interface RegisterInterface {
  success: boolean | null;
  message: string | null;
  data: string | null;
}

export interface ForgetPasswordState {
  loading: boolean;
}
export interface UpdateForgetPasswordState {
  loading: boolean;
}
export interface ForgetPasswordApiResponse {
  success: boolean;
  message: string;
  data: string;
}
export interface ForgetPasswordPayload {
  email: string;
}
export interface UpdateForgetPasswordPayload {
  forgetPasswordAuthToken: string;
  newPassword: string;
}
export interface UpdateForgetPasswordFormSubmit {
  forgetPasswordAuthToken: string;
  newPassword: string;
  confirmPassword: string;
}
export interface ResetPasswordPayLoad {
  oldPassword: string;
  newPassword: string;
  reEnterPassword: string;
}
export interface ResetPasswordState {
  loading: boolean;
  oldPassword: string | null;
  newPassword: string | null;
}

export interface CurrentUserInterface {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
}

// export interface RegisterInterface {
//   success: boolean | null;
//   message: string | null;
//   data: null;
// }
export interface RegisterUserInterface {
  success: boolean;
  message: string;
  data: {
    id: number;
    name: string;
    phone: number;
  };
}

export interface LoginInterface {
  success: boolean | null;
  message: string | null;
  data: {
    id: number;
    name: string;
    email: string;
    phone: string;
    address: string;
    roleId: number;
    role: {
      id: number;
      name: string;
    };
    authToken: string;
  } | null;
}

export interface GetProfileInterface {
  success: boolean | null;
  message: string | null;
  data: {
    id: number;
    name: string;
    email: string;
    phone: string;
    address: string;
    roleId: number;
    role: {
      id: number;
      name: string;
    };
  } | null;
}

export interface UpdateProfileInterface {
  success: boolean | null;
  message: string | null;
  data: {
    id: number;
    name: string;
    email: string;
    phone: string;
    address: string;
    roleId: number;
    role: {
      id: number;
      name: string;
    };
  } | null;
}

export interface SearchUserApiResponse {
  id: number;
  name: string;
  phone: number;
}
