import { Browser } from "puppeteer";
import { scrapPrNews } from "./prNewsScrap.js";
import getCompanyName from "../comprehend.js";
import { BusinessNewsEnum } from "../../../enums/businessNews.enum.js";
import { CodeFlowType } from "../../../enums/codeFlowType.js";
import type { Logger } from "winston";
import { format, fromZonedTime } from "date-fns-tz";
import { IBusinessAndPRNews } from "../../../interface/businessAndprNews.interface.js";
import { getCompanyNameOpenAi } from "../getCompanyNameOpenAi.js";
import { getUTF8Data } from "../../../helper/encodeUTF-8String.js";

export async function extractPrNewsWireData(browser: Browser, logger: Logger) {
  const prNewsWireData$: { [key: string]: IBusinessAndPRNews } = {};
  const prNewsScrapedData = await scrapPrNews(browser, logger);
  if (!prNewsScrapedData) {
    throw new Error("Pr news no data found");
  }
  for (const scrapData of prNewsScrapedData.flat()) {
    const text = `${scrapData.title}. ${scrapData.description}`;
    const companyName: string | null = await getCompanyNameOpenAi(text, logger);
    const key = scrapData.title;

    if (key && !prNewsWireData$[key] && companyName) {
      const pubDateArr = scrapData.pubDate?.split(" ");
      const publishedTime = pubDateArr?.length ? pubDateArr[0] : "";

      const utcDate = fromZonedTime(new Date(), "America/New_York");
      const convertedPublishedDate = `${format(utcDate, "yyyy-MM-dd", {
        timeZone: "America/New_York",
      })} ${publishedTime}`;

      prNewsWireData$[key] = {
        [BusinessNewsEnum.PR_NEWS_WIRE]: {
          title: [scrapData.title] as [string],
          pubDate: [scrapData.pubDate] as [string],
          description: [getUTF8Data(scrapData.description)] as [string],
          link: [scrapData.link] as [string],
          guid: [scrapData.link] as [string],
        },
        publishedDate: new Date(convertedPublishedDate),
        companyName: getUTF8Data(companyName || ""),
        source: CodeFlowType.PR_NEWS,
        trigger: scrapData.trigger,
        triggerArticle: scrapData.link,
      };
    }
  }
  const prNewsData = await Promise.all(Object.values(prNewsWireData$));
  return prNewsData;
}
