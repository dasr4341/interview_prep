import express from 'express';

import { Spo2Controller } from '../../controllers/spo2/spo2.controller.js';

export const spo2Router = express.Router();
const spo2Controller = new Spo2Controller();

spo2Router.get('/date/:date', spo2Controller.spo2Date);
spo2Router.get('/date/:startDate/:endDate', spo2Controller.spo2DateRange);
spo2Router.get('/date/:startDate/:endDate/time/:startTime/:endTime', spo2Controller.spo2DateTimeRange);
