import type { Browser } from "puppeteer";
import type { IBusinessAndPRNews } from "./interface/businessAndprNews.interface.js";
import { is7DaysOld } from "./helper/check7DaysOld.js";
import { saveDataHandler } from "./services/saveDb/saveData.js";
import { linkedInHandler } from "./services/linkedIn/linkedInHandler.js";
import { businessNewsLogger as logger } from "./helper/createLogger.js";
import { googleHandler } from "./services/google/googleHandler.js";
import { extractPrNewsWireData } from "./services/businessNews/helper/extractPrNewsWireData.js";
import { extractBusinessWireData } from "./services/businessNews/helper/extractBusinessWireData.js";
import { IScrapedCompanyData } from "./interface/linkedIn.interface.js";
import { CodeFlowType } from "./enums/codeFlowType.js";

export default async (browser: Browser) => {
  try {
    const output = [];
    const currentData: IScrapedCompanyData[] = [];

    // getting the data from the pr news service
    const prNewsData = await extractPrNewsWireData(browser, logger);
    // getting the data from the business news service
    const businessNewsData = await extractBusinessWireData(logger);

    // arranging all the data at a place
    const newsDetail: IBusinessAndPRNews[] = [
      ...prNewsData,
      ...businessNewsData,
    ];

    // ---------------------------------------------
    // **** checking for the old data status ******
    // ---------------------------------------------
    const recordStatus = await is7DaysOld(newsDetail, logger, true);
    for (const data of recordStatus) {
      const newsDetails = data.searchData as IBusinessAndPRNews;

      if (data.status) {
        if (!newsDetails?.companyName) {
          continue;
        }
        output.push(newsDetails);
      } else {
        currentData.push({
          other: {
            ...newsDetails,
            scrapeCompanyName: newsDetails.companyName,
          },
          linkedData: data.linkedIn,
        });
      }
    }
    // ---------------------------------------------
    // **** checking for the old data status ******
    // ---------------------------------------------

    logger.info("7 Days Check", {
      BeforeCheck: newsDetail.length,
      AfterCheck: output.length,
    });

    if (!output?.length) {
      throw new Error("BusinessNews :: No new Data found!");
    }

    // ---------------------------------------------
    // ******* getting the company details by *******
    //  - searching it in google

    const {
      success: successGoogleSearchResult,
      failed: failedGoogleSearchResult,
    } = await googleHandler(output, logger);
    logger.info(
      `Got Google Search Result ${{
        success: successGoogleSearchResult?.length,
        failed: failedGoogleSearchResult.length,
      }} `
    );

    if (!!failedGoogleSearchResult?.length) {
      const companyNameNotFoundData = failedGoogleSearchResult.map((e) => {
        return {
          other: {
            ...e,
            source: CodeFlowType.BUSINESS_NEWS,
            scrapeCompanyName: e.companyName,
          },
          linkedData: null,
        };
      });
      await saveDataHandler(companyNameNotFoundData, logger);
    }
    if (!successGoogleSearchResult?.length) {
      throw new Error("BusinessNews :: No Data found! from google search ");
    }
    // ---------------------------------------------

    // -------------------------------------------------------------
    // ***** getting the linkedIn company data for that company ****
    // ---------------------------------------------
    const linkedInData = await linkedInHandler(
      browser,
      successGoogleSearchResult,
      logger
    );

    if (!linkedInData?.length) {
      throw new Error("BusinessNews :: No Data found! from linkedIn search ");
    }
    // ---------------------------------------------
    // ***** getting the linkedIn company data for that company ****
    // ---------------------------------------------

    // saving the data to db
    if (currentData.length) {
      logger.info({ currentData: currentData.length });
      await saveDataHandler(currentData, logger);
    }
    await saveDataHandler(linkedInData, logger);
  } catch (error) {
    logger.error("Error - businessNews handler", { error });
  }
};
