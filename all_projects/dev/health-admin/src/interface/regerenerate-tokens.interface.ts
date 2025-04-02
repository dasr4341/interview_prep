export interface RegenerateTokensPayload {
  refreshToken: string;
}

export interface RegenerateTokensResponse {
  data: {
    loginToken: string;
    refreshToken: string;
    message: string;
  },
  message: string;
}