import { config } from 'config';

export function setAuthToken(token: string, refreshToken: string) {
    localStorage.setItem(config.storage.token, token);
    localStorage.setItem(config.storage.refreshToken, refreshToken);
    localStorage.setItem(config.storage.loginTime, JSON.stringify(new Date().toISOString()));
  }