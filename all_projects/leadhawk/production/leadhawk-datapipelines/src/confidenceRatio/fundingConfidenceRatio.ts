import natural from "natural";
import { z } from "zod";
import { connectDatabase } from "../config/dbConnection.js";
import {
  FundingDataModel,
  type IDraftFundingModel,
} from "../models/fundingDataModel.js";
import { FundingLiveModel } from "../models/fundingLiveDataModel.js";
import type { Logger } from "winston";
import { config } from "../config/config.js";
import IndustrySingleton from "../config/constants/industries.js";

export async function fundingConfidenceRatio(
  fundingDraft: IDraftFundingModel,
  logger: Logger
) {
  const confidenceRatioLogger = logger.child({
    subservice: "ConfidenceRatio - Funding",
  });

  try {
    confidenceRatioLogger.info("fundingConfidenceRatio: start", {
      fundingDraft,
    });

    await connectDatabase(confidenceRatioLogger);

    const formDsCompanyName = fundingDraft.formDs?.companyName;
    const scrappedCompanyName = fundingDraft?.linkedIn?.companyName;
    const linkedInIndustry = fundingDraft?.linkedIn?.industry;
    let totalConfidence = 0;

    if (!formDsCompanyName || !scrappedCompanyName) {
      confidenceRatioLogger.info(
        "fundingConfidenceRatio: some values not available",
        { formDsCompanyName, scrappedCompanyName }
      );
      return;
    }

    const jaroWinklerDistance = natural.JaroWinklerDistance(
      formDsCompanyName,
      scrappedCompanyName,
      { ignoreCase: true }
    );
    totalConfidence = structuredClone(jaroWinklerDistance);

    const isIndustryMapable = !!IndustrySingleton.mappedIndustries.get(
      String(linkedInIndustry)
    );
    if (isIndustryMapable || !linkedInIndustry) {
      totalConfidence += 1; // check 2
    }

    totalConfidence = Number(((totalConfidence / 2) * 100).toFixed(3));

    confidenceRatioLogger.info("Funding Confidence", {
      formDsCompanyName,
      scrappedCompanyName,
      linkedInIndustry,
      isIndustryMapable,
      jaroWinklerDistance,
      totalConfidence,
    });

    confidenceRatioLogger.info("updating confidenceRato", totalConfidence);
    const createdDraftFinding = await FundingDataModel.updateOne(
      { _id: fundingDraft._id },
      { $set: { confidenceRatio: totalConfidence } }
    );
    confidenceRatioLogger.info("createdDraftFinding: ", createdDraftFinding);

    if (totalConfidence < 80) {
      confidenceRatioLogger.info(
        "totalConfidence < 80, not publishing to live"
      );
      confidenceRatioLogger.info(
        "\n#-------------------------------------------------------------------------------------#\n"
      );
      return;
    }

    confidenceRatioLogger.info(
      "totalConfidence > 80, validating the data for publishing"
    );

    const fundingLive = {
      dataEntryOperatorId: null,
      companyName: fundingDraft.companyName,
      companyHQ: fundingDraft?.companyHQ,
      companyCity: fundingDraft?.companyCity,
      industry: fundingDraft.industry,
      fundingRaised: fundingDraft.fundingRaised,
      companyEmployeeCount: fundingDraft.companyEmployeeCount,
      companyLinkedIn: fundingDraft.companyLinkedIn,
      companyWebsite: fundingDraft.companyWebsite,
    };

    const fundingLiveSchema = z.object({
      dataEntryOperatorId: z.null(),
      companyName: z.string().min(1, "Company Name is required"),
      fundingRaised: z
        .number()
        .min(1, {
          message: "Funding Raised must be at least greater than or equal to 1",
        })
        .max(9000000000000000, {
          message:
            "Funding Raised must be at most lesser than or equal to 9000000000000000",
        }),
      companyLinkedIn: z
        .string()
        .min(1, "Company LinkedIn is required")
        .regex(/^(https?:\/\/)?([a-z]{2,3}\.)?linkedin\.com\/.*$/, {
          message: "Company LinkedIn must be a valid LinkedIn URL",
        }),
    });

    const fundingValidationResult = fundingLiveSchema.safeParse(fundingLive);

    confidenceRatioLogger.info("fundingLive: ", fundingLive);

    if (fundingValidationResult.success) {
      confidenceRatioLogger.info("Validation passed: publishing to live");
      await FundingDataModel.updateOne(
        { _id: fundingDraft._id },
        { $set: { transferred: true, autoScrape: true } }
      );
      await FundingLiveModel.create(fundingLive);

      try {
        const response = await fetch(
          `${config.leadhawk.filterServiceUrl}/filters1/percolate`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json; charset=utf-8",
            },
            body: JSON.stringify({ ...fundingLive, page: "NewFunding" }),
          }
        );

        console.log("funding percolate api success: ", response.json());
      } catch (error) {
        console.log("funding percolate api failed");
      }
    } else {
      confidenceRatioLogger.info(
        "Validation failed: NOT publishing to live",
        fundingValidationResult.error.errors
      );
    }

    confidenceRatioLogger.info(
      "\n#-------------------------------------------------------------------------------------#\n"
    );
  } catch (error) {
    confidenceRatioLogger.info("fundingConfidenceRatio: error", error);
  } finally {
    confidenceRatioLogger.info("fundingConfidenceRatio: end");
  }
}
