import type { Browser } from "puppeteer";
import { is7DaysOld } from "./helper/check7DaysOld.js";
import type { IIndeed } from "./interface/indeed.interface.js";
import { IndeedLastRecordModel } from "./models/indeedLastRecordModel.js";
import { googleHandler } from "./services/google/googleHandler.js";
import { linkedInHandler } from "./services/linkedIn/linkedInHandler.js";
import { saveDataHandler } from "./services/saveDb/saveData.js";
import { indeedLogger as logger } from "./helper/createLogger.js";
import { scrapeIndeed } from "./services/indeed/scrapeIndeed.js";
import { launchBrowser } from "./helper/launch.puppeteer.js";
import type { IScrapedCompanyData } from "./interface/linkedIn.interface.js";
import { CodeFlowType } from "./enums/codeFlowType.js";

//------------------------- README ---------------------------------------------
// ******** This file act as a controller ********
// 1. gets scraped data from scrapIndeed()
// 2. then googled the data
// 3. gets company data from linkedInHandler()
// 4. then saves the data
//----------------------------------------------------------------------

export default async (proxyBrowser: Browser) => {
  const childLogger = logger.child({ subService: "Indeed Scraper" });
  const output = [];
  const currentData: IScrapedCompanyData[] = [];
  let browser: null | Browser = null;

  try {
    // getting the scraped data
    const scrapeData = await scrapeIndeed(proxyBrowser);
    if (!scrapeData) {
      throw Error("Indeed scrape failed!!");
    }
    const { success: scrapedJobsData, failed } = scrapeData;

    // logging the failed stats
    if (failed.length) {
      childLogger.error("Scrapping failed ::", failed.length);
      childLogger.error("Scrapping failed details ::", failed);
    }

    // launching a new (generic) browser for linkedin company service
     browser = await launchBrowser(logger);

    for (const job of scrapedJobsData) {
      if (job?.indeedJobData?.length) {
        const dataStatus = await is7DaysOld(job?.indeedJobData, logger);

        for (const data of dataStatus) {
          const jobDetails = data.searchData as IIndeed;

          if (data.status || !data.linkedIn) {
            output.push(jobDetails);
          } else {
            currentData.push({
              other: {
                ...jobDetails,
                scrapeCompanyName: jobDetails.companyName,
              },
              linkedData: data.linkedIn,
            });
          }
        }
        logger.info("Indeed after 7 days", dataStatus);
      }

      logger.info(`Indeed Scraped ${output?.length} items `);
      if (!output?.length) {
        childLogger.info("No new data found!");
        return;
      }

      childLogger.info("Starting Google Search scrape.", output);
      childLogger.info(
        "------------------ NOW CALLING THE GOOGLE HANDLER ------------------"
      );

      // ---------------------------------------------
      // ******* getting the company details by *******
      //  - searching it in google
      const {
        success: googleSearchSuccessResult,
        failed: failedGoogleSearchResult,
      } = await googleHandler(output, logger);

      logger.info(
        `Got Google Search Result ${{
          success: googleSearchSuccessResult?.length,
          failed: failedGoogleSearchResult.length,
        }} `
      );

      if (!!failedGoogleSearchResult?.length) {
        const companyNameNotFoundData = failedGoogleSearchResult.map((e) => {
          return {
            other: {
              ...e,
              source: CodeFlowType.INDEED,
              scrapeCompanyName: e.companyName,
            },
            linkedData: null,
          };
        });
        await saveDataHandler(companyNameNotFoundData, logger);
      }

      if (!googleSearchSuccessResult?.length) {
        childLogger.info("No data found! form google ");
        return;
      }
      // ******* getting the company details by *******
      // ---------------------------------------------

      // -------------------------------------------------------------
      // ***** getting the linkedIn company data for that company ****
      const linkedInData = await linkedInHandler(
        browser,
        googleSearchSuccessResult,
        logger
      );
      if (!linkedInData?.length) {
        childLogger.info("No data found! form linkedIn company ");
        return;
      }
      // -------------------------------------------------------------
      // ***** getting the linkedIn company data for that company ****

      // ***** Calling saveDBHandler for save scrape data *****
      if (currentData.length) {
        await saveDataHandler(currentData, logger);
      }
      await saveDataHandler(linkedInData, logger);

      // ***** If record exist update after successfully run the flow last record of formDs ****
      await IndeedLastRecordModel.findOneAndUpdate(
        { searchJobTitle: job.searchJobTitle },
        {
          searchJobTitle: job.searchJobTitle,
          companyName: job?.lastRecordStatus?.currCompanyName,
          jobTitle: job?.lastRecordStatus?.currJobTitle,
        },
        { upsert: true, new: true }
      );
    }
  } catch (error) {
    childLogger.info("ERR::", error);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};
