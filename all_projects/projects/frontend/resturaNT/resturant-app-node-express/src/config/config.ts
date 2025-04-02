import * as dotenv from 'dotenv';

dotenv.config();

export default {
  port: process.env.PORT,
  path: process.env.PATH,
  imgPath: process.env.IMAGEPATH,
  imgUrl: process.env.IMAGE_BACKEND_URL,

  // put db details
  DatabaseDetails: {
    dbport: Number(process.env.DATABASE_PORT),
    dbhost: process.env.DATABASE_HOST as string,
    dbname: process.env.DATABASE_NAME as string,
    dbusername: process.env.DATABASE_USERNAME as string,
    dbpassword: process.env.DATABASE_PASSWORD,
    dbtype: process.env.DATABASE_TYPE,
  },

  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY as string,
  SEND_GRID_API_KEY: process.env.SEND_GRID_API_KEY as string,

  FORGET_PASSWORD_FRONTEND_URL: process.env.FORGET_PASSWORD_FRONTEND_URL as string,
  // user will check the order status from this url
  ORDER_STATUS_USER_FRONTEND_URL: process.env.ORDER_STATUS_USER_FRONTEND_URL as string,

  COMPANY_NAME: process.env.COMPANY_NAME as string,
  SENDER_EMAIL: process.env.SENDER_EMAIL as string,
  FORGET_PASSWORD_EMAIL_SUBJECT: process.env.FORGET_PASSWORD_EMAIL_SUBJECT as string,
  ORDER_CONFIRMATION_EMAIL_SUBJECT: process.env.ORDER_CONFIRMATION_EMAIL_SUBJECT as string,
};

export enum Role {
  Admin = 'Admin',
  User = 'User',
}

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PREPARATION = 'ready',
  DELIVERED = 'delivered'
}
