import type { Page } from "puppeteer";
import { gotoIndeedPage } from "./gotoIndeedPage.js";
import { config } from "../../../config/config.js";
import { CodeFlowType } from "../../../enums/codeFlowType.js";
import type {
  IIndeed,
  IIndeedLastRecordData,
} from "../../../interface/indeed.interface.js";
import { getLastRecordStatusIndeed } from "./getLastRecordStatusIndeed.js";
import { indeedLogger as logger } from "../../../helper/createLogger.js";
import JobTitleSingleton from "../../../helper/getJobTitles.js";
import { unlistedJobTitleModel } from "../../../models/unlistedJobTitleModel.js";
import { sanitizeObj } from "../../../helper/getUTF8Data.js";

export async function scrapDataFromIndeed(
  page: Page,
  limit: number,
  searchJobTitle: string
): Promise<
  | {
      lastRecordStatus: IIndeedLastRecordData | null;
      indeedJobData: IIndeed[];
    }
  | undefined
> {
  try {
    const allScrapedIndeedJobs: { [key: string]: IIndeed } = {};
    let indeedSearchLimit = Math.ceil(
      limit / Number(config.indeed.singlePageLength)
    );

    await gotoIndeedPage(page, searchJobTitle, config.defaultLocation.country);

    const isNoJobsFound =
      (await (
        await page.$("div.jobsearch-NoResult-messageContainer")
      )?.isVisible()) || null;

    if (isNoJobsFound) {
      console.log(" - No result found, try with diff data");
      return { lastRecordStatus: null, indeedJobData: [] };
    }

    await page.waitForSelector("#mosaic-provider-jobcards", { visible: true });

    const allPaginationBtn = await page.$$(
      "#jobsearch-JapanPage > div > div.css-hyhnne.e37uo190 > div > div.css-pprl14.eu4oa1w0 > nav > ul"
    );
    const isMoreDataAvailable = await getLastRecordStatusIndeed(
      searchJobTitle,
      page
    );

    if (isMoreDataAvailable.status) {
      return { lastRecordStatus: isMoreDataAvailable, indeedJobData: [] };
    }

    for (let i = 1; i <= indeedSearchLimit; i++) {
      // getting all the required data from indeed website
      const scapedJobList = await page.evaluate((indeedBaseUrl) => {
        const scrapedJobs: {
          jobLink: string | null;
          rawJobTitle: string | null;
          companyName: string | null;
          jobLocation: string | null;
        }[] = [];

        const jobsNodeList = document.querySelectorAll(
          "#mosaic-provider-jobcards > ul > li"
        );
        const jobsNodeListArr = Array.from(jobsNodeList);

        for (const item of jobsNodeListArr) {
          const ele = item.querySelector(
            "tbody > tr:first-child > td:first-child"
          );
          if (!ele) {
            continue;
          }
          const rawJobTitleEle = ele.querySelector("div:nth-child(1) a");
          const companyDetails = ele.querySelectorAll(
            "div:nth-child(2) > div > div"
          );

          // rawJobTitle is the job title we scraped
          const rawJobTitle =
            rawJobTitleEle?.querySelector("span")?.innerText || null;

          // jobLink is mandatory
          const jobLink =
            `${indeedBaseUrl}${rawJobTitleEle?.getAttribute("href")}` || null;
          // companyName is mandatory
          const companyName =
            (companyDetails[0] as HTMLElement)?.innerText || null;

          const jobLocation =
            (companyDetails[1] as HTMLElement)?.innerText || null;

          if (!jobLink || !rawJobTitle || !companyName) {
            continue;
          }

          scrapedJobs.push({
            jobLink,
            rawJobTitle,
            companyName,
            jobLocation,
          });
        }
        return scrapedJobs;
      }, config.indeed.baseUrl);

      const sanitizedScrapedJobListData = sanitizeObj(JSON.stringify(scapedJobList))

      // mapping title and checking for the last record
      for (const scrapedJob of sanitizedScrapedJobListData) {
        // mapping the job title
        const matchedTitle = JobTitleSingleton.mappedJobTitles.get(
          scrapedJob.rawJobTitle?.trim() || ""
        );

        logger.info(
          `MatchedTitle status :: ${matchedTitle}, RawJobTitle :: ${scrapedJob.rawJobTitle}, SearchTitle :: ${searchJobTitle}`
        );

        if (matchedTitle && scrapedJob.jobLink) {
          // arranging the data
          const indeedData: IIndeed = {
            jobTitle: matchedTitle as string,
            source: CodeFlowType.INDEED,
            ...scrapedJob,
          };

          const cmpNameK = indeedData.companyName?.toLowerCase().trim();
          const jbTitleK = indeedData.rawJobTitle?.toLowerCase().trim();
          const key = cmpNameK && jbTitleK ? `${cmpNameK}${jbTitleK}` : null;

          // if the data exist then we will not store it
          if (key && !allScrapedIndeedJobs[key]) {
            allScrapedIndeedJobs[key] = indeedData;
          }
        } else {
          await unlistedJobTitleModel.findOneAndUpdate(
            { jobTitle: scrapedJob.rawJobTitle },
            { jobTitle: scrapedJob.rawJobTitle },
            { upsert: true }
          );
        }
        // ---------------------------------------------------
        // **************** when both the data matches || cursor Data === current Data || *******
        // ---------------------------------------------------
        if (
          isMoreDataAvailable?.prevJobTitle === scrapedJob.rawJobTitle &&
          isMoreDataAvailable?.prevCompanyName === scrapedJob.companyName
        ) {
          return {
            lastRecordStatus: isMoreDataAvailable,
            indeedJobData: Object.values(allScrapedIndeedJobs),
          };
        }
      }

      if (indeedSearchLimit <= allPaginationBtn?.length) {
        indeedSearchLimit += 1;
      }

      // clicking the pagination btn
      await page?.click(
        `#jobsearch-JapanPage > div > div.css-hyhnne.e37uo190 > div > div.css-pprl14.eu4oa1w0 > nav > ul > li:nth-child(${i}) > a`
      );
    }

    return {
      lastRecordStatus: isMoreDataAvailable,
      indeedJobData: Object.values(allScrapedIndeedJobs),
    };
  } catch (error: any) {
    console.log("Indeed - Search Job - Faced an error", error);
  }
}
