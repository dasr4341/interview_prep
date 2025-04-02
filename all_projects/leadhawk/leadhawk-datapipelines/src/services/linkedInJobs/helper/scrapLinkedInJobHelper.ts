import type { Page } from "puppeteer";
import { config } from "../../../config/config.js";
import type {
  ILinkedInJobPostData,
  ILinkedInJobPostScrapedData,
} from "../../../interface/linkedInJob.interface.js";
import { linkedInJobLogger as logger } from "../../../helper/createLogger.js";
import { CodeFlowType } from "../../../enums/codeFlowType.js";
import JobTitleSingleton from "../../../helper/getJobTitles.js";
import { unlistedJobTitleModel } from "../../../models/unlistedJobTitleModel.js";
import { sanitizeObj } from "../../../helper/getUTF8Data.js";

const inputTitleSelector = "#job-search-bar-keywords";
const inputLocationSelector = "#job-search-bar-location";
const searchBtnSelector = "#jobs-search-panel .base-search-bar__submit-btn";
const country = config.defaultLocation.country;

async function getJobLink(page: Page) {
  // ----------------- README ----------------
  //  ********** We have a list **************
  //  - in that we want link of a specific span tag whose inner text is 'job'
  // ----------------- README ----------------
  return await page.evaluate(() => {
    let navLink = null;
    const nav = document.querySelectorAll(".top-nav-menu li");
    if (!nav) {
      return navLink;
    }

    const list = Array.from(nav);
    for (let i = 0; i < list.length; i++) {
      const element = list[i];
      const span = element.querySelector("span")?.innerText;
      if (span?.toLowerCase().includes("job")) {
        navLink = element.querySelector("a")?.getAttribute("href");
        break;
      }
    }

    return navLink;
  });
}

export const scrapLinkedInJobHelper = async (
  page: Page,
  searchJobTitle: string
) => {
  try {
    logger.silly(" - GoTo :: ", { link: config.linkedIn.url });
    await page.goto(config.linkedIn.url);

    // getting the job link
    const link = await getJobLink(page);
    if (!link) {
      throw new Error(" - linked job link not found !");
    }

    await page.goto(link, { waitUntil: "networkidle2" });
    logger.silly(" - Goto Job link ::", { link });
    await page.waitForSelector(inputTitleSelector);

    // ----------------------------------------
    // ****** searching the job ******
    // ----------------------------------------
    await page.type(inputTitleSelector, searchJobTitle.toLowerCase());
    logger.silly(" - Typing job title ...... ", { searchJobTitle });

    const inputLocation = await page.$(inputLocationSelector);

    if (!inputLocation) {
      throw new Error(
        "linkedIn job post input Location selector !! not found "
      );
    }
    logger.silly(" - Clearing job location ...... ", { country });
    await inputLocation?.click({ clickCount: 3 });
    await inputLocation?.type(String.fromCharCode(8));

    logger.silly(" - Typing job country ...... ", { country });
    await inputLocation?.type(country);
    await page.click(searchBtnSelector);
    // ----------------------------------------
    // ****** searching the job ******
    // ----------------------------------------

    // waiting for search result
    await page.waitForSelector("main#main-content");
    await page.waitForSelector(".jobs-search__results-list");
    logger.silly(" - Scraping started ---------------- ");

    // ----------------------------------------
    // ****** scraping the required data ******
    // ----------------------------------------
    const scrapedData = await page.evaluate(() => {
      const list = document.querySelectorAll(".jobs-search__results-list li");
      const output: ILinkedInJobPostScrapedData[] = [];

      if (!list) {
        throw new Error("job listing selector not found !");
      }

      const listArr = Array.from(list);
      // biome-ignore lint/complexity/noForEach: <explanation>
      listArr.forEach((element) => {
        const rawJobLink = element
          .querySelector(".base-card__full-link")
          ?.getAttribute("href");
        const jobLink = rawJobLink?.split("?")[0] || null;
        const jobTitle =
          (element.querySelector(".base-search-card__title") as HTMLElement)
            ?.innerText || null;
        const company = element.querySelector(
          ".base-search-card__subtitle a"
        ) as HTMLElement;
        const companyName = company?.innerText || null;
        const companyLinkedIn =
          company?.getAttribute("href")?.split("?")[0] || null;
        const jobLocation =
          (element.querySelector(".job-search-card__location") as HTMLElement)
            ?.innerText || null;

        output.push({
          jobLocation: jobLocation,
          companyLinkedIn,
          companyName: companyName,
          jobTitle: jobTitle,
          jobLink,
          rawJobTitle: jobTitle,
        });
      });

      return output;
    });
    // ----------------------------------------
    // ****** scraping the required data ******
    // ----------------------------------------

    // -------------------------------------------------------------------
    //  ***** comparing the scraped job title and search job title   *****
    //   - if they matches the we will take the data forward
    // -------------------------------------------------------------------

    const sanitizedScrapedData = sanitizeObj(JSON.stringify(scrapedData));

    const linkedInJobPost: ILinkedInJobPostData[] = [];
    for (const data of sanitizedScrapedData) {
      const { jobTitle, ...otherData } = data;
      const result = {
        ...otherData,
        source: CodeFlowType.LINKEDIN_JOB_POST,
      };
      const matchedTitle = JobTitleSingleton.mappedJobTitles.get(
        jobTitle?.trim() || ""
      );

      // mapping the job title
      if (matchedTitle && result.jobLink) {
        linkedInJobPost.push({
          ...result,
          jobTitle: matchedTitle,
        });
      } else {
        await unlistedJobTitleModel.findOneAndUpdate(
          { jobTitle: jobTitle },
          { jobTitle: jobTitle },
          { upsert: true }
        );
      }
    }
    const jobPostData = linkedInJobPost.filter((value) => !!value);

    // -------------------------------------------------------------------
    //  ***** comparing the scraped job title and search job title   *****
    //   - if they matches the we will take the data forward
    // -------------------------------------------------------------------
    return jobPostData;
  } catch (error) {
    logger.silly("Selector not found! ", error);
  }
};
