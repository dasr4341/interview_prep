import type { Browser } from "puppeteer";
import { FormDsLastResModel } from "./models/formDsLastRecordModel.js";
import { googleHandler } from "./services/google/googleHandler.js";
import { linkedInHandler } from "./services/linkedIn/linkedInHandler.js";
import { saveDataHandler } from "./services/saveDb/saveData.js";
import { formDsLogger as logger } from "./helper/createLogger.js";
import { scrapFormDs } from "./services/funding/formDs/scrapFormDs.js";
import { CodeFlowType } from "./enums/codeFlowType.js";

export default async (browser: Browser) => {
  try {
    const companiesDetails = await scrapFormDs(browser);
    logger.info("FormDs scrape results", { companiesDetails });

    if (!companiesDetails?.output?.length) {
      throw new Error("FormDs :: No new Data found!");
    }

    // ----Calling google handler for getting linkedIn url -----
    const { success: googleSearchSuccessResult, failed: failedGoogleSearchResult } =
      await googleHandler(companiesDetails?.output, logger);
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
            source: CodeFlowType.FORMDS,
            scrapeCompanyName: e.companyName,
          },
          linkedData: null,
        };
      });
      await saveDataHandler(companyNameNotFoundData, logger);
    }

    if (!googleSearchSuccessResult?.length) {
      throw new Error("FormDs :: No google search Data found!");
    }

    // ----Calling linkedIn handler for company data scrape-----
    const linkedInData = await linkedInHandler(
      browser,
      googleSearchSuccessResult,
      logger
    );


    if (!linkedInData?.length) {
      throw new Error("FormDs :: No linkedIn company Data found!");
    }

    // ----Calling saveDBHandler for save scrape data-----
    await saveDataHandler([...companiesDetails?.currentData, ...linkedInData], logger);

    // -----If record exist update after successfully run the flow last record of formDs-----
    await FormDsLastResModel.findOneAndUpdate(
      { _id: companiesDetails?.lastRecordState?.recordId },
      {
        companyName: companiesDetails?.lastRecordState.currentCompany,
        investmentFund: companiesDetails?.lastRecordState.investmentType,
      },
      { upsert: true }
    );
  } catch (error) {
    logger.error("handler: error", error);
  }
};
