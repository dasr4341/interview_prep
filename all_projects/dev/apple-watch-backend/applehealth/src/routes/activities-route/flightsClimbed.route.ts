import { Router } from "express";
import FlightsClimbedController from "../../controllers/flightsClimbed/flightsClimbed.controller.js";

export const flightsClimbedRouter = Router();
const flightsClimbedController = new FlightsClimbedController();

flightsClimbedRouter.get("/date/:stDate/", flightsClimbedController.flightsClimbedDate);
flightsClimbedRouter.get("/date/:stDate/:enDate/", flightsClimbedController.flightsClimbedDateRange);
flightsClimbedRouter.get("/date/:stDate/:enDate/time/:stTime/:enTime", flightsClimbedController.flightsClimbedIntraday);
