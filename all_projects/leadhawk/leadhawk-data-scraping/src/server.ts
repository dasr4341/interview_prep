import { manageDbConnection } from "./config/dbConnection.js";
import type {  Context, EventBridgeEvent, Handler } from 'aws-lambda';
import { FundingController } from "./controllers/fundingController.js";
import mongoose from "mongoose";

const fundingController = new FundingController();
fundingController.getFormDsData();

export const handler: Handler = async (event: EventBridgeEvent<string, unknown> , context: Context) => {
  try {
    // TODO: refactor
    manageDbConnection();

    console.log('context: ', context);

    console.log('handler: event_rule: ', event);

    const fundingController = new FundingController();
    fundingController.getFormDsData();




  } catch (error) {
    console.log('handler: error', error);
  } finally {
    await mongoose.disconnect();
    console.log('handler: closing conenction');
  }
};