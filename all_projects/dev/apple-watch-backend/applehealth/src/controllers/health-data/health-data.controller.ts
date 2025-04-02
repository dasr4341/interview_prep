import { NextFunction, Request, Response } from 'express';

import { CollectionType } from '../../enums/health-data.enum.js';
import { biometricsHelper } from '../../helper/biometrics.helper.js';
import { dbLib } from '../../lib/db.lib.js';
import { responseLib } from '../../lib/response.lib.js';
import { appleExerciseTimeModelGenerator } from '../../models/activities-model/appleExerciseTime.model.js';
import { appleStandTimeModelGenerator } from '../../models/activities-model/appleStandTime.model.js';
import { basalEnergyBurnedModelGenerator } from '../../models/activities-model/basalEnergyBurned.model.js';
import { cyclingDistanceModelGenerator } from '../../models/activities-model/cyclingDistance.model.js';
import { ecgModelGenerator } from '../../models/activities-model/ecg.model.js';
import { flightsClimbedModelGenerator } from '../../models/activities-model/flightsClimbed.model.js';
import { heartModelGenerator } from '../../models/activities-model/heart.model.js';
import { hrvModelGenerator } from '../../models/activities-model/hrv.model.js';
import { locationModelGenerator } from '../../models/activities-model/location.model.js';
import { respiratoryRateModelGenerator } from '../../models/activities-model/respiratoryRate.model.js';
import { restingHeartRateModelGenerator } from '../../models/activities-model/restingHeartRate.model.js';
import { sleepModelGenerator } from '../../models/activities-model/sleep.model.js';
import { sleepRawModelGenerator } from '../../models/activities-model/sleepRaw.model.js';
import { spo2ModelGenerator } from '../../models/activities-model/spo2.model.js';
import { stepsModelGenerator } from '../../models/activities-model/steps.model.js';
import { walkRunDistanceModelGenerator } from '../../models/activities-model/walkRunDistance.model.js';
import { walkingHeartRateAverageModelGenerator } from '../../models/activities-model/walkingHeartRateAverage.model.js';
import { userModelGenerator } from '../../models/user-model/user.model.js';
import { HealthData } from './health-data.interface.js';

export class HealthDataController {
  async setData(req: Request | any, res: Response, next: NextFunction) {
    try {
      const {
        id,
        deviceName,
        deviceModel,
        deviceSystemVersion,
        deviceSystemName,
        deviceBatteryLevel,
        userTimezone,
        lat,
        long,
        heart,
        steps,
        sleep,
        oxygenSaturation: spo2,
        hrv,
        ecg,
        restingHeartRate,
        respiratoryRate,
        basalEnergyBurned,
        walkingHeartRateAverage,
        walkRunDistance,
        cyclingDistance,
        flightsClimbed,
        appleExerciseTime,
        appleStandTime,
      }: HealthData = req.body;
      const { userId } = req.user;

      const resolve = [];

      /* user */
      if (id) {
        const userData = {
          userId: id,
          device_name: deviceName,
          device_model: deviceModel,
          device_system_version: deviceSystemVersion,
          device_system_name: deviceSystemName,
          device_battery_level: deviceBatteryLevel,
          timeZone: userTimezone,
        };
        const userModel = await userModelGenerator();

        const existingUser = await userModel.findOne({ userId: id });
        if (existingUser) {
          await userModel.updateOne(
            { userId: id },
            {
              device_name: deviceName,
              device_model: deviceModel,
              device_system_version: deviceSystemVersion,
              device_system_name: deviceSystemName,
              device_battery_level: deviceBatteryLevel,
              timeZone: userTimezone,
            },
            { new: true }
          );
        } else {
          await userModel.create(userData);
        }
      }

      /* location - lat, long */
      if (lat && long) {
        await dbLib.createTimeseriesCollection(userId, CollectionType.LOCATION);
        const locationModel = await locationModelGenerator(userId);

        resolve.push(locationModel.insertMany([{ time: new Date(), value: { lat, long } }]));
      }

      /* heart */
      if (heart?.length) {
        const heartData = await biometricsHelper.heartReducer(heart);
        await dbLib.createTimeseriesCollection(userId, CollectionType.HEART);
        const heartModel = await heartModelGenerator(userId);

        resolve.push(heartModel.insertMany(heartData));
      }

      /* steps */
      if (steps?.length) {
        const stepsData = await biometricsHelper.stepsReducer(steps);
        await dbLib.createTimeseriesCollection(userId, CollectionType.STEPS);
        const stepsModel = await stepsModelGenerator(userId);

        resolve.push(stepsModel.insertMany(stepsData));
      }

      /* sleep */
      if (sleep?.length) {
        const sleepData = await biometricsHelper.sleepReducer(sleep);
        await dbLib.createCollection(userId, CollectionType.SLEEP);
        const sleepModel = await sleepModelGenerator(userId);

        resolve.push(sleepModel.insertMany(sleepData));

        await dbLib.createCollection(userId, CollectionType.SLEEP_RAW);
        const sleepRawModel = await sleepRawModelGenerator(userId);

        resolve.push(sleepRawModel.insertMany(sleep));
      }

      /* spo2 */
      if (spo2?.length) {
        const spo2Data = await biometricsHelper.spo2Reducer(spo2);
        await dbLib.createTimeseriesCollection(userId, CollectionType.SPO2);
        const spo2Model = await spo2ModelGenerator(userId);

        resolve.push(spo2Model.insertMany(spo2Data));
      }

      /* hrv */
      if (hrv?.length) {
        const hrvData = await biometricsHelper.hrvReducer(hrv);
        await dbLib.createTimeseriesCollection(userId, CollectionType.HRV);
        const hrvModel = await hrvModelGenerator(userId);

        resolve.push(hrvModel.insertMany(hrvData));
      }

      /* ecg */
      if (ecg?.length) {
        await dbLib.createCollection(userId, CollectionType.ECG);
        const ecgModel = await ecgModelGenerator(userId);

        resolve.push(ecgModel.insertMany(ecg));
      }

      /* restingHeartRate */
      if (restingHeartRate?.length) {
        const restingHeartRateData = await biometricsHelper.restingHeartRateReducer(restingHeartRate);
        await dbLib.createTimeseriesCollection(userId, CollectionType.RESTING_HEART_RATE);
        const restingHeartRateModel = await restingHeartRateModelGenerator(userId);

        resolve.push(restingHeartRateModel.insertMany(restingHeartRateData));
      }

      /* respiratoryRate */
      if (respiratoryRate?.length) {
        const respiratoryRateData = await biometricsHelper.respiratoryRateReducer(respiratoryRate);
        await dbLib.createTimeseriesCollection(userId, CollectionType.RESPIRATORY_RATE);
        const respiratoryRateModel = await respiratoryRateModelGenerator(userId);

        resolve.push(respiratoryRateModel.insertMany(respiratoryRateData));
      }

      /* basalEnergyBurned */
      if (basalEnergyBurned?.length) {
        const basalEnergyBurnedData = await biometricsHelper.basalEnergyBurnedReducer(basalEnergyBurned);
        await dbLib.createTimeseriesCollection(userId, CollectionType.BASAL_ENERGY_BURNED);
        const basalEnergyBurnedModel = await basalEnergyBurnedModelGenerator(userId);

        resolve.push(basalEnergyBurnedModel.insertMany(basalEnergyBurnedData));
      }

      /* walkingHeartRateAverage */
      if (walkingHeartRateAverage?.length) {
        const walkingHeartRateAverageData = await biometricsHelper.walkingHeartRateAverageReducer(walkingHeartRateAverage);
        await dbLib.createTimeseriesCollection(userId, CollectionType.WALKING_HEART_RATE_AVERAGE);
        const walkingHeartRateAverageModel = await walkingHeartRateAverageModelGenerator(userId);

        resolve.push(walkingHeartRateAverageModel.insertMany(walkingHeartRateAverageData));
      }

      /* walkRunDistance */
      if (walkRunDistance?.length) {
        const walkRunDistanceData = await biometricsHelper.walkRunDistanceReducer(walkRunDistance);
        await dbLib.createTimeseriesCollection(userId, CollectionType.WALK_RUN_DUSTANCE);
        const walkRunDistanceModel = await walkRunDistanceModelGenerator(userId);

        resolve.push(walkRunDistanceModel.insertMany(walkRunDistanceData));
      }

      /* cyclingDistance */
      if (cyclingDistance?.length) {
        const cyclingDistanceData = await biometricsHelper.cyclingDistanceReducer(cyclingDistance);
        await dbLib.createTimeseriesCollection(userId, CollectionType.CYCLING_DISTANCE);
        const cyclingDistanceModel = await cyclingDistanceModelGenerator(userId);

        resolve.push(cyclingDistanceModel.insertMany(cyclingDistanceData));
      }

      /* flightsClimbed */
      if (flightsClimbed?.length) {
        const flightsClimbedData = await biometricsHelper.flightsClimbedReducer(flightsClimbed);
        await dbLib.createTimeseriesCollection(userId, CollectionType.FLIGHTS_CLIMBED);
        const flightsClimbedModel = await flightsClimbedModelGenerator(userId);

        resolve.push(flightsClimbedModel.insertMany(flightsClimbedData));
      }

      /* appleExerciseTime */
      if (appleExerciseTime?.length) {
        const appleExerciseTimeData = await biometricsHelper.appleExerciseTimeReducer(appleExerciseTime);
        await dbLib.createTimeseriesCollection(userId, CollectionType.APPLE_EXERCISE_TIME);
        const appleExerciseTimeModel = await appleExerciseTimeModelGenerator(userId);

        resolve.push(appleExerciseTimeModel.insertMany(appleExerciseTimeData));
      }

      /* appleStandTime */
      if (appleStandTime?.length) {
        const appleStandTimeData = await biometricsHelper.appleStandTimeReducer(appleStandTime);
        await dbLib.createTimeseriesCollection(userId, CollectionType.APPLE_STAND_TIME);
        const appleStandTimeModel = await appleStandTimeModelGenerator(userId);

        resolve.push(appleStandTimeModel.insertMany(appleStandTimeData));
      }

      /* insert all into db */
      await Promise.allSettled(resolve);

      return responseLib.success(res, 201, 'health data set success', '');
    } catch (error: any) {
      next(error)
    }
  }
}
