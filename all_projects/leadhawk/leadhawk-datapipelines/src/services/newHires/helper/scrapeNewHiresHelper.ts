import type { Page } from "puppeteer";
import { config } from "../../../config/config.js";
import type { INewHiresScrapedData } from "../../../interface/newHires.interface.js";
import { newHiresLogger as logger } from "../../../helper/createLogger.js";
import { scrollPageToBottom } from "puppeteer-autoscroll-down";
import { CodeFlowType } from "../../../enums/codeFlowType.js";
import { sleep } from "../../../helper/launch.puppeteer.js";
import { sanitizeObj } from "../../../helper/getUTF8Data.js";

export const scrapeNewHiresHelper = async (jobTitle: string, page: Page) => {
  try {
    const newHiresData: INewHiresScrapedData[] = [];
    const searchString = `starting a new position as ${JSON.stringify(
      jobTitle
    )}`;
    await page.goto(config.linkedIn.userPostBaseUrl, {
      waitUntil: "domcontentloaded",
    });
    const inputBox = await page.evaluate(() => {
      return !!document.querySelector(
        "div>input.search-global-typeahead__input"
      );
    });
    if (!inputBox) {
      return newHiresData;
    }

    await page.type("div>input.search-global-typeahead__input", searchString);
    await page.keyboard.press("Enter");
    await page.waitForNavigation({ waitUntil: "domcontentloaded" });

    const isPageContent = await page.evaluate(() => {
      return !!document.querySelector("main.scaffold-layout__main");
    });

    if (!isPageContent) {
      logger.error("No more post found!");
      return newHiresData;
    }

    for (let i = 1; i <= config.linkedIn.userJobPostPageLength; i++) {
      await scrollPageToBottom(page, {
        size: 500,
        delay: 250,
      });
      console.log(`loop ${i} of ${config.linkedIn.userJobPostPageLength} `);

      // ------------------------------------------
      // Clicking :: show more btn
      // ------------------------------------------
      const scrollMoreBtnSelector =
        "button.scaffold-finite-scroll__load-button";
      const buttonExists = (await page.$(scrollMoreBtnSelector)) !== null;

      if (buttonExists) {
        logger.info(`More scroll :: ${!!buttonExists}`);
        await page.evaluate((selector) => {
          (document.querySelector(selector) as HTMLElement)?.click();
        }, scrollMoreBtnSelector);
        logger.info("Clicked!");
      }
      // ------------------------------------------
      // Clicking :: show more btn
      // ------------------------------------------
    }
    await sleep();

    const scrapedData = await page.evaluate(
      (CodeFlowType, jobTitle) => {
        const arr = Array.from(
          document.querySelectorAll(
            ".scaffold-finite-scroll__content>div .artdeco-card"
          )
        );
        if (!arr.length) return [];
        const scrapedData: INewHiresScrapedData[] = [];
        for (const e of arr) {
          // --------------------------------------------------------------------
          // --------------------------------------------------------------------
          // getting the time element, looks like -> '1w • \n '
          const timeEle = (
            e.querySelector(
              "span.update-components-actor__sub-description>span"
            ) as HTMLElement
          )?.innerText;

          // splitting the element
          const timeEleArr = timeEle?.split(" ");

          // getting the first element -> 1w
          const timeOfPost = timeEleArr?.length
            ? timeEleArr[0].toLowerCase()
            : null;

          // checking the time (1w) exist between -> [h, m, d]
          if (
            !(
              timeOfPost &&
              !timeOfPost?.includes("o") &&
              (timeOfPost?.includes("h") ||
                timeOfPost?.includes("m") ||
                timeOfPost?.includes("d"))
            )
          ) {
            continue;
          }
          // --------------------------------------------------------------------
          // --------------------------------------------------------------------

          const name = (
            e.querySelector(
              "span.update-components-actor__name>span>span"
            ) as HTMLElement
          )?.innerText;
          const about = (
            e.querySelector(
              "span.update-components-actor__description>span"
            ) as HTMLElement
          )?.innerText;
          const userProfileUrl = (
            e.querySelector(
              "div.update-components-actor__container > a"
            ) as HTMLElement
          )?.getAttribute("href");
          const description = (
            e.querySelector(
              "div#fie-impression-container>div.feed-shared-update-v2__description-wrapper"
            ) as HTMLElement
          )?.innerText;
          const descriptionLinksHtml = e.querySelectorAll(
            "div#fie-impression-container>div.feed-shared-update-v2__description-wrapper a"
          );
          const companyLinks = Array.from(descriptionLinksHtml).map(
            (link) => (link as HTMLAnchorElement).href
          );

          scrapedData.push({
            source: CodeFlowType.NEW_HIRES,
            searchJobTitle: jobTitle,
            name: name,
            userProfileUrl,
            about: about,
            description: description,
            companyLinks,
          });
        }
        return scrapedData;
      },
      CodeFlowType,
      jobTitle
    );

    return sanitizeObj(JSON.stringify(scrapedData));
  } catch (error) {
    logger.error("Page not loaded or no more page found! :: ", { error });
  }
};
