
export interface LoginResponse {
  token: string;
}

export interface LoginPayload {
  username: string;
  password: string;
}

export interface ForgetPasswordPayload {
  username: string;
}

export interface CurrentUserResponse {
  user: User;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  phoneNo: string;
  token: string;
  image: string;
}