import { cleanEnv, str, num } from 'envalid';

export const appEnv = cleanEnv(process.env, {
  NODE_ENV: str({
    desc: 'current working environment',
    default: 'production',
  }),
  PORT: num({
    desc: 'The port that the server will run on',
    default: 4000,
  }),
  STAGING_PORT: num({
    desc: 'The port that the server will run on',
    default: 4000,
  }),
  CORS_ORIGIN: str({
    desc: 'local host port fot frontend',
    default: 'http://localhost:3000',
  }),

  ADMIN_EMAIL: str({
    desc: 'Admin email',
    default: 'admin@itobuz.com',
  }),

  ADMIN_PASSWORD: str({
    desc: 'Admin password',
    default: 'Itobuz#1234',
  }),

  Page: num({
    desc: 'Page number for pagination',
    default: 1,
  }),

  LIMIT: num({
    desc: 'Page limit for pagination',
    default: 10,
  }),
});
