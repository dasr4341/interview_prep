import type { HTTPRequest } from "puppeteer";

function blockRequest(targetString: string) {
  const substrings = [
    "image",
    "41j9d0423ck1snej32brbuuwg",
    "4c1dzspg0yqfip47a9y26tnx8",
    "f58e354mjsjpdd67eq51cuh49",
    "cm8d2ytayynyhw5ieaare0tl3",
    "2uxqgankkcxm505qn812vqyss",
    "3wqhxqtk2l554o70ur3kessf1",
    "collect",
    "media",
    "pagead",
    "png",
    "track",
  ];

  return substrings.some((substring) => targetString.includes(substring));
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
