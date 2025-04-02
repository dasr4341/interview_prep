import { config } from 'config';
import { GetCurrentAdminUser, GetUser_currentUser } from 'generatedTypes';
import { routes } from 'routes';


export function setLastViewUrl() {
  sessionStorage.setItem(config.storage.last_url, location.pathname);
}

export function getLastViewUrl() {
  return sessionStorage.getItem(config.storage.last_url);
}
export function clearLastViewUrl() {
  sessionStorage.removeItem(config.storage.last_url);
}

export function getRedirectAuth({ isSsoUser, user, adminUser }: { isSsoUser?: boolean; user?: GetUser_currentUser; adminUser?: GetCurrentAdminUser }) {
  const lastUrl = getLastViewUrl();
  if (lastUrl && user) {
    return lastUrl;
  } else if (!isSsoUser && user && user.customer.onboarded === false) {
    return routes.sourceSystem.match;
  } else if (!isSsoUser && user) {
    return routes.events.match;
  } else if (lastUrl && adminUser) {
    return lastUrl;
  } else {
    console.log('Not implemented');
    return '';
  }
}
