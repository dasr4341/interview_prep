import { RegenerateTokensPayload, RegenerateTokensResponse } from './../interface/regerenerate-tokens.interface';
import axios from 'axios';
import { config } from 'config';
import { ForgotPassword, ForgotPasswordLink } from 'interface/ForgotPassword';
import { GetSsoUser, PretaaGetSSOUserPayload } from 'interface/getSsoUser.interface';
import { ValidateTokenPayload, ValidateTokenResponse } from 'interface/validate-token.interface';

const API_URL = localStorage.getItem('API_URL') ? localStorage.getItem('API_URL')?.replace('/graphql', '') : config.pretaa.apiURL?.replace('/graphql', '');


const httpClient = axios.create({
  baseURL: API_URL
});

httpClient.interceptors.response.use((response) => {
  return response.data;
}, (err) => {
  return Promise.reject(err.response.data);
});

const restApi = {
  pretaaGetSSOUser: async (payload: PretaaGetSSOUserPayload): Promise<GetSsoUser> => {
    return httpClient.post('/pretaa-get-sso-user', payload);
  }, 
  forgetPasswordLink: async (payload: ForgotPasswordLink) => {
    return httpClient.post('/pretaa-forgot-password-link', payload);
  },
  adminForgetPasswordLink: async (payload: ForgotPasswordLink) => {
    return httpClient.post('/pretaa-super-admin-forgot-password-link', payload);
  },
  forgetPassword: async (payload: ForgotPassword) => {
    return httpClient.post('/pretaa-forgot-password', payload);
  },
  adminForgetPassword: async (payload: ForgotPassword) => {
    return httpClient.post('/pretaa-super-admin-forgot-password', payload);
  },
  regenerateTokens: (payload: RegenerateTokensPayload): Promise<RegenerateTokensResponse> => {
    return httpClient.post('/pretaa-regenerate-tokens', payload);
  },
  regenerateAdminTokens: (payload: RegenerateTokensPayload): Promise<RegenerateTokensResponse> => {
    return httpClient.post('/pretaa-super-admin-regenerate-tokens', payload);
  },
  validateToken: (payload: ValidateTokenPayload): Promise<ValidateTokenResponse> => {
    return httpClient.post('/pretaa-validate-token', payload);
  }
};

export default restApi;
