
import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';
import { config } from 'config';
import buildInfo from 'version.json';


export function getEnvironment() {
  if (location.origin.includes('localhost')) {
    return 'LOCALHOST';
  } else if (location.origin.includes('pretaa-health-dev.netlify.app')) {
    return 'STAGING';
  } else if (location.origin.includes('dev.pretaa.com')) {
    return 'UAT';
  } else if (location.origin.includes('dashboard.pretaa.com')) {
    return 'PROD';
  } else if (location.origin.includes('demo.pretaa.com')) {
    return 'DEMO';
  } else {
    return 'unknown';
  }
}

const errorExclusions = [
  'Loading chunk',
  'Loading CSS chunk',
  'BulkInvitePatients'
];

export function sentryInit() {
  if (process.env.NODE_ENV === 'development' || location.origin.includes('pretaa-health-dev.netlify.app')) {
    return;
  }
    Sentry.init({
      dsn: process.env.REACT_APP_SENTRY_DSN
        ? process.env.REACT_APP_SENTRY_DSN
        : 'https://90718a3777c74caa8bf55abe6e3773f6@sentry.pretaa.com/6',
      integrations: [new Integrations.BrowserTracing(), new Integrations.Apollo(), new Integrations.GraphQL()],
  
      // Set tracesSampleRate to 1.0 to capture 100%
      // of transactions for performance monitoring.
      // We recommend adjusting this value in production
      tracesSampleRate: 0,
      autoSessionTracking: false,
      release: buildInfo.build,
      environment: getEnvironment(),
      ignoreErrors: [
        'ResizeObserver loop completed with undelivered notifications.',
        'ResizeObserver loop limit exceeded'
      ],
      beforeSend(event, hint) {
        const error: any = hint.originalException;

        if ( error &&
          typeof error != 'string' && error?.message.includes('Loading chunk')) {
            if (!sessionStorage.getItem('app-reload')) {
              sessionStorage.setItem('app-reload', 'true');
              alert('OPPS! Please reload or clear browser cache');
            }
        }

        if (
          error &&
          typeof error != 'string' &&
          error?.message &&
          errorExclusions.some(e => error.message.includes(e))
        ) {
          return null;
        }
        return event;
      },
    });

    Sentry.setExtra('api_endpoint', config.pretaa.apiRoot);
    
}

