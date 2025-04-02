export interface ForgotPasswordLink {
  email: string;
}

export interface ForgotPassword {
  forgotPwToken: string;
  newPassword: string;
}
