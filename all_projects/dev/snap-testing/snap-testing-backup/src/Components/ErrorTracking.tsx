import React from 'react';

import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';

if (process.env.NODE_ENV !== 'development') {
  Sentry.init({
    dsn: process.env.REACT_APP_SENTRY_DSN || 'https://1a034bd8de2647cf93c113c8b0352f60@o936810.ingest.sentry.io/6551711',
    integrations: [new BrowserTracing()],
  
    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 0.5,
  });
}


export default function ErrorTracking() {
  return <div></div>;
}
