import type { Logger } from "winston";
import type { IBusinessAndPRNews } from "../interface/businessAndprNews.interface.js";
import type { IFormDs } from "../interface/formDs.interface.js";
import type { IIndeed } from "../interface/indeed.interface.js";
import type { ILinkedInData } from "../interface/linkedIn.interface.js";
import type { ILinkedInJobPostData } from "../interface/linkedInJob.interface.js";
import type { INewHires } from "../interface/newHires.interface.js";
import { linkedInDataModel } from "../models/linkedInDataModel.js";
import { GoogleSearchModel } from "../models/googleSearchModel.js";

type sourceDataType =
  | IFormDs
  | IIndeed
  | ILinkedInJobPostData
  | IBusinessAndPRNews
  | INewHires
  | undefined;

export const is7DaysOld = async (
  sourceData: sourceDataType[],
  logger: Logger,
  isBusinessNews = false
) => {
  const childLogger = logger.child({ subservice: "7 Days Check" });

  let allCompanyNames = sourceData
    .filter((data) => !!data?.companyName)
    .map((data) => data?.companyName);

  let searchRecords: Array<{
    query: string;
    linkedInUrl?: string;
    scrapeCompanyName?: string;
  }>;
  if (isBusinessNews) {
    searchRecords = await GoogleSearchModel.find({
      query: {
        $exists: true,
        $in: allCompanyNames,
      },
    }).lean();

    const searchNames = allCompanyNames.map((name) => {
      const hasSearchRecord = searchRecords.find(
        (record) => name === record.query
      );
      return hasSearchRecord ? hasSearchRecord.scrapeCompanyName : name;
    });

    allCompanyNames = searchNames;
  }

  const records = await linkedInDataModel
    .find({
      $or: [
        {
          googleSearchCompany: {
            $exists: true,
            $in: allCompanyNames,
          },
        },
        {
          companyName: {
            $exists: true,
            $in: allCompanyNames,
          },
        },
      ],
      lastModifiedDate: {
        $lte: new Date(new Date().setDate(new Date().getDate() - 30)),
      },
    })
    .lean();

  childLogger.info(`Found ${records.length} out of ${sourceData.length}`);

  const searchData: {
    searchData: sourceDataType;
    status: boolean;
    linkedIn: ILinkedInData | null;
  }[] = [];

  for (const data of sourceData) {
    const result = records.find((record) => {
      const { _id, ...linkedIn } = record;

      const checkCompanyName = (cn: string) => {
        if (isBusinessNews) {
          const hasSearchRecord = searchRecords.find((re) => re.query === cn);
          const toCheckCompanyName = hasSearchRecord
            ? hasSearchRecord.scrapeCompanyName
            : data?.companyName;
          return toCheckCompanyName === cn;
        }
        return data?.companyName === cn;
      };

      console.log(
        record.googleSearchCompany &&
          checkCompanyName(record.googleSearchCompany)
      );
      if (
        record.googleSearchCompany &&
        checkCompanyName(record.googleSearchCompany)
      ) {
        console.log({ conpanyName: record.googleSearchCompany });
        searchData.push({
          searchData: data,
          linkedIn: {
            companyName: linkedIn.companyName,
            companyLinkedIn: linkedIn.companyLinkedIn,
            industry: linkedIn.industry,
            companyWebsite: linkedIn.companyWebsite,
            companySize: linkedIn.companySize,
            companyEmployeeCount: linkedIn.companyEmployeeCount,
            specialties: linkedIn.specialties,
            scrappedCompanyHQ: linkedIn.scrappedCompanyHQ,
            companyHQ: linkedIn.companyHQ,
            companyCity: linkedIn.companyCity,
            country: linkedIn.country,
          },
          status: true,
        });
        return data;
      }
    });
    if (!result) {
      const companyData = await linkedInDataModel
        .findOne({
          $or: [
            { googleSearchCompany: data?.companyName },
            { companyName: data?.companyName },
          ],
        })
        .lean();

      const { _id, ...linkedInData } = companyData || {
        _id: "",
        linkedInData: null,
      };

      searchData.push({
        searchData: data,
        linkedIn: (linkedInData as ILinkedInData) || null,
        status: !companyData?._id,
      });
    }
  }

  // logger.info("7 Days Old Search Data", { searchData: searchData });
  return searchData;
};
