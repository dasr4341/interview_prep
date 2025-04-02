import { Page } from "puppeteer";
import {
  IFormDs,
  IFromDsLastRecordData,
} from "../../../../interface/formDs.interface.js";
import { config } from "../../../../config/config.js";
import { CodeFlowType } from "../../../../enums/codeFlowType.js";
import { sanitizeString } from "../../../../helper/getUTF8Data.js";

export const getPageData = async (
  pageInit: number,
  maxRecord: number,
  formDsPage: Page,
  lastRecordState: IFromDsLastRecordData
) => {
  const output: IFormDs[] = [];
  let noOfPage = pageInit;

  for (let i = 1; i <= noOfPage && i <= maxRecord; i++) {
    await formDsPage?.goto(config.formDs.getFromDsNthPage(i));
    await formDsPage.waitForSelector("table");

    // iterate inside a page
    for (let j = 1; j <= Number(config.formDs.singlePageLength); j++) {
      // -------------------------------
      // here we data is extracted from html
      const record = await formDsPage.$(`table > tbody > tr:nth-child(${j})`);
      const companyName = await (
        await record?.$("td a")
      )?.evaluate((el) => el.innerText);

      const investmentTypeRaw = await (
        await record?.$("td")
      )?.evaluate((el) => el.innerText.match(/\(([^()]*)\)$/));
      const investmentType = investmentTypeRaw?.[1];

      console.log({ investmentType });

      const issuerLink = await (
        await record?.$("td a")
      )?.evaluate((el) => el.href);

      const fundingRaised = await (
        await record?.$("td:nth-child(3)")
      )?.evaluate((el) => el.innerText);
      const fundingRaisedNumber = fundingRaised
        ? Number(fundingRaised?.replace(/[^\d.-]+/g, ""))
        : null;
      // ------------- html data extracting ends ------------------

      const data = {
        source: CodeFlowType.FORMDS,
        companyName: companyName ? sanitizeString(companyName) : null,
        investmentType: investmentType ? sanitizeString(investmentType) : null,
        issuerLink: issuerLink || null,
        fundingRaised: fundingRaisedNumber,
      };

      if (
        !lastRecordState.status &&
        lastRecordState?.recordId &&
        lastRecordState?.prevCompany === companyName
      ) {
        lastRecordState.status = true;
        return output;
      }

      if (!investmentType?.includes(config.formDs.ignore.investmentType)) {
        output.push(data);
      }
    }

    if (!lastRecordState.status) {
      noOfPage += 1;
    }
  }

  return output;
};
