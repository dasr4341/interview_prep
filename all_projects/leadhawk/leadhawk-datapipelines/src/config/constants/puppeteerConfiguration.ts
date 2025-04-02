import { CodeFlowType } from "../../enums/codeFlowType.js";
import type { IPuppeteerConfiguration } from "../../interface/puppeteer.interface.js";

// The source for which the config are same, for them the source type will be - Generic
export const generic = "GENERIC";
const proxyBrowserConfig = {
  args: [
    "--headless",
    "--proxy-server=pr.oxylabs.io:7777",
    "--disable-web-security",
    "--no-sandbox",
    "--disable-setuid-sandbox",
    "--disable-dev-shm-usage",
    "--disable-accelerated-2d-canvas",
    "--no-first-run",
    "--no-zygote",
    "--single-process",
    "--disable-gpu",
  ],
  waitUntil: ["networkidle2", "domcontentloaded", "load"],
};

export const puppeteerConfiguration: {
  [key: string]: IPuppeteerConfiguration;
} = {
  [generic]: {
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      // ----------------
      "--disable-dev-shm-usage",
      "--disable-features=site-per-process",
      "--disable-web-security"
    ],
  },
  [CodeFlowType.FORMDS]: {
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox"
    ],
    defaultViewport: null,
    timeout: 0,
    protocolTimeout: 60000,
  },
  [CodeFlowType.INDEED]: proxyBrowserConfig,
};
