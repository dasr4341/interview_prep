import { google } from "googleapis";
import axios, { AxiosError, AxiosResponse } from "axios";
import natural from "natural";
import type {
  SearchResult,
  VertexResponse,
} from "../../interface/vertexApi.interface.js";
import credentials from "../../config/constants/credentials.js";
import type { Logger } from "winston";
import { GoogleSearchModel } from "../../models/googleSearchModel.js";
import { config } from "../../config/config.js";
import { sanitizeObj } from "../../helper/getUTF8Data.js";

function findClosestCompany(query: string, searchResult: SearchResult[]) {
  let max = Number.MIN_SAFE_INTEGER;
  const idealLimitMin = config.googleSearch.idealConfidenceLimitMin;

  let companyName: string | null = null;
  let linkedInUrl: string | null = null;

  for (const data of searchResult) {
    const searchResultTitle = data.document.derivedStructData.title.trim();

    // In some case this title is coming like  - https://www.linkedin.com/company/4basecare-genomic
    // In that case we need to get the company name from the link

    // a. This link in first case should contain  --
    //    - 'https://www.linkedin.com/company/' OR 'https://www.linkedin.com/school/'
    //    - other than this is our company name itself

    // Getting the company name -
    // maxAllowedSlash is 4(count of slash)  -> 'https://www.linkedin.com/company/companyname' OR 'https://www.linkedin.com/school/companyname'

    const maxAllowedSlash = 4;
    // getting the part of array which is needed
    const searchResultTitleFormattedArr = searchResultTitle
      ?.split("/")
      ?.slice(maxAllowedSlash, maxAllowedSlash + 1);
    const searchResultFormattedTitle = !!searchResultTitleFormattedArr?.length
      ? searchResultTitleFormattedArr[0]
      : searchResultTitle;

    const jaroWinklerDistance = natural.JaroWinklerDistance(
      query,
      searchResultFormattedTitle,
      { ignoreCase: true }
    );
    if (max < jaroWinklerDistance) {
      max = jaroWinklerDistance;
      companyName = searchResultTitle;
      linkedInUrl = data.document.derivedStructData.link;
    }
  }

  // --------------------------------------------------------------------
  // **************************** README ********************************
  // --------------------------------------------------------------------

  // We are getting these urls, These are not needed -
  //  - https://www.linkedin.com/school/union-public-schools/people
  //  - https://www.linkedin.com/school/union-public-schools/people/
  //  - https://www.linkedin.com/school/union-public-schools/

  // This part is only need - https://www.linkedin.com/school/union-public-schools/
  // **** Map function below does these  ****

  // Max allowed - '/' is 5
  const maxAllowedSlash = 5;
  const linkedInFormattedLink = linkedInUrl
    ?.split("/")
    .slice(0, maxAllowedSlash)
    .join("/");

  // --------------------------------------------------------------------
  // **************************** README ********************************
  // --------------------------------------------------------------------

  return {
    linkedInUrl: idealLimitMin >= max ? linkedInFormattedLink : null,
    googleCompanyName:
      idealLimitMin >= max
        ? companyName?.replace("| LinkedIn", "").trim()
        : null,
  };
}

// Authenticate using the service account
const auth = new google.auth.GoogleAuth({
  credentials: credentials,
  scopes: [config.googleSearch.vertex.authUrl],
});

export async function getCompanyLinkedInURL(
  query: string | null = "",
  logger: Logger
): Promise<{
  linkedInUrl: string;
  googleCompanyName: string;
} | null> {
  if (!query) {
    logger.info("Invoked Google Search with blank query");
    return null;
  }

  // Check if google search results are cached?
  const cachedResult = await GoogleSearchModel.findOne({
    $or: [{ query }, { scrapeCompanyName: query }],
  }).select("linkedInUrl scrapeCompanyName");

  if (cachedResult) {
    logger.info("Google Cache Hit");
    if (cachedResult.linkedInUrl && cachedResult.scrapeCompanyName) {
      return {
        linkedInUrl: cachedResult.linkedInUrl,
        googleCompanyName: cachedResult.scrapeCompanyName,
      };
    }

    return null;
  }

  const client = await auth.getClient();
  const token = await client.getAccessToken();

  const headers = {
    Authorization: `Bearer ${token.token}`,
    "Content-Type": "application/json",
  };

  const payload = {
    query: query,
    pageSize: 10,
  };

  try {
    const response = await axios.post<VertexResponse>(
      config.googleSearch.vertex.baseUrl,
      payload,
      {
        headers,
      }
    );
    const vertexData = sanitizeObj(JSON.stringify(response.data));

    if (!vertexData.results?.length) {
      logger.info(`Failed to get Google Search Result for query: ${query}`, {
        responseData: vertexData,
      });
      return null;
    }

    const { linkedInUrl, googleCompanyName } = findClosestCompany(
      query,
      vertexData.results
    );
    if (!linkedInUrl || !googleCompanyName) return null;

    await GoogleSearchModel.updateOne(
      { query: query },
      {
        $set: {
          query,
          linkedInUrl,
          scrapeCompanyName: googleCompanyName,
        },
      },
      { upsert: true }
    );

    return { linkedInUrl, googleCompanyName };
  } catch (error) {
    if (error instanceof AxiosError) {
      logger.error("Some axios error occur:", { error });
    } else {
      console.log(" :: Error making search request: :: ", error);
    }
    return null;
  }
}
