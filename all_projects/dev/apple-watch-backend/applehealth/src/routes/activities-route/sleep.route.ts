import { Router } from 'express';

import { SleepController } from '../../controllers/sleep/sleep.controller.js';

export const sleepRouter = Router();
const sleepController = new SleepController();

sleepRouter.get('/date/:date', sleepController.sleepDate);
sleepRouter.get('/date/:startDate/:endDate', sleepController.sleepDateRange);
