import puppeteerExtra from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import type { IPuppeteerConfiguration } from "../interface/puppeteer.interface.js";
import { config } from "../config/config.js";
import RecaptchaPlugin from "puppeteer-extra-plugin-recaptcha";
import type { Browser } from "puppeteer";
import { CodeFlowType } from "../enums/codeFlowType.js";
import type { Logger } from "winston";
import { generic } from "../config/constants/puppeteerConfiguration.js";

const puppeteerX = puppeteerExtra as any;
const RecaptchaPluginX = RecaptchaPlugin as any;

puppeteerX.use(
  RecaptchaPluginX({
    provider: {
      id: "2captcha",
      token: "441cbd39d862650d7cd399500006da2e",
    },
  })
);
puppeteerX.use(StealthPlugin());

export function sleep(time?: number) {
  return new Promise((resolve) => setTimeout(resolve, time || 5000));
}

const launchPuppeteer = (configuration: IPuppeteerConfiguration) =>
  puppeteerX.launch({
    executablePath: config.executablePath,
    headless: true,
    ...configuration,
  });

const getBrowserLaunchConfig = (sourceType?: CodeFlowType) => {
  // ----------------------- README ---------------------
  // ********* a. if source type is - 1, 2, 3, 4, 5 -> the puppeteer config for these are same
  // *********  - And source type for these will be - generic
  // ********* b. Indeed && formDs have different config
  // *********  - And source type will be CodeFlowType.INDEED, CodeFlowType.FORMDS respectively
  // 1. CodeFlowType.BUSINESS_NEWS,
  // 2. CodeFlowType.LINKEDIN_JOB_POST,
  // 3. CodeFlowType.NEW_HIRES,
  // 4. CodeFlowType.PR_NEWS,
  // 5. CodeFlowType.GOOGLE_FUNDING,
  // ----------------------- README ---------------------

  switch (sourceType) {
    case CodeFlowType.FORMDS: {
      return config.puppeteer.configuration[sourceType];
      break;
    }
    case CodeFlowType.INDEED: {
      return config.puppeteer.configuration[sourceType];
      break;
    }
    default: {
      return config.puppeteer.configuration[generic];
    }
  }
};

export const launchBrowser = async (
  logger: Logger,
  sourceType?: CodeFlowType
) => {
  try {
    const configuration = getBrowserLaunchConfig(sourceType);
    logger.info("--- :: puppeteer configuration :: ----", configuration);
    const browser: Browser = await launchPuppeteer(configuration);
    logger.info("--- :: puppeteer invoked :: ----");
    return browser;
  } catch (error) {
    logger.error("Error invoking puppeteer", error);
    throw new Error("Error invoking puppeteer");
  }
};
