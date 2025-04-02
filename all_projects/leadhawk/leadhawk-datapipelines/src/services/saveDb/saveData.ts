import { jobsConfidenceRatio } from "../../confidenceRatio/jobsConfidenceRatio.js";
import { fundingConfidenceRatio } from "../../confidenceRatio/fundingConfidenceRatio.js";
import { connectDatabase } from "../../config/dbConnection.js";
import { CodeFlowType } from "../../enums/codeFlowType.js";
import type {
  ILinkedInData,
  IScrapedCompanyData,
} from "../../interface/linkedIn.interface.js";
import { ExecutiveHiresModel } from "../../models/executiveHiresModel.js";
import { FundingDataModel } from "../../models/fundingDataModel.js";
import { JobPostDataModel } from "../../models/jobPostDataModel.js";
import { linkedInDataModel } from "../../models/linkedInDataModel.js";
import { businessNewsModel } from "../../models/businessNewsModel.js";
import type { Logger } from "winston";
import { newsConfidenceRatio } from "../../confidenceRatio/newsConfidenceRatio.js";
import { hiresConfidenceRatio } from "../../confidenceRatio/hiresConfidenceRatio.js";
import { config } from "../../config/config.js";
import IndustrySingleton from "../../config/constants/industries.js";
import { unlistedIndustriesModel } from "../../models/unlistedIndustryModel.js";
import { IFormatLinkedInData } from "../../interface/saveDb.interface.js";

const formatLinkedInData = (linkedData: ILinkedInData | null) : IFormatLinkedInData | null => {
  if (!linkedData) {
    return null;
  }
  if (
    linkedData?.scrappedCompanyHQ &&
    linkedData.country !== config.defaultLocation.code
  ) {
    throw new Error(
      `Country: ${linkedData.country}, is not inside default country - ${config.defaultLocation.code} `
    );
  }
  return {
    companyName: linkedData?.companyName,
    companyWebsite: linkedData?.companyWebsite,
    companySize: linkedData?.companySize,
    companyEmployeeCount: linkedData?.companyEmployeeCount,
    specialties: linkedData?.specialties,
    companyLinkedIn: linkedData?.companyLinkedIn,
    rawIndustry: linkedData?.industry,
    scrappedCompanyHQ: linkedData?.scrappedCompanyHQ,
    companyHQ: linkedData?.companyHQ, // stores state
    companyCity: linkedData?.companyCity,
    country: linkedData?.country,
  };
};
const saveJobPostData = async (data: IScrapedCompanyData, logger: Logger) => {
  const indeedLogger = logger.child({
    subservice: `${data.other.source}SaveData`,
  });

  try {
    const { linkedData, other } = data;
    const linkedIn = formatLinkedInData(linkedData);
    const indeed = {
      jobLink: other.jobLink,
      jobTitle: other?.jobTitle,
      jobLocation: other?.jobLocation,
    };
    let industry: string | null | undefined =
      IndustrySingleton.mappedIndustries.get(String(linkedData?.industry));

    if (!industry) {
      await unlistedIndustriesModel.findOneAndUpdate(
        { industry: linkedData?.industry },
        { industry: linkedData?.industry },
        { upsert: true }
      );
      industry = linkedData?.industry;
    }
    // ------------------------------------------------
    // ********* Is the data already present *********
    // ------------------------------------------------

    const isDataPresent = await JobPostDataModel.findOne({
      "jobPostRawData.companyName": other.scrapeCompanyName,
      rawJobTitle: other.rawJobTitle,
      source: other.source,
    }).lean();
    if (isDataPresent) {
      throw new Error(
        `JobPost :: Data already present ${other.scrapeCompanyName} ${other.rawJobTitle} ${other.source} `
      );
    }
    // ------------------------------------------------
    // ********* Is the data already present *********
    // ------------------------------------------------

    const res = await JobPostDataModel.findOneAndUpdate(
      {
        "jobPostRawData.companyName": other.scrapeCompanyName,
        rawJobTitle: other.rawJobTitle,
        source: other.source,
      },
      {
        scraped: true,
        source: other.source,
        ...indeed,
        ...linkedIn,
        jobPostRawData: { ...indeed, companyName: other?.scrapeCompanyName },
        linkedIn: { ...linkedIn, industry: linkedData?.industry },
        industry,
        companyName: linkedIn?.companyName || other?.scrapeCompanyName,
      },
      { upsert: true, new: true }
    ).lean();
    indeedLogger.info("Saved job post data", { response: res });

    await jobsConfidenceRatio(res, indeedLogger);
  } catch (error) {
    indeedLogger.info("ERROR : ", error);
  }
};

const saveFundingData = async (data: IScrapedCompanyData, logger: Logger) => {
  const formDsSaveDataLogger = logger.child({ subservice: "FormDsSaveData" });

  try {
    await connectDatabase(logger);
    const { linkedData, other } = data;
    const linkedIn = formatLinkedInData(linkedData);

    const formDs = {
      formDsCompany: other?.scrapeCompanyName,
      investmentType: other?.investmentType,
      fundingRaised: other?.fundingRaised,
    };
    let industry: string | null | undefined =
      IndustrySingleton.mappedIndustries.get(String(linkedData?.industry));

    if (!industry) {
      await unlistedIndustriesModel.findOneAndUpdate(
        { industry: linkedData?.industry },
        { industry: linkedData?.industry },
        { upsert: true }
      );
      industry = linkedData?.industry;
    }

    // ------------------------------------------------
    // ********* Is the data already present *********
    // ------------------------------------------------
    const isDataPresent = await FundingDataModel.findOne({
      formDsCompany: other?.scrapeCompanyName,
      fundingRaised: other.fundingRaised,
    }).lean();
    if (isDataPresent) {
      throw new Error(
        `FundingData :: Data already present ${other?.scrapeCompanyName} ${other.fundingRaised} `
      );
    }
    // ------------------------------------------------
    // ********* Is the data already present *********
    // ------------------------------------------------

    const res = await FundingDataModel.findOneAndUpdate(
      {
        formDsCompany: other?.scrapeCompanyName,
        fundingRaised: other.fundingRaised,
      },
      {
        scraped: true,
        source: other.source,
        linkedIn: { ...linkedIn, industry: linkedData?.industry },
        formDs: {
          ...formDs,
          companyName: other?.scrapeCompanyName,
          issuerLink: other?.issuerLink,
        },
        ...formDs,
        ...linkedIn,
        companyName: linkedIn?.companyName || other?.scrapeCompanyName,
        industry,
        sourceLink: other.issuerLink,
      },
      { upsert: true, new: true }
    ).lean();
    formDsSaveDataLogger.info("FormDs data save complete", {
      response: res,
    });

    await fundingConfidenceRatio(res, logger);
  } catch (error) {
    formDsSaveDataLogger.info("ERROR :: ", error);
  }
};

export const saveLinkedInData = async (
  data: IScrapedCompanyData,
  logger: Logger
) => {
  const linkedInJobsLogger = logger.child({
    subservice: "LinkedInCompanySaveData",
  });
  try {
    await connectDatabase(logger);
    const { linkedData, other } = data;

    if (!linkedData) {
      return;
    }

    // Count the keys in linkedin object that are not null
    const keyedLinkedinData = Object.values(linkedData).filter(
      (value) => !!value
    ).length;
    // if the all the keys are null value, dont add to DB
    if (keyedLinkedinData <= 2) {
      return;
    }

    const res = await linkedInDataModel
      .findOneAndUpdate(
        {
          companyName: linkedData.companyName,
          googleSearchCompany: other.scrapeCompanyName,
        },
        {
          ...linkedData,
          googleSearchCompany: other.scrapeCompanyName,
        },
        { upsert: true, new: true }
      )
      .lean();
    linkedInJobsLogger.info("LinkedIn Company data saved", res);
  } catch (error) {
    linkedInJobsLogger.info("ERROR :: ", error);
  }
};

const saveBusinessAndPRNews = async (
  data: IScrapedCompanyData,
  logger: Logger
) => {
  const businessandprnewssaveData = logger.child({
    subservice: "BusinessAndPRNewsSaveData",
  });
  try {
    const { linkedData, other } = data;
    let industry: string | null | undefined =
      IndustrySingleton.mappedIndustries.get(String(linkedData?.industry));

    if (!industry) {
      await unlistedIndustriesModel.findOneAndUpdate(
        { industry: linkedData?.industry },
        { industry: linkedData?.industry },
        { upsert: true }
      );
      industry = linkedData?.industry;
    }

    // ------------------------------------------------
    // ********* Is the data already present *********
    // ------------------------------------------------
    const isDataPresent = await businessNewsModel
      .findOne({
        triggerArticle: other.triggerArticle,
      })
      .lean();
    if (isDataPresent) {
      throw new Error(
        `BusinessAndPRNews :: Data already present ${other.triggerArticle} `
      );
    }
    // ------------------------------------------------
    // ********* Is the data already present *********
    // ------------------------------------------------

    const linkedIn = formatLinkedInData(linkedData);
    const newsData = {
      trigger: other.trigger,
      triggerArticle: other.triggerArticle,
      publishedDate: other.publishedDate,
    };

    let rawScrapeData = {};
    if (other.triggerArticle?.includes("businesswire")) {
      rawScrapeData = {
        businesswire: {
          ...other.businesswire,
          ...newsData,
          companyName: other.scrapeCompanyName,
        },
      };
    } else {
      rawScrapeData = {
        prnewswire: {
          ...other.prnewswire,
          ...newsData,
          companyName: other.scrapeCompanyName,
        },
      };
    }

    const res = await businessNewsModel
      .findOneAndUpdate(
        { triggerArticle: other.triggerArticle },
        {
          linkedIn: { ...linkedIn, industry: linkedData?.industry },
          ...linkedData,
          industry,
          ...newsData,
          source: other.source,
          ...rawScrapeData,
          scraped: true,
          companyName: linkedIn?.companyName || other?.scrapeCompanyName,
        },
        { upsert: true, new: true }
      )
      .lean();
    await newsConfidenceRatio(res, logger);
    businessandprnewssaveData.info("Business and PRNews data saved", res);
  } catch (error) {
    businessandprnewssaveData.info("Business News error :: ", error);
  }
};

const saveNewHiresData = async (data: IScrapedCompanyData, logger: Logger) => {
  const newHiresSaveData = logger.child({
    subservice: "NewHiresData",
  });
  try {
    const { linkedData, other } = data;

    const linkedIn = formatLinkedInData(linkedData);
    const index = other.jobStarterName?.trim()?.lastIndexOf(" ");
    const firstName = index
      ? other.jobStarterName?.substring(0, index).trim()
      : other.jobStarterName;
    const lastName = index ? other.jobStarterName?.substring(index).trim() : "";

    const newHiresData = {
      firstName,
      lastName,
      userProfileUrl: other.userProfileUrl,
      position: other.currentRole,
      jobPosterName: other.jobPosterName,
      jobStarterName: other.jobStarterName,
    };
    let industry: string | null | undefined =
      IndustrySingleton.mappedIndustries.get(String(linkedData?.industry));

    if (!industry) {
      await unlistedIndustriesModel.findOneAndUpdate(
        { industry: linkedData?.industry },
        { industry: linkedData?.industry },
        { upsert: true }
      );
      industry = linkedData?.industry;
    }

    // ------------------------------------------------
    // ********* Is the data already present *********
    // ------------------------------------------------
    const isDataPresent = await ExecutiveHiresModel.findOne({
      firstName,
      lastName,
      position: newHiresData.position,
      companyName: other.scrapeCompanyName,
    }).lean();
    if (isDataPresent) {
      throw new Error(
        `NewHires :: Data already present ${firstName} ${lastName} ${newHiresData.position} ${other.scrapeCompanyName}`
      );
    }
    // ------------------------------------------------
    // ********* Is the data already present *********
    // ------------------------------------------------

    const res = await ExecutiveHiresModel.findOneAndUpdate(
      {
        firstName,
        lastName,
        position: newHiresData.position,
        companyName: other.scrapeCompanyName,
      },
      {
        scraped: true,
        linkedIn: { ...linkedIn, industry: linkedData?.industry },
        ...linkedData,
        industry,
        ...newHiresData,
        source: other.source,
        newHires: { ...newHiresData, companyName: other.scrapeCompanyName },
        companyName: linkedIn?.companyName || other?.scrapeCompanyName,
      },
      { upsert: true, new: true }
    ).lean();

    await hiresConfidenceRatio(res, newHiresSaveData);
    newHiresSaveData.info("New hires data saved", res);
  } catch (error) {
    newHiresSaveData.info("ERROR - saveNewHires :: ", { error });
    newHiresSaveData.info("Data ::", { data });
  }
};

export const saveDataHandler = async (
  data: IScrapedCompanyData[],
  logger: Logger
) => {
  try {
    for (const record of data) {
      const source = record?.other?.source || null;

      if (
        source === CodeFlowType.FORMDS ||
        source === CodeFlowType.GOOGLE_FUNDING
      ) {
        await saveFundingData(record, logger);
      } else if (
        source === CodeFlowType.INDEED ||
        source === CodeFlowType.LINKEDIN_JOB_POST
      ) {
        await saveJobPostData(record, logger);
      } else if (
        source === CodeFlowType.BUSINESS_NEWS ||
        source === CodeFlowType.PR_NEWS
      ) {
        await saveBusinessAndPRNews(record, logger);
      } else if (source === CodeFlowType.NEW_HIRES) {
        await saveNewHiresData(record, logger);
      }
    }
  } catch (error) {
    logger.info("saveDataHandler: error", error);
  }
};
