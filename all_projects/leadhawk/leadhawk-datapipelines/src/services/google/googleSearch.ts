import { Logger } from "winston";
import { launchBrowser, sleep } from "../../helper/launch.puppeteer.js";
import { CodeFlowType } from "../../enums/codeFlowType.js";
import { IGoogleSearch } from "../../interface/googleSearch.interface.js";
import { config } from "../../config/config.js";
import natural from "natural";
import { Browser, Page } from "puppeteer";
import { sanitizeString } from "../../helper/getUTF8Data.js";

export async function googleSearch(
  logger: Logger,
  scrapedCompanyList: IGoogleSearch[]
) {
  let proxyBrowser: Browser | null = null;
  try {
    const output: IGoogleSearch[] = [];
    proxyBrowser = await launchBrowser(logger, CodeFlowType.INDEED);

    if (!config.oxyLab.username || !config.oxyLab.password) {
      throw new Error("Oxy lab credentials incorrect");
    }

    for (const company of scrapedCompanyList) {
      const { companyName } = company;
      if (!companyName) {
        output.push(company);
        continue;
      }

      let companyExpectedData: null | {
        linkedInUrl: string;
        scrapeCompanyName: string;
      } = null;
      let maxConfidence = Number.MIN_SAFE_INTEGER;

      let page: Page | null = null;
      try {
        page = await proxyBrowser.newPage();
        //----------------------------------------------------------------------
        // ************* Setting up the page *****************
        //----------------------------------------------------------------------
        await page.setBypassCSP(true);
        await page.setUserAgent(config.puppeteer.userAgent);

        await page.authenticate({
          username: config.oxyLab.username,
          password: config.oxyLab.password,
        });
        //----------------------------------------------------------------------
        // ************* Setting up the page Ends *****************
        //----------------------------------------------------------------------

        await page.goto(config.googleSearch.url, {
          waitUntil: "domcontentloaded",
        });
        await page.waitForNetworkIdle({ idleTime: 5000 });
        await page.waitForSelector('textarea[aria-label="Search"]', {
          visible: true,
        });

        const inputPlace = await page.$('textarea[aria-label="Search"]');
        if (inputPlace) {
          await inputPlace.click({ clickCount: 3 });
          await inputPlace.type(String.fromCharCode(8));
          await inputPlace.type(`site:linkedin.com ${companyName}`);
        }
        await Promise.all([
          page.waitForNavigation({ waitUntil: "domcontentloaded" }),
          page.keyboard.press("Enter"),
        ]);
        await page.waitForSelector(".LC20lb", { visible: true });

        const scrapResult = await page.evaluate(() => {
          const list = document.querySelectorAll(
            "#center_col #search #rso> div"
          );
          const listArr = Array.from(list);

          const result: {
            linkedInUrl: string;
            scrapeCompanyName: string;
          }[] = [];

          for (const record of listArr) {
            const tag = record.querySelector("a");
            const linkedInUrl = tag?.getAttribute("href") || null;
            const scrapeCompanyName =
              tag?.querySelector("h3")?.innerText || null;
            console.log(scrapeCompanyName, linkedInUrl);

            if (!scrapeCompanyName || !linkedInUrl) {
              continue;
            }

            result.push({
              scrapeCompanyName,
              linkedInUrl,
            });
          }
          return result;
        });

        const scrapResultArr = Array.from(scrapResult).map(({ linkedInUrl, scrapeCompanyName  }) => ({
          linkedInUrl,
          scrapeCompanyName: sanitizeString(scrapeCompanyName)
        }));

        const scrapResultFilteredArr = scrapResultArr.filter(
          ({ linkedInUrl }) =>
            linkedInUrl.includes("/school/") ||
            linkedInUrl.includes("/company/")
        );

        for (const {
          scrapeCompanyName,
          linkedInUrl,
        } of scrapResultFilteredArr) {
          const confidence = natural.JaroWinklerDistance(
            scrapeCompanyName,
            companyName,
            { ignoreCase: true }
          );

          if (confidence > maxConfidence) {
            maxConfidence = confidence;
            companyExpectedData = { scrapeCompanyName, linkedInUrl };
          }
        }

        if (maxConfidence >= config.googleSearch.confidenceLimitMin) {
          output.push({ ...company, ...companyExpectedData });
        } else {
          output.push(company);
        }
      } catch (e) {
        logger.info(`Company name not found on Google search - ${companyName}`);
      } finally {
        if (page) {
          await page.close();
        }
      }
    }

    return {
      success: output.filter((d) => !!d.scrapeCompanyName),
      failed: output.filter((d) => !d.scrapeCompanyName),
    };
  } catch (e) {
    logger.error(" RE-PROCESS ERROR:: google search ", e);
    return {
      success: [],
      failed: [],
    };
  } finally {
    if (proxyBrowser) {
      await proxyBrowser.close();
    }
  }
}
