import type { HTTPRequest } from "puppeteer";

function blockRequest(url: string) {
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

  if (url.startsWith("https://www.linkedin.com/litms/api/metadata/user")) {
    return true;
  }

  if (
    url.startsWith("https://www.linkedin.com/jobs-guest/api/ingraphs/counter")
  ) {
    return true;
  }

  return null;
}

export const interceptLinkedInJobPostRequest = async (request: HTTPRequest) => {
  const url = request.url();

  const isBlocked = blockRequest(url);

  if (isBlocked) {
    request.abort();
    return;
  }

  request.continue();
};
