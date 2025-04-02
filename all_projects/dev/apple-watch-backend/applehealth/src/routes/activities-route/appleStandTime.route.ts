import { Router } from "express";
import AppleStandTimeController from "../../controllers/appleStandTime/appleStandTime.controller.js";

export const appleStandTimeRouter = Router();
const appleStandTimeController = new AppleStandTimeController();

appleStandTimeRouter.get("/date/:stDate/", appleStandTimeController.appleStandTimeDate);
appleStandTimeRouter.get("/date/:stDate/:enDate/", appleStandTimeController.appleStandTimeDateRange);
appleStandTimeRouter.get("/date/:stDate/:enDate/time/:stTime/:enTime", appleStandTimeController.appleStandTimeIntraday);
