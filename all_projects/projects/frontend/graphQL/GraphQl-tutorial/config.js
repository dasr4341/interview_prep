import * as dotenv from 'dotenv';
dotenv.config();
// to use .env
// # npm i dotenv
// # then call - dotenv.config();
export default {
    MONGO_URI: process.env.MONGO_URI,
    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY
} 