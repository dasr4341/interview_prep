
import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';
import buildInfo from 'version.json';


export function getEnvironment() {
  if (location.origin.includes('pretaa-staging.netlify.app')) {
    return 'STAGING';
  } else if (location.origin.includes('uat-v1.4jbjenk78s33wt733bvy.futbol')) {
    return 'UAT';
  } else if (location.origin.includes('app.pretaa.com')) {
    return 'PROD';
  } else {
    return 'unknown';
  }
}

export function sentryInit() {
  if (process.env.NODE_ENV !== 'development') {
    Sentry.init({
      dsn: process.env.REACT_APP_SENTRY_DSN
        ? process.env.REACT_APP_SENTRY_DSN
        : 'https://dcc99dfcc9fb47ae9875f5c5a7d04734@sentry.pretaa.com/3',
      integrations: [new Integrations.BrowserTracing()],
  
      // Set tracesSampleRate to 1.0 to capture 100%
      // of transactions for performance monitoring.
      // We recommend adjusting this value in production
      tracesSampleRate: 0.01,
      release: buildInfo.version,
      environment: getEnvironment(),
    });
  }  
}

