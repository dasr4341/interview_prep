import { differenceInSeconds } from 'date-fns';

import {
  AppleExerciseTime,
  AppleStandTime,
  BasalEnergyBurned,
  CyclingDistance,
  FlightsClimbed,
  Heart,
  Hrv,
  RespiratoryRate,
  RestingHeartRate,
  Sleep,
  Spo2,
  Steps,
  WalkRunDistance,
  WalkingHeartRateAverage,
} from '../controllers/health-data/health-data.interface.js';
import { SleepLevels } from '../enums/health-data.enum.js';

export const biometricsHelper = {
  heartReducer: async (heart: Heart[]) => {
    const heartData = structuredClone(heart);

    return heartData.map((e) => ({
      time: new Date(e.endDate),
      value: e.data,
    }));
  },

  stepsReducer: async (steps: Steps[]) => {
    const stepsData = structuredClone(steps);

    return stepsData.map((e) => ({
      time: new Date(e.endDate),
      value: e.data,
    }));
  },

  sleepReducer: async (sleep: Sleep[]) => {
    const sleepData = structuredClone(sleep);

    sleepData.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

    interface SleepGroup {
      0: { sleepValue: number; endDate: string; startDate: string }[];
      1: { sleepValue: number; endDate: string; startDate: string }[];
      2: { sleepValue: number; endDate: string; startDate: string }[];
      3: { sleepValue: number; endDate: string; startDate: string }[];
      4: { sleepValue: number; endDate: string; startDate: string }[];
      5: { sleepValue: number; endDate: string; startDate: string }[];
    }

    const group: SleepGroup = sleepData.reduce((acc: any, curr) => {
      if (!acc[curr.sleepValue]) {
        acc[curr.sleepValue] = [];
      }
      acc[curr.sleepValue].push(curr);
      return acc;
    }, {});

    let inBed = 0;
    let asleepUnspecified = 0;
    let awake = 0;
    let asleepCore = 0;
    let asleepDeep = 0;
    let asleepREM = 0;

    if (group[SleepLevels.inBed]?.length) {
      inBed = differenceInSeconds(new Date(group[0].at(-1)?.endDate as any), new Date(group[0].at(0)?.startDate as any)) / 60;
    }

    if (group[SleepLevels.asleepUnspecified]?.length) {
      asleepUnspecified = group[2].reduce((acc: number, curr) => {
        const delta = differenceInSeconds(new Date(curr.endDate), new Date(curr.startDate)) / 60;
        return acc + delta;
      }, 0);
    }

    if (group[SleepLevels.awake]?.length) {
      awake = group[2].reduce((acc: number, curr) => {
        const delta = differenceInSeconds(new Date(curr.endDate), new Date(curr.startDate)) / 60;
        return acc + delta;
      }, 0);
    }

    if (group[SleepLevels.asleepCore]?.length) {
      asleepCore = group[3].reduce((acc: number, curr) => {
        const delta = differenceInSeconds(new Date(curr.endDate), new Date(curr.startDate)) / 60;
        return acc + delta;
      }, 0);
    }

    if (group[SleepLevels.asleepDeep]?.length) {
      asleepDeep = group[4].reduce((acc: number, curr) => {
        const delta = differenceInSeconds(new Date(curr.endDate), new Date(curr.startDate)) / 60;
        return acc + delta;
      }, 0);
    }

    if (group[SleepLevels.asleepREM]?.length) {
      asleepREM = group[5].reduce((acc: number, curr) => {
        const delta = differenceInSeconds(new Date(curr.endDate), new Date(curr.startDate)) / 60;
        return acc + delta;
      }, 0);
    }

    return {
      time: new Date(group[0].at(-1)?.endDate as any),
      value: {
        inBed: Math.round(inBed),
        asleepUnspecified: Math.round(asleepUnspecified),
        awake: Math.round(awake),
        asleepCore: Math.round(asleepCore),
        asleepDeep: Math.round(asleepDeep),
        asleepREM: Math.round(asleepREM),
      },
    };
  },

  spo2Reducer: async (spo2: Spo2[]) => {
    const spo2Data = structuredClone(spo2);

    return spo2Data.map((e) => ({
      time: new Date(e.endDate),
      value: e.data * 100,
    }));
  },

  hrvReducer: async (hrv: Hrv[]) => {
    const hrvData = structuredClone(hrv);

    return hrvData.map((e) => ({
      time: new Date(e.endDate),
      value: e.data * 1000,
    }));
  },

  restingHeartRateReducer: async (restingHeartRate: RestingHeartRate[]) => {
    const restingHeartRateData = structuredClone(restingHeartRate);

    return restingHeartRateData.map((e) => ({
      time: new Date(e.endDate),
      value: e.data,
    }));
  },

  respiratoryRateReducer: async (respiratoryRate: RespiratoryRate[]) => {
    const respiratoryRateData = structuredClone(respiratoryRate);

    return respiratoryRateData.map((e) => ({
      time: new Date(e.endDate),
      value: e.data,
    }));
  },

  basalEnergyBurnedReducer: async (basalEnergyBurned: BasalEnergyBurned[]) => {
    const basalEnergyBurnedData = structuredClone(basalEnergyBurned);

    return basalEnergyBurnedData.map((e) => ({
      time: new Date(e.endDate),
      value: e.data,
    }));
  },

  walkingHeartRateAverageReducer: async (walkingHeartRateAverage: WalkingHeartRateAverage[]) => {
    const walkingHeartRateAverageData = structuredClone(walkingHeartRateAverage);

    return walkingHeartRateAverageData.map((e) => ({
      time: new Date(e.endDate),
      value: e.data,
    }));
  },

  walkRunDistanceReducer: async (walkRunDistance: WalkRunDistance[]) => {
    const walkRunDistanceData = structuredClone(walkRunDistance);

    return walkRunDistanceData.map((e) => ({
      time: new Date(e.endDate),
      value: e.data,
    }));
  },

  cyclingDistanceReducer: async (cyclingDistance: CyclingDistance[]) => {
    const cyclingDistanceData = structuredClone(cyclingDistance);

    return cyclingDistanceData.map((e) => ({
      time: new Date(e.endDate),
      value: e.data,
    }));
  },

  flightsClimbedReducer: async (flightsClimbed: FlightsClimbed[]) => {
    const flightsClimbedData = structuredClone(flightsClimbed);

    return flightsClimbedData.map((e) => ({
      time: new Date(e.endDate),
      value: e.data,
    }));
  },

  appleExerciseTimeReducer: async (appleExerciseTime: AppleExerciseTime[]) => {
    const appleExerciseTimeData = structuredClone(appleExerciseTime);

    return appleExerciseTimeData.map((e) => ({
      time: new Date(e.endDate),
      value: e.data,
    }));
  },

  appleStandTimeReducer: async (appleStandTime: AppleStandTime[]) => {
    const appleStandTimeData = structuredClone(appleStandTime);

    return appleStandTimeData.map((e) => ({
      time: new Date(e.endDate),
      value: e.data,
    }));
  },
};
