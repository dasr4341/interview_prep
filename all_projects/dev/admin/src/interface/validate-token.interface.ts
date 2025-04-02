export interface ValidateTokenPayload {
  token: string;
}

export interface ValidateTokenResponse {
  loginToken: string;
  refreshToken: string;
}
