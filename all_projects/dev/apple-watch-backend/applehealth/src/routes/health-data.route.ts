import express from 'express';

import { HealthDataController } from '../controllers/health-data/health-data.controller.js';

/* /health-data */
export const healthDataRouter = express.Router();
const healthDataController = new HealthDataController();

healthDataRouter.post('/set', healthDataController.setData);
