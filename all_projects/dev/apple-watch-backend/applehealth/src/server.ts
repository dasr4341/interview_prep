import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';

import { config } from './config/config.js';
import { mongodb } from './db/mongodb.js';
import Exception from './lib/exception.lib.js';
import { LogType, log } from './lib/log.lib.js';
import { responseLib } from './lib/response.lib.js';
import { authorization } from './middlewares/authorization.middleware.js';
import { appleExerciseTimeRouter } from './routes/activities-route/appleExerciseTime.route.js';
import { appleStandTimeRouter } from './routes/activities-route/appleStandTime.route.js';
import { basalEnergyBurnedRouter } from './routes/activities-route/basalEnergyBurned.route.js';
import { cyclingDistanceRouter } from './routes/activities-route/cyclingDistance.router.js';
import { flightsClimbedRouter } from './routes/activities-route/flightsClimbed.route.js';
import { heartRouter } from './routes/activities-route/heart.route.js';
import { hrvRouter } from './routes/activities-route/hrv.route.js';
import { restingHeartRateRouter } from './routes/activities-route/resting-heart-rate.route.js';
import { sleepRouter } from './routes/activities-route/sleep.route.js';
import { spo2Router } from './routes/activities-route/spo2.route.js';
import { stepsRouter } from './routes/activities-route/steps.route.js';
import { healthDataRouter } from './routes/health-data.route.js';

const app = express();
const host = config.server.host;
const port = config.server.port;

async function server() {
  try {
    /* db */
    await mongodb();

    /* middlewares */
    app.use(express.json({ limit: '50mb' }));
    app.use(express.urlencoded({ limit: '50mb', extended: true }));
    app.use(cors());
    app.use((req, res, next) => {
      authorization(req, res, next);
    });

    /* routes */
    app.use('/health-data', healthDataRouter);
    app.use('/activities/heart', heartRouter);
    app.use('/activities/steps', stepsRouter);
    app.use('/activities/appleExerciseTime', appleExerciseTimeRouter);
    app.use('/activities/appleStandTime', appleStandTimeRouter);
    app.use('/activities/basalEnergyBurned', basalEnergyBurnedRouter);
    app.use('/activities/cyclingDistance', cyclingDistanceRouter);
    app.use('/activities/flightsClimbed', flightsClimbedRouter);

    app.use('/activities/sleep', sleepRouter);
    app.use('/activities/spo2', spo2Router);
    app.use('/activities/hrv', hrvRouter);
    app.use('/activities/restingHeartRate', restingHeartRateRouter);

    /* test */
    app.get('/test', (req: Request, res: Response) => {
      responseLib.success(res, StatusCodes.OK, 'test route', '');
    });

    /* Page Not Found */
    app.use((req: Request, res: Response, next: NextFunction) => {
      responseLib.error(res, StatusCodes.NOT_FOUND, 'page not found', '', '');
    });

    /* error handling  */
    app.use((error: Exception, req: Request, res: Response, next: NextFunction) => {
      responseLib.error(res, error?.code, error?.message, error, error?.data);
    });

    /* start */
    app.listen(port, () => {
      log(LogType.success, 'server', `🚀 server running at: http://${host}:${port}`);
    });
  } catch (error: any) {
    log(LogType.error, 'server', '⚠️ server error');
    log(LogType.error, 'error', `code: ${error.code}, message: ${error.message}`);
    log(LogType.neutral, 'server', '🔌 disconnecting server');
    await mongoose.disconnect();
  }
}

void server();
