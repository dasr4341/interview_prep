import { Router } from "express";
import BasalEnergyBurnedController from "../../controllers/basalEnergyBurned/basalEnergyBurned.controller.js";

export const basalEnergyBurnedRouter = Router();
const basalEnergyBurned = new BasalEnergyBurnedController();

basalEnergyBurnedRouter.get("/date/:stDate/", basalEnergyBurned.basalEnergyBurnedDate);
basalEnergyBurnedRouter.get("/date/:stDate/:enDate/", basalEnergyBurned.basalEnergyBurnedDateRange);
basalEnergyBurnedRouter.get("/date/:stDate/:enDate/time/:stTime/:enTime", basalEnergyBurned.basalEnergyBurnedIntraday);
