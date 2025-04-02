export interface IQuoteFormWhenLoggedIn {
  message: string;
}

export interface IQuoteFormWhenNotLoggedIn {
  name?: string;
  phone: string;
  otp?: string;
  message?: string;
}
