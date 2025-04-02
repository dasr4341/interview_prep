import type { Page } from "puppeteer";
import { IndeedLastRecordModel } from "../../../models/indeedLastRecordModel.js";

export const getLastRecordStatusIndeed = async (
  searchJobTitle: string,
  page: Page
) => {
  const record = await page.$("#mosaic-provider-jobcards>ul>li:nth-child(1)");

  const currJobTitle = await (
    await record?.$("div>div>div>div>div>table>tbody>tr>td>div>h2>a>span")
  )?.evaluate((el) => el.innerText);

  const currCompanyName = await (
    await record?.$("div>div>div>div>div>table>tbody>tr>td>div>div>div")
  )?.evaluate((el) => el.innerText);

  const lastRecord = await IndeedLastRecordModel.findOne({ searchJobTitle });

  return {
    recordId: String(lastRecord?._id) || null,
    prevJobTitle: lastRecord?.jobTitle || null,
    prevCompanyName: lastRecord?.companyName || null,
    currJobTitle: currJobTitle || null,
    currCompanyName: currCompanyName || null,

    // ---------------------------------------------------------------
    //  *********** status === true, means :: no new data ***********
    // ---------------------------------------------------------------
    status: lastRecord?._id
      ? lastRecord?.companyName === currCompanyName &&
        lastRecord?.jobTitle === currJobTitle
      : false,
    // ---------------------------------------------------------------
    //  *********** status === true, means :: no new data ***********
    // ---------------------------------------------------------------
  };
};
