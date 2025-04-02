import type { Browser, Page } from "puppeteer";
import { CodeFlowType } from "./enums/codeFlowType.js";
import { is7DaysOld } from "./helper/check7DaysOld.js";
import type { ILinkedInJobPostData } from "./interface/linkedInJob.interface.js";
import { JobPostDataModel } from "./models/jobPostDataModel.js";
import { saveDataHandler } from "./services/saveDb/saveData.js";
import { linkedInJobLogger as logger } from "./helper/createLogger.js";
import { linkedInHandler } from "./services/linkedIn/linkedInHandler.js";
import type { IGoogleSearch } from "./interface/googleSearch.interface.js";
import { scrapLinkedInJobs } from "./services/linkedInJobs/scrapLinkedInJobs.js";
import type { IScrapedCompanyData } from "./interface/linkedIn.interface.js";

//------------------------- README ---------------------------------------------
// ******** This file act as a controller ********
// 1. gets scraped data from scrapLinkedInJobs()
// 2. gets company data from linkedInHandler()
// 4. then saves the data
//----------------------------------------------------------------------

const getNewJobPost = async (jobs: ILinkedInJobPostData[]) => {
  const searchCondition = jobs.map((job) => {
    return { companyName: job.companyName, rawJobTitle: job.rawJobTitle };
  });
  const existingJobPost: {
    _id: null;
    searchData: { companyName: string; rawJobTitle: string }[];
  }[] = await JobPostDataModel.aggregate([
    { $match: { $or: searchCondition } },
    {
      $group: {
        _id: null,
        searchData: {
          $push: {
            companyName: "$companyName",
            rawJobTitle: "$rawJobTitle",
          },
        },
      },
    },
  ]);

  if (!existingJobPost?.length) {
    return jobs;
  }

  const newJobPost = jobs.filter(
    (element) =>
      !existingJobPost[0].searchData.some(
        (job) =>
          job.companyName === element.companyName &&
          job.rawJobTitle === element.rawJobTitle
      )
  );

  logger.info(
    `No of scrape job post: ${jobs.length}, No of new job post: ${newJobPost.length}`
  );
  return newJobPost;
};

export default async (browser: Browser) => {
  try {
    const output: IGoogleSearch[] = [];
    const currentData: IScrapedCompanyData[] = [];
    const { success: scrapedJobsData, failed } = await scrapLinkedInJobs(
      browser
    );

    if (failed.length) {
      logger.error("Scrapping failed ::", failed.length);
      logger.error("Scrapping failed details ::", failed);
    }

    for (const job of scrapedJobsData) {
      const newJobs = await getNewJobPost(job);
      logger.info(`No of new job post :: ${newJobs.length}`);
      if (newJobs.length) {
        const dataStatus = await is7DaysOld(newJobs, logger);

        for (const data of dataStatus) {
          const jobDetails = data.searchData as ILinkedInJobPostData;
          logger.info(`LinkedIn job post 30 days status - ${data.status}`);

          if (data.status) {
            output.push({
              ...jobDetails,
              jobLink: String(jobDetails.jobLink),
              companyName: String(jobDetails.companyName),
              linkedInUrl: String(jobDetails.companyLinkedIn),
              scrapeCompanyName: jobDetails.companyName,
            });
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
      }
    }

    logger.info(`7 days old data length :: ${output.length}`);
    if (!output?.length) {
      throw new Error("No data found from  scraping !!");
    }

    const companyData = await linkedInHandler(browser, output, logger);
    if (!companyData?.length) {
      throw new Error(" - LinkedIn company handler cannot scrap data");
    }

    if (currentData.length) {
      logger.info({ currentData: currentData.length });
      await saveDataHandler(currentData, logger);
    }
    await saveDataHandler(companyData, logger);
  } catch (error) {
    logger.info(`LinkedIn job post ERR:  - ${error}`);
  }
};
