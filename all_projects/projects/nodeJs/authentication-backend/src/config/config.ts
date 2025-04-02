import * as dotenv from 'dotenv';
dotenv.config();

export const config = {
    mongoUri: process.env.MONGO_URI,
    secret: 'API_URL_AUTH',
    port: process.env.PORT,
    sessionToken: 'sessionToken'
};