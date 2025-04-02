import type { Browser, Page } from "puppeteer";
import { config } from "./config/config.js";
import axios from "axios";
import { is7DaysOld } from "./helper/check7DaysOld.js";
import type {
  INewHires,
  INewHiresScrapedData,
} from "./interface/newHires.interface.js";
import { NewHiresCacheModel } from "./models/newHiresCacheModel.js";
import { googleHandler } from "./services/google/googleHandler.js";
import { linkedInHandler } from "./services/linkedIn/linkedInHandler.js";
import { saveDataHandler } from "./services/saveDb/saveData.js";
import { newHiresLogger as logger } from "./helper/createLogger.js";
import { scrapeNewHires } from "./services/newHires/scrapeNewHires.js";
import type { IScrapedCompanyData } from "./interface/linkedIn.interface.js";
import JobTitleSingleton from "./helper/getJobTitles.js";
import { getCompanyUrlFromDesc } from "./helper/getCompanyUrlFromDescription.js";
import { unlistedJobTitleModel } from "./models/unlistedJobTitleModel.js";
import { CodeFlowType } from "./enums/codeFlowType.js";
import { getUTF8Data } from "./helper/encodeUTF-8String.js";

export default async (browser: Browser) => {
  try {
    const output: INewHires[] = [];
    const currentData: IScrapedCompanyData[] = [];
    const newScrapedData: INewHiresScrapedData[] = [];
    const scrapedData: INewHiresScrapedData[] = await scrapeNewHires(browser);

    for (const data of scrapedData) {
      const newHiresCachedData = await NewHiresCacheModel.findOne({
        description: data.description,
      });
      if (!newHiresCachedData) {
        newScrapedData.push(data);
      }
    }

    logger.info(`Total NewHires Data:: ${scrapedData.length}`);
    logger.info(
      `After check of new hires cached data ${newScrapedData.length}`
    );
    if (!newScrapedData.length) {
      throw new Error("No new post found!");
    }

    logger.info(
      `URL:: ${`${config.llmServerBaseUrl}/extract_information_gpt`}`,
      { currentNewHiresData: newScrapedData }
    );

    const llmExtractedData = await axios.post(
      `${config.llmServerBaseUrl}/extract_information_gpt`,
      newScrapedData,
      {
        headers: { "Content-Type": "application/json; charset=utf-8" },
      }
    );

    if (!llmExtractedData.data.length) {
      throw new Error("New Hires :: No data found, from LLM !");
    }

    const validExtractedData: INewHires[] = llmExtractedData.data.filter(
      (data: INewHires) => !data.error
    );
    logger.info(`validExtractedData :: ${validExtractedData.length}`);

    if (!validExtractedData?.length) {
      throw new Error("New Hires :: No valid data found, from LLM !");
    }

    const dataStatus = await is7DaysOld(validExtractedData, logger);

    for (const data of dataStatus) {
      const newHiresData = data.searchData as INewHires;
      const matchedTitle = JobTitleSingleton.mappedJobTitles.get(
        newHiresData.currentRole || ""
      );

      logger.info({ matchedTitle });
      if (!matchedTitle) {
        await unlistedJobTitleModel.findOneAndUpdate(
          { jobTitle: newHiresData.currentRole },
          { jobTitle: newHiresData.currentRole },
          { upsert: true }
        );
        continue;
      }

      if (data.status || !data.linkedIn) {
        output.push({ ...newHiresData, currentRole: matchedTitle });
      } else {
        currentData.push({
          other: {
            ...newHiresData,
            currentRole: matchedTitle,
            scrapeCompanyName: getUTF8Data(newHiresData.companyName || ""),
          },
          linkedData: data.linkedIn,
        });
      }
    }

    logger.info("7 days check :: ", {
      beforeCheck: validExtractedData.length,
      afterCheck: output.length,
    });

    if (!output?.length) {
      throw new Error(" New Hires :: No new Data found!");
    }
    console.log({ output: output.length });

    const { notMatchingCompanies, matchedCompanies } =
      getCompanyUrlFromDesc(output);

    // console.log(
    //   inspect(
    //     {
    //       notMatchingCompanies,
    //       matchedCompanies,
    //     },
    //     true,
    //     Infinity
    //   )
    // );

    if (matchedCompanies?.length) {
      const linkedInData = await linkedInHandler(
        browser,
        matchedCompanies,
        logger
      );
      if (linkedInData?.length) {
        await saveDataHandler(linkedInData, logger);
      }
    }

    const {
      success: successGoogleSearchResult,
      failed: failedGoogleSearchResult,
    } = await googleHandler(notMatchingCompanies, logger);
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
            source: CodeFlowType.NEW_HIRES,
            scrapeCompanyName: e.companyName,
          },
          linkedData: null,
        };
      });
      await saveDataHandler(companyNameNotFoundData, logger);
    }

    if (!successGoogleSearchResult?.length) {
      throw new Error("New Hires ::  No  Data from google search found!");
    }

    const linkedInData = await linkedInHandler(
      browser,
      successGoogleSearchResult,
      logger
    );

    if (!linkedInData?.length) {
      throw new Error(
        "New Hires ::  No  Data from linkedIn Company search found!"
      );
    }

    await saveDataHandler([...currentData, ...linkedInData], logger);

    const records = await NewHiresCacheModel.insertMany(
      JSON.parse(getUTF8Data(llmExtractedData.data))
    );
    logger.info(`Total created cached record: ${records.length}`);
  } catch (error) {
    logger.info("ERROR - newHires handler :: ", error);
  }
};
