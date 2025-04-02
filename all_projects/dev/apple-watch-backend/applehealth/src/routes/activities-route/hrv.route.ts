import express from 'express';

import { HrvController } from '../../controllers/hrv/hrv.controller.js';

export const hrvRouter = express.Router();
const hrvController = new HrvController();

hrvRouter.get('/date/:date', hrvController.hrvDate);
hrvRouter.get('/date/:startDate/:endDate', hrvController.hrvDateRange);
hrvRouter.get('/date/:startDate/:endDate/time/:startTime/:endTime', hrvController.hrvDateTimeRange);
