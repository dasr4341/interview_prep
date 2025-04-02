import axios from "axios";
import { CodeFlowType } from "../../../enums/codeFlowType.js";
import { IBusinessAndPRNews } from "../../../interface/businessAndprNews.interface.js";
import { NewsItem, NewsItemXML } from "../../../interface/newsxml.interface.js";
import xml2js from "xml2js-cdata";
import type { Logger } from "winston";
import getCompanyName from "../comprehend.js";
import { BusinessNewsEnum } from "../../../enums/businessNews.enum.js";
import { businessNewsModel } from "../../../models/businessNewsModel.js";
import { businessNewsWireCategories } from "../../../config/constants/businessNewsCategories.js";
import { differenceInCalendarDays } from "date-fns";
import { getCompanyNameOpenAi } from "../getCompanyNameOpenAi.js";
import iconv from "iconv-lite";
import { sanitizeObj, sanitizeString } from "../../../helper/getUTF8Data.js";

interface IBusinessNewsWireCategories {
  triggerArticle: string;
  trigger: string;
}

async function extractBusinessWireDataHelper(
  feedUrl: string,
  logger: Logger,
  trigger: string
) {
  const xmldata$ = await axios({
    method: "GET",
    url: feedUrl,
    responseType: "arraybuffer",
    responseEncoding: "binary",
  });
  const xmldata = iconv.decode(Buffer.from(await xmldata$.data), "utf-8");
  // const xmldata = await xmldata$.data;

  const parser = new xml2js.Parser();
  const xmlContent = (await parser.parseStringPromise(xmldata)) as NewsItemXML;

  const newsItems = xmlContent.rss.channel[0].item;

  if (!newsItems) {
    return [];
  }

  logger.info(`Recieved ${newsItems.length} news item`);

  const englishNewsItem = newsItems.filter((item) => {
    const publishedDate = new Date(item.pubDate[0]);
    const isNewsPublishedToday = differenceInCalendarDays(
      new Date(),
      publishedDate
    );

    if (item.link[0].includes("/en/") && isNewsPublishedToday === 0) {
      return sanitizeObj(JSON.stringify(item));
    }
  });

  const links: string[] = englishNewsItem.map((item) => item.link[0]);
  const existingDocs = await businessNewsModel.find({
    triggerArticle: { $in: links },
  });

  const existingDocsLinks = existingDocs.map((item) => item.triggerArticle);

  const updatedNewsItem = englishNewsItem.filter(
    (item) => !existingDocsLinks.includes(item.link[0])
  );

  if (englishNewsItem.length !== updatedNewsItem.length) {
    logger.info(
      `Filtered already added items. Adding ${updatedNewsItem.length} of ${englishNewsItem.length} items for feedURL: ${feedUrl}`
    );
  }

  const scrapedData$: Array<
    Promise<NewsItem & { companyName: string | null }>
  > = updatedNewsItem
    .filter((item) => {
      if (feedUrl.includes(BusinessNewsEnum.BUSINESS_WIRE)) {
        if (item.link.length > 1) {
          logger.info(
            `${BusinessNewsEnum.BUSINESS_WIRE} :: ${item.link.length}`
          );
        }
        return item.link[0].includes("/en/");
      }
    })
    .map(async (data) => {
      const text = `${data.title}. ${data.description}`;
      const companyName = await getCompanyNameOpenAi(text, logger);
      return { companyName, ...data };
    });

  const scrapedData = await Promise.all(scrapedData$);

  return Object.values(
    scrapedData.reduce(
      (
        prevData: Record<string, IBusinessAndPRNews>,
        { companyName, ...item }
      ) => {
        const key = item.title[0];
        if (key && !prevData[key] && companyName) {
          prevData[key] = {
            trigger,
            publishedDate: new Date(item.pubDate[0]),
            triggerArticle: item.link[0].split("?")[0] || item.link[0],
            companyName: sanitizeString(companyName),
            source: CodeFlowType.BUSINESS_NEWS,
            [BusinessNewsEnum.BUSINESS_WIRE]: item as NewsItem,
          };
        }
        return prevData;
      },
      {}
    )
  );
}

export async function extractBusinessWireData(logger: Logger) {
  try {
    const result: IBusinessAndPRNews[] = [];
    const categoriesArr = Object.entries(businessNewsWireCategories);

    // Here we are just arranging the object
    const formattedCategoriesArr: IBusinessNewsWireCategories[] =
      categoriesArr.reduce(
        (
          previousValue: IBusinessNewsWireCategories[],
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

    for (const { trigger, triggerArticle } of formattedCategoriesArr) {
      const data = await extractBusinessWireDataHelper(
        triggerArticle,
        logger,
        trigger
      );
      if (data) {
        result.push(...data);
      }
    }
    return result;
  } catch (error) {
    logger.error("Business News Wire Error ::", error);
    throw error;
  }
}
