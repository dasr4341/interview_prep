import * as dotenv from 'dotenv';

dotenv.config();

export default {
  port: process.env.PORT,
  // put db details

  DatabaseDetails: {
    dbport: process.env.DATABASE_PORT,
    dbhost: process.env.DATABASE_HOST as string,
    dbname: process.env.DATABASE_NAME as string,
    dbusername: process.env.DATABASE_USERNAME as string,
    dbpassword: process.env.DATABASE_PASSWORD,
    dbtype: process.env.DATABASE_TYPE,
  },
};
