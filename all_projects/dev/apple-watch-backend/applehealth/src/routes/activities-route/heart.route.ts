import { Router } from 'express';

import HeartController from '../../controllers/heart/heart.controller.js';

export const heartRouter = Router();
const heartController = new HeartController();

heartRouter.get('/date/:date/', heartController.heartDate);
heartRouter.get('/date/:startDate/:endDate/', heartController.heartDateRange);
heartRouter.get('/date/:startDate/:endDate/time/:startTime/:endTime', heartController.heartDateTimeRange);
