export enum TabNames {
  CONNECT = 'connect',
  INSTALL = 'install',
  OPEN = 'open',
  ENTER_OTP = 'enter_otp',
  CONFIRMATION = 'confirmation'
}
export interface OTPResponse {
  data?: {
    token: string;
  };
  status: boolean;
  message: string;
}

export interface AppleConnectorType {
  otp: string;
}

export interface TokenDataType {
  status: boolean;
  message: string;
}

export interface Tab {
  label: string;
  count: number;
  routes: string;
}