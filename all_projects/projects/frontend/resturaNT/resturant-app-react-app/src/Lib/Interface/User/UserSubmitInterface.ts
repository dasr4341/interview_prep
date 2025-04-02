
export interface RegisterSubmitForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  password: string;
}

export interface LoginSubmitForm {
  email: string,
  password: string
}

export interface ProfileSubmitForm {
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface ResetPasswordSubmitForm {
  oldPassword: string;
  newPassword: string;
}

export interface UserSubmitForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: number;
  address: string;
  password: string;
}

