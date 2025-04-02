import puppeteer from "puppeteer";
import { Cookie } from "./cookie.model";
import mongoose from "mongoose";

(async () => {
    await mongoose.connect('mongodb+srv://jackpete1228:LeadHawk@cluster0.bfxtoqi.mongodb.net/hawkio-dev?retryWrites=true&w=majority');
    const browser =  await puppeteer.launch({
      headless: false,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-features=site-per-process",
        "--disable-web-security",
      ]
    })
    const page = await browser.newPage();
    await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36");
  
      const cookies = await Cookie.find({});
      const linkedInCookies = cookies.map((cookie) => {
        const { _id, ...linkedInCookie } = cookie.toObject();
        return linkedInCookie;
      });
     
      for (const cookie of linkedInCookies) {
        if (cookie.name && cookie.value) {
          await page.setCookie(cookie as any);
        } else {
          console.warn("Invalid cookie", cookie);
        }
      }
    
      await page.goto('https://www.linkedin.com/', {
        waitUntil: "domcontentloaded",
      });
    
})()