import * as Sentry from '@sentry/node';

import { config } from '../config/config.js';
import { Sentry_Env } from '../enum/enum.js';

Sentry.init({
  dsn: config.sentry.dsn,
  tracesSampleRate: 1.0,
  environment: Sentry_Env[config.sentry.env],
});

export function sentry_capture(error: any) {
  Sentry.captureException(error);
}
