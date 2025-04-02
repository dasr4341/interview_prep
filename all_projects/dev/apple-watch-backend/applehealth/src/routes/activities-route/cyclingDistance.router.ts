import { Router } from "express";
import CyclingDistanceController from "../../controllers/cyclingDistance/cyclingDistance.controller.js";

export const cyclingDistanceRouter = Router();
const cyclingDistanceController = new CyclingDistanceController();

cyclingDistanceRouter.get("/date/:stDate/", cyclingDistanceController.cyclingDistanceDate);
cyclingDistanceRouter.get("/date/:stDate/:enDate/", cyclingDistanceController.cyclingDistanceDateRange);
cyclingDistanceRouter.get("/date/:stDate/:enDate/time/:stTime/:enTime", cyclingDistanceController.cyclingDistanceIntraday);
