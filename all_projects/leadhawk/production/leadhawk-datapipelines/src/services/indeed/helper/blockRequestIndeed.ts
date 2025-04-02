import type { HTTPRequest } from "puppeteer";

function blockRequest(url: string) {
  if (
    url.includes("google") ||
    url.includes("track") ||
    url.includes("oauth2") ||
    url.includes("secure") ||
    url.includes("signal") ||
    url.includes("gmt") ||
    url.includes("secure") ||
    url.includes("log") ||
    url.includes("sgtm") ||
    url.includes("autocomplete") ||
    url.includes("match") ||
    url.includes("pxl") ||
    url.includes("kimoyo")
  ) {
    return true;
  }
  return null;
}

export const interceptIndeedRequest = (request: HTTPRequest) => {
  const url = request.url();

  const isBlocked = blockRequest(url);

  if (isBlocked) {
    request.abort();
    return;
  }
  request.continue();
};
