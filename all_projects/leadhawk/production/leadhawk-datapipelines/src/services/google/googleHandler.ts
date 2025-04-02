import type { IBusinessAndPRNews } from "../../interface/businessAndprNews.interface.js";
import type { IFormDs } from "../../interface/formDs.interface.js";
import type { IGoogleSearch } from "../../interface/googleSearch.interface.js";
import type { IIndeed } from "../../interface/indeed.interface.js";
import type { ILinkedInJobPostData } from "../../interface/linkedInJob.interface.js";
import type { INewHires } from "../../interface/newHires.interface.js";
import { getCompanyLinkedInURL } from "./vertexApi.js";
import type { Logger } from "winston";
import { googleSearch } from "./googleSearch.js";
import { getUTF8Data } from "../../helper/encodeUTF-8String.js";

export const googleHandler = async (
  scrapeData: (
    | IFormDs
    | IIndeed
    | ILinkedInJobPostData
    | IBusinessAndPRNews
    | INewHires
  )[],
  logger: Logger
): Promise<{
  success: IGoogleSearch[];
  failed: IGoogleSearch[];
}> => {
  const googleLogger = logger.child({ subservice: "GoogleSearch" });

  try {
    const googleSearchData$ = scrapeData.map((record) => {
      return new Promise<IGoogleSearch | null>(async (resolve) => {
        const result = await getCompanyLinkedInURL(
          getUTF8Data(record.companyName || ""),
          googleLogger
        );
        // Cache Google Result
        if (!result) {
          logger.warn("Did not get search result for record", { record });
        }
        resolve({
          ...record,
          linkedInUrl: result?.linkedInUrl || null,
          scrapeCompanyName: result?.googleCompanyName || null,
        });
      });
    });
    const googleSearchData = await Promise.all(googleSearchData$);

    const success = googleSearchData.filter(
      (data) => !!data && data.scrapeCompanyName && data.linkedInUrl
    ) as IGoogleSearch[];
    const failed = googleSearchData.filter(
      (data) => !!data && (!data.scrapeCompanyName || !data.linkedInUrl)
    ) as IGoogleSearch[];

    // -------------------------------------------------------------------
    // RE-PROCESS it by searching it in GOOGLE !!
    // -------------------------------------------------------------------
    const { success: googleSearchSuccess, failed: googleSearchFailed } =
      await googleSearch(logger, failed);
    // -------------------------------------------------------------------
    // RE-PROCESS it by searching it in GOOGLE !!
    // -------------------------------------------------------------------

    return {
      success: [...success, ...googleSearchSuccess],
      failed: googleSearchFailed,
    };
  } catch (error) {
    googleLogger.error("handler: error", error);
    return {
      success: [],
      failed: [],
    };
  }
};
