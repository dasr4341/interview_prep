import { config } from 'config';

export function resetToken() {
    localStorage.removeItem(config.storage.token);
    localStorage.removeItem(config.storage.refreshToken);
    localStorage.removeItem(config.storage.loginTime);
  }