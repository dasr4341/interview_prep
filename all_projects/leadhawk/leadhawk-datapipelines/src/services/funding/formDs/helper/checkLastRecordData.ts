import { Page } from "puppeteer";
import { config } from "../../../../config/config.js";
import { FormDsLastResModel } from "../../../../models/formDsLastRecordModel.js";
import mongoose from "mongoose";

export const checkLastRecordData = async (page: Page) => {
  await page.goto(config.formDs.getFromDsNthPage(1));
  await page.waitForSelector("table");

  const prevRecord = await FormDsLastResModel.findOne({});

  const record = await page.$("table > tbody > tr:nth-child(1)");
  const companyName = await (
    await record?.$("td a")
  )?.evaluate((el) => el.innerText);
  const investmentType = await (
    await record?.$("td span")
  )?.evaluate((el) => el.innerText.replace(/\(?\)?/g, "").trim());

  const result = {
    recordId: prevRecord?._id as mongoose.Types.ObjectId,
    investmentType: investmentType || null,
    prevCompany: prevRecord?.companyName || null,
    currentCompany: companyName || null,
    status: prevRecord?._id
      ? prevRecord?.companyName === companyName &&
        prevRecord?.investmentFund === investmentType
      : false,
  };

  return result;
};