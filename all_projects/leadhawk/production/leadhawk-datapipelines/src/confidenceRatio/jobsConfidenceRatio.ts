import natural from "natural";
import { z } from "zod";
import { connectDatabase } from "../config/dbConnection.js";
import {
  type IDraftJobsModel,
  JobPostDataModel,
} from "../models/jobPostDataModel.js";
import { JobsLiveModel } from "../models/jobsLiveDataModel.js";
import type { Logger } from "winston";
import { config } from "../config/config.js";
import JobTitleSingleton from "../helper/getJobTitles.js";
import IndustrySingleton from "../config/constants/industries.js";

export async function jobsConfidenceRatio(
  jobsDraft: IDraftJobsModel,
  logger: Logger
) {
  const confidenceRatioLogger = logger.child({
    subservice: "ConfidenceRatio - Jobs",
  });

  try {
    confidenceRatioLogger.silly("Confidence Ratio: start", jobsDraft);

    await connectDatabase(confidenceRatioLogger);

    const indeedCompanyName = jobsDraft?.jobPostRawData?.companyName;
    const scrappedCompanyName = jobsDraft?.companyName;
    const linkedInIndustry = jobsDraft?.linkedIn?.industry;

    let totalConfidence = 0;

    if (!indeedCompanyName || !scrappedCompanyName) {
      confidenceRatioLogger.warn("🚨 Confidence Ratio Check Failed");
      confidenceRatioLogger.warn(
        `Looks like ${!indeedCompanyName ? "indeedCompanyName" : ""} ${
          !scrappedCompanyName ? "scrappedCompanyName" : ""
        } is not available`,
        { indeedCompanyName, scrappedCompanyName }
      );
      return;
    }

    const jaroWinklerDistance = natural.JaroWinklerDistance(
      indeedCompanyName,
      scrappedCompanyName,
      { ignoreCase: true }
    );
    totalConfidence = structuredClone(jaroWinklerDistance); // 1
    confidenceRatioLogger.info(
      `Company name validation ${
        totalConfidence > 0.8 ? "passed 🎉" : "failed 🚨"
      }`,
      { companyNameConfidence: totalConfidence }
    );

    const isIndustryMapable = !!IndustrySingleton.mappedIndustries.get(
      String(linkedInIndustry)
    );
    if (isIndustryMapable || !linkedInIndustry) {
      totalConfidence += 1; // 3
    }
    confidenceRatioLogger.info(
      `Industry from LinkedIn is ${
        isIndustryMapable ? "" : "not"
      } mappable to our list`,
      { isIndustryMapable, linkedInIndustry }
    );

    totalConfidence = Number(((totalConfidence / 2) * 100).toFixed(2));

    confidenceRatioLogger.info("Updating Confidence Ratio", totalConfidence);
    await JobPostDataModel.updateOne(
      { _id: jobsDraft._id },
      { $set: { confidenceRatio: totalConfidence } }
    );

    if (totalConfidence < 80) {
      confidenceRatioLogger.info(
        "totalConfidence < 80, not publishing to live"
      );
      return;
    }

    confidenceRatioLogger.info(
      "totalConfidence > 80, validating the data for publishing"
    );

    const jobsLive = {
      dataEntryOperatorId: null,
      jobTitle: jobsDraft.jobTitle,
      jobLink: jobsDraft.jobLink,
      companyName: jobsDraft.companyName,
      companyHQ: jobsDraft.companyHQ,
      companyCity: jobsDraft.companyCity,
      industry: jobsDraft.industry,
      companyEmployeeCount: jobsDraft.companyEmployeeCount,
      companyLinkedIn: jobsDraft.companyLinkedIn,
      companyWebsite: jobsDraft.companyWebsite,
    };

    const jobsLiveSchema = z.object({
      dataEntryOperatorId: z.null(),
      jobTitle: z.string().min(1, "Job Title is required"),
      jobLink: z.string().min(1, "Job Link is required"),
      companyName: z.string().min(1, "Company Name is required"),
      companyLinkedIn: z
        .string()
        .min(1, "Company LinkedIn is required")
        .regex(/^(https?:\/\/)?([a-z]{2,3}\.)?linkedin\.com\/.*$/, {
          message: "Company LinkedIn must be a valid LinkedIn URL",
        }),
    });

    const jobsValidationResult = jobsLiveSchema.safeParse(jobsLive);

    confidenceRatioLogger.info("jobsLive: ", jobsLive);

    if (jobsValidationResult.success) {
      confidenceRatioLogger.info("Validation passed: publishing to live 🍾");
      await JobPostDataModel.updateOne(
        { _id: jobsDraft._id },
        { $set: { transferred: true, autoScrape: true } }
      );
      await JobsLiveModel.create(jobsLive);

      try {
        const response = await fetch(
          `${config.leadhawk.filterServiceUrl}/filters1/percolate`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json; charset=utf-8",
            },
            body: JSON.stringify({ ...jobsLive, page: "JobPostings" }),
          }
        );

        console.log("jobs percolate api success: ", await response.json());
      } catch (error) {
        console.log("jobs percolate api failed");
      }
    } else {
      confidenceRatioLogger.info(
        "Validation failed: NOT publishing to live ❌",
        jobsValidationResult.error.errors
      );
    }
  } catch (error) {
    confidenceRatioLogger.error("Confidence Ratio: error", error);
  } finally {
    confidenceRatioLogger.info("Confidence Ratio: end");
  }
}
