import type { Browser, Page } from "puppeteer";
import { linkedInSelectors } from "../../config/constants/linkedInCompany.js";
import type { IGoogleSearch } from "../../interface/googleSearch.interface.js";
import type {
  ILinkedInData,
  IScrapedCompanyData,
} from "../../interface/linkedIn.interface.js";
import { getCountry } from "../../helper/getCountry.js";
import { interceptLinkedInCompanyReq } from "./helper/blockOrgRequest.js";
import { getCompanyWebsite } from "./helper/getCompanyWebsite.js";
import type { Logger } from "winston";
import { saveLinkedInData } from "../saveDb/saveData.js";
import { config } from "../../config/config.js";
import { sanitizeObj } from "../../helper/getUTF8Data.js";

const detailsList = [
  { industry: "industry" },
  { companySize: "companySize" },
  { specialties: "specialties" },
  { website: "companyWebsite" },
  { headquarters: "companyHQ" },
];

export const getLinkedInData = async (
  linkedInPage: Page,
  data: IGoogleSearch,
  logger: Logger
) => {
  try {
    const linkedInCompanyUrl = `${data?.linkedInUrl?.replace(
      ".com/",
      ".com/organization-guest/"
    )}`;

    logger.info(
      `---------- linkedin company scrap start for :: ${linkedInCompanyUrl} ----------`
    );
    await linkedInPage.setRequestInterception(true);
    linkedInPage.on("request", (request) =>
      interceptLinkedInCompanyReq(request, logger)
    );

    await linkedInPage.goto(linkedInCompanyUrl, {
      waitUntil: "domcontentloaded",
    });
    await linkedInPage.waitForSelector(".main", {
      visible: true,
    });

    //  ----------------------------- we are scraping data here -----------------------------
    const { scrapedCompanyData, companyName, employeeCount } =
      await linkedInPage.evaluate(
        ({ companyNameSelector, employeeCountSelector }) => {
          const table = document.querySelectorAll(
            "#main-content > section> div > section > div > dl > div"
          );
          const companyInfo: { [key: string]: string | null } = {};

          if (table) {
            const list = Array.from(table);
            for (const record of list) {
              const key = record.querySelector("dt")?.innerText || null;
              if (!key) {
                continue;
              }
              const value = record.querySelector("dd")?.innerText || null;
              companyInfo[
                key.trim().toLowerCase().replaceAll(" ", "").replaceAll("'", "")
              ] = value;
            }
          }

          // ----------------------------------------------------
          // **** Here we are scraping company name && emp count ****
          // ----------------------------------------------------
          let employeeCount: null | number = null;
          const empCountInfoElement = document.querySelectorAll(
            employeeCountSelector
          );
          const empCountInfoArr = Array.from(empCountInfoElement);

          for (const countInfo of empCountInfoArr) {
            // we are extracting Employee count from a text
            const count = Number(
              (countInfo as HTMLElement).innerText?.replace(/[^\d]/g, "")
            );
            if (count) {
              employeeCount = count;
            }
          }
          const companyName = (
            document.querySelector(companyNameSelector) as HTMLElement
          )?.innerText;
          // ----------------------------------------------------
          // **** Here we are scraping company name && emp count ****
          // ----------------------------------------------------

          return {
            scrapedCompanyData: companyInfo,
            companyName,
            employeeCount,
          };
        },
        linkedInSelectors
      );
    const companyDetails = Object.entries(scrapedCompanyData).reduce(
      (previousValue: { [key: string]: string | null }, entries) => {
        const [key, value] = entries;
        const output = {
          ...previousValue,
        };
        const result = detailsList.find((item) => {
          const [linkedInKey] = Object.entries(item)[0];
          if (linkedInKey.toLowerCase() === key) {
            return item;
          }
        });

        if (result) {
          const [linkedInKey, localKey] = Object.entries(result)[0];
          output[localKey] = value;
        }
        return output;
      },
      {}
    );
    //  ----------------------------- we are scraping data here ENDs -----------------------------

    const {
      industry = null,
      companyWebsite = null,
      companySize = null,
      companyHQ = null,
      specialties = null,
    } = companyDetails;

    const {
      linkedInUrl,
      companyName: scrapeCompanyName,
      ...requiredScrapedData
    } = data;

    const companyLocationInfo = await getCountry(companyHQ, logger);

    // ---------------------------------------------
    // extracting emp count from company size
    // ---------------------------------------------
    const companySizeNumbers = companySize?.match(/\d+/g); // Extracts all numbers from the string
    const employeeCountFromCompanySize = companySizeNumbers?.length
      ? Number(companySizeNumbers[companySizeNumbers.length - 1])
      : null;
    // ---------------------------------------------
    // extracting emp count from company size
    // ---------------------------------------------

    const linkedInCompanyData: ILinkedInData = {
      companyName: companyName || scrapeCompanyName,
      companyLinkedIn: linkedInUrl,
      companySize,
      scrappedCompanyHQ: companyHQ || null,
      companyHQ: companyLocationInfo?.state || null,
      companyCity: companyLocationInfo?.city || null,
      country: companyLocationInfo?.country || null,
      specialties,
      industry,
      companyWebsite: getCompanyWebsite(companyWebsite),
      companyEmployeeCount: employeeCount || employeeCountFromCompanySize,
    };

    await saveLinkedInData(
      {
        ...sanitizeObj(JSON.stringify({ linkedData: linkedInCompanyData })),
        other: data,
      },
      logger
    );

    if (
      companyHQ &&
      companyLocationInfo?.country !== config.defaultLocation.code
    ) {
      logger.info("- country not related to US returning ...");
      return null;
    }

    return {
      other: { ...requiredScrapedData, scrapeCompanyName },
      linkedData: linkedInCompanyData,
    };
  } catch (error) {
    logger.info(`----- linkedIn scraping ERR: ----- ${error}`);
    return null;
  }
};

export const linkedInHandler = async (
  browser: Browser,
  data: IGoogleSearch[],
  logger: Logger
) => {
  const linkedinLogger = logger.child({ subservice: "LinkedInCompanySearch" });
  const linkedInData: IScrapedCompanyData[] = [];
  linkedinLogger.info(" -------- LINKEDIN FLOW INVOKED --------");

  try {
    if (!data?.length) {
      linkedinLogger.info(
        ` - ${
          !data ? "Invalid data !" : "No data found (array empty) !"
        } :: control returned `
      );
      return linkedInData;
    }

    for await (const record of data) {
      logger.info("Record ::", { record });
      if (!record.linkedInUrl) {
        logger.warn(
          `LinkedIn URL not found. Returning default data for ${record.companyName}`,
          record
        );
        linkedInData.push({
          other: record,
          linkedData: null,
        });
        continue;
      }
      const page = await browser.newPage();
      await page.setBypassCSP(true);
      await page.setUserAgent(config.puppeteer.userAgent);

      const result: IScrapedCompanyData | null = await getLinkedInData(
        page,
        record,
        logger
      );
      linkedinLogger.info(
        ` - linkedIn company scrap  result :: ${JSON.stringify(result)}`
      );
      if (result) {
        linkedinLogger.info(" - data pushed ");
        linkedInData.push(result);
      }
      await page.close();
    }

    linkedinLogger.info(
      `linkedIn company scrape final output ${linkedInData.length}`
    );

    if (linkedInData?.length) {
      return linkedInData;
    }

    return []; // This is for fail-safe conditions.
  } catch (error) {
    linkedinLogger.info("handler: error", error);
  }
};
