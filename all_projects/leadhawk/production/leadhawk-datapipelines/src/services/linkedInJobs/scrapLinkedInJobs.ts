import type { Browser, Page } from "puppeteer";
import { linkedInJobLogger as logger } from "../../helper/createLogger.js";
import { interceptLinkedInJobPostRequest } from "./helper/blockOrgRequest.js";
import { scrapLinkedInJobHelper } from "./helper/scrapLinkedInJobHelper.js";
import type { ILinkedInJobPostData } from "../../interface/linkedInJob.interface.js";
import JobTitleSingleton from "../../helper/getJobTitles.js";

//----------------------------------------------------------------------
// ******* This file only* meant to scrap data from linkedIn for Jobs  *****
//----------------------------------------------------------------------

export const scrapLinkedInJobs = async (browser: Browser) => {
  const success: ILinkedInJobPostData[][] = [];
  const failed: string[] = [];

  logger.info(" ------- LinkedIn Jobs Invoked -----  ");
  const searchJobTitles = JobTitleSingleton.jobTitles;

  for (const jobTitle of searchJobTitles) {
      const linkedInJobPage = await browser.newPage();
      await linkedInJobPage.setRequestInterception(true);
      linkedInJobPage.on("request", interceptLinkedInJobPostRequest);

      logger.info(` - scraping for job title :: ${jobTitle}`);

      const result = await scrapLinkedInJobHelper(linkedInJobPage, jobTitle);

      if (!result?.length) {
        logger.info(` - No data found. Failed for :: ${jobTitle}`);
        failed.push(jobTitle);
        continue;
      }
      success.push(result);
    await linkedInJobPage.close();
  }

  return {
    success,
    failed,
  };
};
