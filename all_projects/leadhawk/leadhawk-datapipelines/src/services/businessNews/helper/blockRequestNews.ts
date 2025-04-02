import type { HTTPRequest } from "puppeteer";

function blockRequest(url: string) {
  if (
    url.includes("prncom") ||
    url.includes("clientlibs") ||
    url.includes("media")
  ) {
    return true;
  }
  return null;
}

export const interceptNewsRequest = (request: HTTPRequest) => {
  const url = request.url();
  const isBlocked = blockRequest(url);

  if (isBlocked) {
    request.abort();
    return;
  }
  request.continue();
};
