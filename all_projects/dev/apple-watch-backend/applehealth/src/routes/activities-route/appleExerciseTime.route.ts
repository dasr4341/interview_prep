import { Router } from "express";
import AppleExerciseTime from "../../controllers/appleExerciseTime/appleExerciseTime.controller.js";

export const appleExerciseTimeRouter = Router();
const appleExerciseTime = new AppleExerciseTime();

appleExerciseTimeRouter.get("/date/:stDate/", appleExerciseTime.exerciseTimeDate);
appleExerciseTimeRouter.get("/date/:stDate/:enDate/", appleExerciseTime.exerciseTimeDateRange);
appleExerciseTimeRouter.get("/date/:stDate/:enDate/time/:stTime/:enTime", appleExerciseTime.exerciseTimeIntraday);
