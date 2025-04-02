import { chromium, Page } from "playwright";
import { config } from "../config/config.js";
import { formDsDataModel } from "../schema/formDsModel.js";

export class FundingController {
  getFormDsData = async () => {
    try {
      const numberOfRecord = 100;

      const browser = await chromium.launch({
        headless: true,
      });
      const formDsPage = await browser.newPage({ bypassCSP: true });
      await formDsPage.goto(config.formDsBaseUrl);

      await formDsPage.waitForSelector("table");

      const filings: {
        companyName: string | undefined;
        investmentType: string | undefined;
        issuerLink: string | null | undefined;
        fundingRaised?: string;
      }[] = [];

      for (let i = 0; i <= numberOfRecord / 30; i++) {
        for (let j = 1; j <= 30; j++) {
          const record = await formDsPage.$(
            `table > tbody > tr:nth-child(${j})`
          );
          const companyName = await (await record?.$("td a"))?.innerText();
          const investmentType = await (
            await record?.$("td span")
          )?.innerText();
          const issuerLink = await (
            await record?.$("td a")
          )?.getAttribute("href");

          filings.push({ companyName, investmentType, issuerLink });
        }
        await formDsPage?.click("div > a.next_page");
        console.log("first");
      }

      await formDsPage.$(`table > tbody > tr:nth-child(${1})`);

      await formDsPage.close();

      for (let formDsData of filings) {
        if (formDsData.issuerLink) {
          console.log(
            "issuerLink:: ",
            `https://formds.com${formDsData.issuerLink}`
          );
          const formDsIssuerPage = await browser.newPage({ bypassCSP: true });
          await formDsIssuerPage.goto(
            `https://formds.com${formDsData.issuerLink}`
          );
          await formDsIssuerPage.waitForSelector("div.adaptive-well > table");

          const issuerData = await formDsIssuerPage.evaluate(() => {
            const fundingRaised = document.querySelector(
              "div.adaptive-well > table > tbody > tr:nth-child(1) > td:nth-child(3) > strong"
            )?.innerHTML;

            return { fundingRaised };
          });
          console.log({ issuerData });
          
          formDsData["fundingRaised"] = issuerData.fundingRaised;
          if (!formDsData.investmentType?.includes("Pooled"))
            await formDsDataModel.findOneAndUpdate(
              { company: formDsData.companyName },
              {
                company: formDsData.companyName,
                inverstmentType: formDsData.investmentType,
                fillingsRecordUrl: formDsData.issuerLink,
                fundingRaised: issuerData.fundingRaised,
              },
              { upsert: true }
            );
        }
      }

      console.log('filings Data : ', filings);
      

      // res.send({ filings });
    } catch (error) {
      console.log(`Form Ds robot ERR:  - ${error}`);
    }
  };
}
