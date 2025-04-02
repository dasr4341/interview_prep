import schedule from "node-schedule";
import type { Browser } from "puppeteer";
import { AxiosError } from "axios";
import { connectDatabase } from "./config/dbConnection.js";
import { CodeFlowType } from "./enums/codeFlowType.js";
import { launchBrowser } from "./helper/launch.puppeteer.js";
import {
  businessNewsLogger,
  expressServerLogger,
  formDsLogger,
  googleFundingLogger,
  indeedLogger,
  linkedInJobLogger,
  newHiresLogger,
} from "./helper/createLogger.js";

import fundingGoogleNewsHandler from "./fundingGoogleNews.handler.js";
import businessNewsHandler from "./businessNews.handler.js";
import formDsHandler from "./formDs.handler.js";
import indeedJobPostHandler from "./indeedJobPost.handler.js";
import linkedInJobPostHandler from "./linkedInJobPost.handler.js";
import newHiresHandler from "./newHires.handler.js";
import JobTitleSingleton from "./helper/getJobTitles.js";
import IndustrySingleton from "./config/constants/industries.js";
import winston from "winston";

const loggerMap: { [key: string]: winston.Logger } = {
  [CodeFlowType.FORMDS]: formDsLogger,
  [CodeFlowType.INDEED]: indeedLogger,
  [CodeFlowType.LINKEDIN_JOB_POST]: linkedInJobLogger,
  [CodeFlowType.BUSINESS_NEWS]: businessNewsLogger,
  [CodeFlowType.NEW_HIRES]: newHiresLogger,
  [CodeFlowType.PR_NEWS]: newHiresLogger,
  [CodeFlowType.GOOGLE_FUNDING]: googleFundingLogger,
};

const app = async (sourceType: CodeFlowType) => {
  const logger = loggerMap[sourceType];

  logger.defaultMeta = {
    ...logger.defaultMeta,
    runId: +new Date(),
  };

  let browser: Browser | null = null;
  try {
    browser = await launchBrowser(logger, sourceType);

    // Initially called getJobTitles to initialize data
    await JobTitleSingleton.getJobTitles();

    await IndustrySingleton.getIndustry();

    if (!browser) {
      throw new Error("Browser not launched properly !!");
    }

    logger.info(`${sourceType} flow starts @ ${new Date()}`);
    switch (sourceType) {
      case CodeFlowType.FORMDS:
        await formDsHandler(browser);
        break;
      case CodeFlowType.INDEED: {
        await indeedJobPostHandler(browser);
        break;
      }
      case CodeFlowType.LINKEDIN_JOB_POST: {
        await linkedInJobPostHandler(browser);
        break;
      }
      case CodeFlowType.NEW_HIRES: {
        await newHiresHandler(browser);
        break;
      }
      case CodeFlowType.BUSINESS_NEWS:
        await businessNewsHandler(browser);
        break;
      case CodeFlowType.GOOGLE_FUNDING:
        await fundingGoogleNewsHandler(browser);
        break;
      default:
        logger.error("Unknown state: %s", sourceType);
    }
    logger.info(`${sourceType} flow ends @ ${new Date()}`);
  } catch (error) {
    if (error instanceof AxiosError) {
      logger.error("Some axios error occur:", { error });
    } else {
      logger.error(" :: Error while starting :: ", { error });
    }
  } finally {
    if (browser) {
      const childProcess = browser.process();
      const pages = await browser.pages();
      for (let i = 0; i < pages.length; i++) {
        await pages[i].close();
      }
      await browser.close();
      if (childProcess) {
        childProcess?.kill("SIGKILL");
        childProcess.kill(9)
      }
      logger.info(`Browser closed 2: ${childProcess === null} - ${childProcess?.pid}`);
    }
  }
};


if (process.env.NODE_ENV === "production") {
  await connectDatabase(expressServerLogger);
  schedule.scheduleJob(
    "*/5 * * * *",
    async () => await app(CodeFlowType.FORMDS)
  );
  schedule.scheduleJob(
    "*/10 * * * *",
    async () => await app(CodeFlowType.GOOGLE_FUNDING)
  );
  schedule.scheduleJob(
    "*/20 * * * *",
    async () => await app(CodeFlowType.BUSINESS_NEWS)
  );

  schedule.scheduleJob(
    "*/15 * * * *",
    async () => await app(CodeFlowType.INDEED)
  );

  schedule.scheduleJob(
    "*/25 * * * *",
    async () => await app(CodeFlowType.LINKEDIN_JOB_POST)
  );
  schedule.scheduleJob(
    "0 * * * *",
    async () => await app(CodeFlowType.NEW_HIRES)
  );
} else {
  await connectDatabase(expressServerLogger);
  // For Local Debugging
  // const llmHomeApi = await axios.get(config.llmServerBaseUrl);
  // logger.info(`llmHomeApi: ${llmHomeApi}`);
  // await app(CodeFlowType.NEW_HIRES);
}
await app(CodeFlowType.FORMDS);
await app(CodeFlowType.GOOGLE_FUNDING);
await app(CodeFlowType.LINKEDIN_JOB_POST);
await app(CodeFlowType.BUSINESS_NEWS);

