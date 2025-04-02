import axios from "axios";
import type { Browser } from "puppeteer";
import xml2js from "xml2js-cdata";
import { CodeFlowType } from "./enums/codeFlowType.js";
import type {
  FundingNewsItem,
  NewsItemXML,
} from "./interface/newsxml.interface.js";
import { googleHandler } from "./services/google/googleHandler.js";
import { saveDataHandler } from "./services/saveDb/saveData.js";
import { linkedInHandler } from "./services/linkedIn/linkedInHandler.js";
import { googleFundingLogger as logger } from "./helper/createLogger.js";
import type { Logger } from "winston";
import type { IFormDs } from "./interface/formDs.interface.js";
import { is7DaysOld } from "./helper/check7DaysOld.js";
import { FundingDataModel } from "./models/fundingDataModel.js";
import { config } from "./config/config.js";
import type { IScrapedCompanyData } from "./interface/linkedIn.interface.js";
import { extractFundingInfo } from "./services/funding/googleNews/extractFundingInfo.js";

function fixSearchText(newsItem: FundingNewsItem) {
  return `${newsItem.title}`
    .replace(newsItem.source[0]._, "")
    .replaceAll(" - ", "")
    .trim();
}

async function extractNews(
  feedUrl: string,
  logger: Logger
): Promise<IFormDs[]> {
  try {
    const xmldata$ = await axios({ method: "GET", url: feedUrl });
    // const xmldata = iconv.decode(Buffer.from(await xmldata$.data), "utf-8");
    const xmldata = await xmldata$.data;

    // const xmldata = await xmldata$.data;
    const news: IFormDs[] = [];

    const parser = new xml2js.Parser();
    const xmlContent = (await parser.parseStringPromise(
      xmldata
    )) as NewsItemXML<FundingNewsItem>;

    const newsItems = xmlContent.rss.channel[0].item;

    if (!newsItems) {
      return [];
    }

    logger.info(`Recieved ${newsItems.length} news item`, {
      feedUrl,
      lastUpdated: xmlContent.rss.channel[0].pubDate,
    });

    const links = newsItems.map((item) => item.link[0]);

    const existingDocs = await FundingDataModel.find({
      sourceLink: { $in: links },
    });

    const existingDocsLinks = existingDocs.map((item) => item.sourceLink);

    const filteredNewsItem = newsItems.filter(
      (item) => !existingDocsLinks.includes(item.link[0])
    );

    if (filteredNewsItem.length !== newsItems.length) {
      logger.info(
        `Filtered already added items. Adding ${filteredNewsItem.length} of ${newsItems.length} items for feedURL: ${feedUrl}`
      );
    }

    const chatGpt$: Array<Promise<IFormDs | null>> = filteredNewsItem.map(
      (data) => {
        // biome-ignore lint/suspicious/noAsyncPromiseExecutor: <explanation>
        return new Promise(async (resolve) => {
          const details = await extractFundingInfo(fixSearchText(data), logger);
          if (!details) {
            resolve(null);
            return;
          }

          // News URL changes sometimes. Hence, checking against saved data
          const googleDuplicateCheck = await FundingDataModel.findOne({
            $or: [
              {
                companyName: new RegExp(details.companyName || "", "i"),
              },
              {
                formDsCompany: new RegExp(details.companyName || "", "i"),
              },
            ],
            fundingRaised: details.fundingRaised,
          }).lean();
          if (googleDuplicateCheck) {
            logger.info("Google News Data already exists", {
              googleDuplicateCheck,
              rssData: data,
              details,
            });
            resolve(null);
            return;
          }

          resolve({
            source: CodeFlowType.GOOGLE_FUNDING,
            investmentType: "",
            issuerLink: data.link[0],
            ...details,
            fundingRaised: details.fundingRaised || null,
          });
        });
      }
    );

    const chatGpt = await Promise.allSettled(chatGpt$);
    chatGpt.forEach((response) => {
      if (response.status === "fulfilled" && response.value?.companyName) {
        news.push(response.value);
      }
    });

    logger.info("CHATGPT all non-null responses", { news });

    return news;
  } catch (e) {
    console.log(e);
    return [];
  }
}

export default async (browser: Browser) => {
  try {
    const newNewsData: IFormDs[] = [];
    const currentData: IScrapedCompanyData[] = [];
    const news = await extractNews(config.googleNews.url, logger);
    if (!news?.length) {
      throw new Error("No new Data found!");
    }

    const dataStatus = await is7DaysOld(news, logger);
    for (const data of dataStatus) {
      const formDsData = data.searchData as IFormDs;
      if ((data.status && formDsData) || !data.linkedIn) {
        newNewsData.push(formDsData);
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

    // ----Calling google handler for getting linkedIn url -----
    const {
      success: googleSearchSuccessResult,
      failed: failedGoogleSearchResult,
    } = await googleHandler(newNewsData, logger);

    logger.info(
      `Got Google Search Result ${{
        success: googleSearchSuccessResult?.length,
        failed: failedGoogleSearchResult.length,
      }} `
    );

    if (!!failedGoogleSearchResult?.length) {
      const companyNameNotFoundData = failedGoogleSearchResult.map((e) => {
        return {
          other: {
            ...e,
            source: CodeFlowType.GOOGLE_FUNDING,
            scrapeCompanyName: e.companyName,
          },
          linkedData: null,
        };
      });
      await saveDataHandler(companyNameNotFoundData, logger);
    }

    if (!googleSearchSuccessResult?.length) {
      throw new Error("Google search result empty !");
    }

    // ----Calling linkedIn handler for company data scrape-----
    const linkedInData = await linkedInHandler(
      browser,
      googleSearchSuccessResult,
      logger
    );

    if (currentData.length) {
      logger.info({ currentData: currentData.length });
      await saveDataHandler(currentData, logger);
    }
    if (linkedInData?.length) {
      await saveDataHandler(linkedInData, logger);
    }
  } catch (error) {
    console.log("handler: error", error);
  }
};
