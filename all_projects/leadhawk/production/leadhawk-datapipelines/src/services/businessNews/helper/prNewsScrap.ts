import type { Browser, Page } from "puppeteer";
import { sleep } from "../../../helper/launch.puppeteer.js";
import { prNewsCategories } from "../../../config/constants/businessNewsCategories.js";
import { interceptNewsRequest } from "./blockRequestNews.js";
import type { Logger } from "winston";
import type { IScrapPrNews } from "../../../interface/businessAndprNews.interface.js";
import { getUTF8Data } from "../../../helper/encodeUTF-8String.js";

export async function scrapPrNews(browser: Browser, logger: Logger) {
  try {
    const prNewsProfilesArr = Object.entries(prNewsCategories);

    const formattedTriggersInfo = prNewsProfilesArr.reduce(
      (
        previousValue: { triggerArticle: string; trigger: string }[],
        [trigger, articleList]
      ) => {
        const articleListFormatted = articleList.map((link) => ({
          triggerArticle: link,
          trigger,
        }));
        previousValue.push(...articleListFormatted);
        return previousValue;
      },
      []
    );
    const scrapedData$ = [];

    for (const { triggerArticle, trigger } of formattedTriggersInfo) {
      let page: null | Page = null;
      try {
        page = await browser.newPage();
        await page.setRequestInterception(true);
        page.on("request", interceptNewsRequest);

        const link = `${triggerArticle}?page=1&pagesize=100`;
        logger.info(`scraping for :: ${link}`);

        await page.goto(link);
        await page.waitForSelector(".card-list .row");
        await sleep();

        // 3. scrap
        const prNewsScrapedData = await page.evaluate(() => {
          const nodeList = document.querySelectorAll(".card-list .row");
          const output: IScrapPrNews[] = [];
          if (!nodeList) {
            return null;
          }

          const list = Array.from(nodeList);
          for (const row of list) {
            const title = row.querySelector("h3")?.innerText || null;
            const link = row.querySelector("a")?.getAttribute("href") || null;

            const dateElement = row.querySelector("small")?.innerText;
            const dateString =
              dateElement?.substring(0, dateElement?.lastIndexOf(",")) || null;

            const description = row.querySelector("p")?.innerText || null;

            if (!dateString) {
              output.push({
                title: title || "N/A",
                pubDate: dateElement || "N/A",
                description: description || "N/A",
                link:
                  (link?.startsWith("http")
                    ? ""
                    : "https://www.prnewswire.com") + link,
              });
            }
          }
          return output;
        });
        if (prNewsScrapedData) {
          logger.log("scraping data for :: ", prNewsScrapedData);
          scrapedData$.push(
            prNewsScrapedData?.map((data) => ({
              trigger,
              ...JSON.parse(getUTF8Data(JSON.stringify(data))),
            }))
          );
        } else {
          logger.info("scraping data for :: Not found");
        }
      } catch (e: any) {
        logger.info(`Pr news scrapping error: ${e?.message}`);
      } finally {
        if (page) {
          await page.close();
        }
      }
    }

    const scrapedData = await Promise.all(scrapedData$);
    return scrapedData;
  } catch (error) {
    logger.error("Error - PR news scrape ::", { error });
    throw error;
  }
}
