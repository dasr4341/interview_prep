import dotenv from 'dotenv';

dotenv.config();

export const config = {
  server: {
    port: process.env.SERVER_PORT,
    host: process.env.SERVER_HOST,
    debug_mode: 1
  },
  db: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    // authdb: process.env.DB_AUTH_DB,
    uri: process.env.DB_URI
  }
};
