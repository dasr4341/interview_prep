import type { Page } from "puppeteer";
import { config } from "../config/config.js";
import { Cookie } from "../models/linkedinCookies.js";
import type { Logger } from "winston";

export const loginLinkedIn = async (page: Page, logger: Logger) => {
  const linkedInCookieLoginLogger = logger.child({
    subservice: "LinkedInCookieLogin",
  });

  await page.goto(config.linkedIn.loginUrl, {
    waitUntil: "domcontentloaded",
  });

  const isLoggedIn = await page.evaluate(() => {
    return !document.querySelector("#username");
  });
  linkedInCookieLoginLogger.info(`LinkedIn login status :: ${isLoggedIn}`);
  if (!isLoggedIn) {
    const cookies = await Cookie.find({});
    const linkedInCookies = cookies.map((cookie) => {
      const { _id, ...linkedInCookie } = cookie.toObject();
      return linkedInCookie;
    });

    linkedInCookieLoginLogger.info(
      `linkedIn cookies length :: ${linkedInCookies?.length}`
    );
    for (const cookie of linkedInCookies) {
      // Ensure each cookie object contains necessary fields
      if (cookie.name && cookie.value) {
        await page.setCookie(cookie);
      } else {
        console.warn("Invalid cookie", cookie);
      }
    }
  }
};

export const logoutLinkedIn = async (page: Page, logger: Logger) => {
  const cookies = await page.cookies();
  await page.deleteCookie(...cookies);
  const cookiesAfterDeletion = await page.cookies();
  logger.info(`Cookies after deletion:${cookiesAfterDeletion.length}`);
};
