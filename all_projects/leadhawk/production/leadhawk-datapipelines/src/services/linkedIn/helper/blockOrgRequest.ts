import type { HTTPRequest } from "puppeteer";
import type { Logger } from "winston";

function blockOrgRequest(url: string) {
  if (url.includes("licdn") || url.includes("track")) {
    return true;
  }

  if (url.includes("google") || url.includes("microsoft")) {
    return true;
  }

  if (
    url.startsWith(
      "https://www.linkedin.com/organization-guest/api/ingraphs/gauge"
    )
  ) {
    return true;
  }

  return null;
}

export function interceptLinkedInCompanyReq(
  request: HTTPRequest,
  logger: Logger
) {
  const url = request.url();
  const isBlocked = blockOrgRequest(url);

  if (isBlocked) {
    logger.silly(
      `Request to ${url.substring(0, 50)}...${url.substring(
        url.length - 5
      )} is aborted`
    );
    request.abort();
    return;
  }

  request.continue();
}
