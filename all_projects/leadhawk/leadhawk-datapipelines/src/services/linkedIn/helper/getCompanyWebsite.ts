export function getCompanyWebsite(link: string | null | undefined) {
  if (!link) {
    return null;
  }

  const trimmedLink = link?.trim();

  // checking for the presence of 'http' keyWord
  const cmpLinkHttp = !trimmedLink?.startsWith("http")
    ? `https://${trimmedLink}`
    : trimmedLink;

  // --------------- READ ME ------------
  // We were getting link like this ->  exampleLink
  // we only need the first part - 'https://www.hisanjosehotel.com/'

  // const exampleLink = 'https://www.hisanjosehotel.com/\n' +
  //   '\n' +
  //   'External link for Holiday Inn San Jose - Silicon Valley';
  // --------------- READ ME ------------

  const splitResult = cmpLinkHttp.split("\n")[0];

  if (splitResult) {
    return splitResult;
  }
  return cmpLinkHttp;
}
