/* eslint-disable @typescript-eslint/no-unused-vars */
import express from 'express';
import cors from 'cors';
import path from 'path';
import { StatusCodes } from 'http-status-codes';
import swaggerUi from 'swagger-ui-express';
import * as swaggerDocument from './swagger.json';
import config from './config/config';
import dbConnection from './db/connection';
import categoryRouter from './routes/CategoryRoute';
import itemRouter from './routes/ItemRoute';
import userRouter from './routes/UserRoute';
import orderRouter from './routes/OrderRoute';
import orderDetailsRouter from './routes/OrderItemsRoute';
import HttpError from './error/HttpError';

dbConnection();
const { port } = config;
const app = express();

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// routes
const imgPath = path.join(__dirname, '/images');
app.use('/images', express.static(imgPath));
app.use('/api/user', userRouter);
app.use('/api/category', categoryRouter);
app.use('/api/item', itemRouter);
app.use('/api/order', orderRouter);
app.use('/api/details', orderDetailsRouter);

app.use((req, res, next) => {
  const error = new HttpError('Page Not Found', StatusCodes.NOT_FOUND, null);
  return next(error);
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: any, req: any, res: any, next: any) => {
  const { status } = error;
  res.status(status).json({
    success: false,
    message: error.message,
    data: error.data,
  });
});

// listen
app.listen(port, () => {
  console.log(`server is listening at http://localhost:${port}`);
});
