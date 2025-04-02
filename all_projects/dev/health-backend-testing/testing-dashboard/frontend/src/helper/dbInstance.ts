import { config } from 'config';

export function getDbCurrentInstance() {
  return localStorage.getItem(config.storage.api_instance) ?? null;
}

export function setDbInstance(v: string) {
  if (v) {
    localStorage.setItem(config.storage.api_instance, v?.toLowerCase());
  }
}
