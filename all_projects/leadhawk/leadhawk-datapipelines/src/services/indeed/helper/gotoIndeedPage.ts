import type { Page } from "puppeteer";

export async function gotoIndeedPage(
  page: Page,
  jobTitle: string,
  location: string
) {
  try {
    const postUrl = `https://www.indeed.com/jobs?q=${encodeURIComponent(
      jobTitle
    )}&l=%08${encodeURIComponent(location)}&sc=0bf%3Aexrec()%3B&sort=date&fromage=1`;

    console.log(`- BEFORE :: current INDEED url - ${page.url()}`);
    console.log("- Redirecting .....");
    await page.goto(postUrl, {
      waitUntil: "networkidle0",
    });
    console.log(`- AFTER :: current INDEED url - ${page.url()}`);
  } catch (e: any) {
    console.log("gotoIndeedPage -- ", e);
    throw new Error("ERR: gotoIndeedPage", e);
  }
}
