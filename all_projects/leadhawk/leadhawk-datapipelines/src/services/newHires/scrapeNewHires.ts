import type { Browser, Page } from "puppeteer";
import { config } from "../../config/config.js";
import type {
  INewHires,
  INewHiresScrapedData,
} from "../../interface/newHires.interface.js";
import { newHiresLogger as logger } from "../../helper/createLogger.js";
import { loginLinkedIn, logoutLinkedIn } from "../../helper/linkedInLogin.js";
import { interceptLinkedInJobPostRequest } from "./helper/blockOrgRequest.js";
import { scrapeNewHiresHelper } from "./helper/scrapeNewHiresHelper.js";
import JobTitleSingleton from "../../helper/getJobTitles.js";

export const scrapeNewHires = async (browser: Browser) => {
  const scrapedData: INewHiresScrapedData[] = [];

  const loginInPage = await browser.newPage();
  await loginInPage.setUserAgent(config.puppeteer.userAgent);
  await loginLinkedIn(loginInPage, logger);

  const searchJobTitles = JobTitleSingleton.jobTitles;

  for (const jobTitle of searchJobTitles) {
    try {
      logger.info(
        `Starting scraping for new hires with job title - ${jobTitle}`
      );
      const linkedInPage = await browser.newPage();
      linkedInPage.setViewport({
        width: 1200,
        height: 800,
      });

      await linkedInPage.setRequestInterception(true);
      linkedInPage.on("request", interceptLinkedInJobPostRequest);

      const result = await scrapeNewHiresHelper(jobTitle, linkedInPage);
      if (result?.length) {
        scrapedData.push(...result);
      }
      await linkedInPage.close();
    } catch (e: any) {
      logger.info(` New Hires scrapping ERR:  - ${e.message}`);
    }
  }
  await logoutLinkedIn(loginInPage, logger);
  await loginInPage.close();

  return scrapedData;
};
