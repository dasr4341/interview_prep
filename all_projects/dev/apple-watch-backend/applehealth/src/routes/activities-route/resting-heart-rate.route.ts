import express from 'express';

import { RestingHeartRateController } from '../../controllers/restingHeartRate/resting-heart-rates.controller.js';

export const restingHeartRateRouter = express.Router();
const restingHeartRateController = new RestingHeartRateController();

restingHeartRateRouter.get('/date/:date', restingHeartRateController.restingHeartRateDate);
restingHeartRateRouter.get('/date/:startDate/:endDate', restingHeartRateController.restingHeartRateDateRange);
restingHeartRateRouter.get('/date/:startDate/:endDate/time/:startTime/:endTime', restingHeartRateController.restingHeartRateDateTimeRange);
