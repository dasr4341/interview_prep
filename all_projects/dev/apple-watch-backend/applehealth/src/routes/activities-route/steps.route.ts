import express from 'express';

import { StepsController } from '../../controllers/steps/steps.controller.js';

/* /activities/steps */
export const stepsRouter = express.Router();
const stepsController = new StepsController();

stepsRouter.get('/date/:date/', stepsController.stepsDate);
stepsRouter.get('/date/:startDate/:endDate', stepsController.stepsDateRange);
stepsRouter.get('/date/:startDate/:endDate/time/:startTime/:endTime', stepsController.stepsDateTimeRange);
