import type { Browser, Page } from "puppeteer";
import { config } from "../../config/config.js";
import type {
  IScrapedIndeedJobs,
  IScrapingFailure,
} from "../../interface/indeed.interface.js";
import { interceptIndeedRequest } from "./helper/blockRequestIndeed.js";
import { scrapDataFromIndeed } from "./helper/scrapeIndeedHelper.js";
import { indeedLogger as logger } from "../../helper/createLogger.js";
import JobTitleSingleton from "../../helper/getJobTitles.js";

//----------------------------------------------------------------------
// ******* This file only* meant to scrap data from indeed website *****
//----------------------------------------------------------------------

export const scrapeIndeed = async (browser: Browser) => {
  try {
    const output: IScrapedIndeedJobs[] = [];
    const failed: IScrapingFailure[] = [];

    if (!config.oxyLab.username || !config.oxyLab.password) {
      throw new Error('Oxy lab credentials incorrect')
    }

    const searchJobTitles = JobTitleSingleton.jobTitles;

    for (const jobTitle of searchJobTitles) {
      let page: Page | null = null;
      try {
        page = await browser.newPage();
        //----------------------------------------------------------------------
        // ************* Setting up the page *****************
        //----------------------------------------------------------------------
        await page.setBypassCSP(true);
        await page.setUserAgent(config.puppeteer.userAgent);

        await page.setRequestInterception(true);
        page.on("request", interceptIndeedRequest);

        await page.authenticate({
          username: config.oxyLab.username,
          password: config.oxyLab.password,
        });
        //----------------------------------------------------------------------
        // ************* Setting up the page Ends *****************
        //----------------------------------------------------------------------

        //----------------------------------------------------------------------
        //  ************* Getting the IP *****************
        //----------------------------------------------------------------------
        await page.goto("https://httpbin.org/ip");
        const extractedText = await page.$eval("*", (el: any) => el?.innerText);
        console.log({ currentIp: extractedText });
        //----------------------------------------------------------------------
        // ************* Getting the IP Ends *****************
        //----------------------------------------------------------------------

        console.log(
          `---------- Starting scraping for job title - ${jobTitle} -----------`
        );
        const result = await scrapDataFromIndeed(
          page,
          Number(config.indeed.searchLimit),
          jobTitle
        );

        console.log(`-- Scraped Data for ${jobTitle} :: result :: ${result} `);

        if (result?.indeedJobData) {
          output.push({
            ...result,
            searchJobTitle: jobTitle,
          });
        } else {
          failed.push({
            searchJobTitle: jobTitle,
          });
          console.log("- NO DATA FOUND");
        }
      } catch (e:any) {
        logger.info(` scraping failed for jobTitle :: ${jobTitle}, Error :: ${e?.message}`)
      } finally {
        if (page) {
          await page.close();
        }
      }
    }

    console.log("----- output -----", output);

    return {
      success: output,
      failed,
    };
  } catch (error) {
    logger.error("ERROR - scrapeIndeed :: ", { error });
  }
};
