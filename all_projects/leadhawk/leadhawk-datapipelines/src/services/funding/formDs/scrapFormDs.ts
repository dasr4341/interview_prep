import type { Browser, Page } from "puppeteer";
import { config } from "../../../config/config.js";
import { checkLastRecordData } from "./helper/checkLastRecordData.js";
import { getPageData } from "./helper/getPageData.js";
import { is7DaysOld } from "../../../helper/check7DaysOld.js";
import type { IFormDs } from "../../../interface/formDs.interface.js";
import { formDsLogger as logger } from "../../../helper/createLogger.js";
import type { IScrapedCompanyData } from "../../../interface/linkedIn.interface.js";

export const scrapFormDs = async (browser: Browser) => {
  try {
    const page = await browser.newPage();
    await page.setUserAgent(config.puppeteer.userAgent);
    await page.waitForNetworkIdle({ idleTime: 5000 });

    const noOfPage = Math.ceil(
      config.formDs.searchLimit / config.formDs.singlePageLength
    );

    // 1. page

    const lastRecordState = await checkLastRecordData(page);
    // lastRecordState.status -
    // 1. true - means the prev and current company is same
    // 2. false - not same
    // when not same means some new data is added

    if (!lastRecordState.status) {
      console.log("Getting data from from ds .... ", lastRecordState);
      const formDsPageData = await getPageData(
        noOfPage,
        config.formDs.maxSearchLimit,
        page,
        lastRecordState
      );

      logger.silly("FORMDS DATA for Page", formDsPageData);
      logger.info(`Before 7 days check got ${formDsPageData.length} data`);

      await page.close();

      const seen = new Set();
      const uniqueFormDsData = formDsPageData.filter((item) => {
        if (seen.has(item.companyName)) {
          return false;
        }
        seen.add(item.companyName);
        return true;
      });

      const dataStatus = await is7DaysOld(uniqueFormDsData, logger);

      const output: IFormDs[] = [];
      const currentData: IScrapedCompanyData[] = [];
      for (const data of dataStatus) {
        const formDsData = data.searchData as IFormDs;
        if ((data.status && formDsData) || !data.linkedIn) {
          output.push(formDsData);
        } else {
          currentData.push({
            other: {
              ...formDsData,
              scrapeCompanyName: formDsData.companyName,
            },
            linkedData: data.linkedIn,
          });
        }
      }

      logger.info("FormDs scrape result", { output, lastRecordState });
      logger.info("FormDs after 7 days", { AfterCheck: output.length });
      return { output, currentData, lastRecordState };
    }


    return { output: [], currentData: [], lastRecordState };
  } catch (error) {
    logger.info(`Form Ds scrapping ERR:  - ${error}`);
  }
};
