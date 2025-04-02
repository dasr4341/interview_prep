import natural from "natural";
import { z } from "zod";
import { connectDatabase } from "../config/dbConnection.js";
import type { Logger } from "winston";
import {
  ExecutiveHiresModel,
  type IDraftHiresModel,
} from "../models/executiveHiresModel.js";
import { ExecutiveHiresLiveModel } from "../models/executiveHiresLiveModel.js";
import { config } from "../config/config.js";
import IndustrySingleton from "../config/constants/industries.js";

export async function hiresConfidenceRatio(
  hiresDraft: IDraftHiresModel,
  logger: Logger
) {
  const confidenceRatioLogger = logger.child({
    subservice: "ConfidenceRatio - Hires",
  });

  try {
    confidenceRatioLogger.info("hiresConfidenceRatio: start", {
      hiresDraft,
    });

    await connectDatabase(confidenceRatioLogger);

    const linkedInCompanyName = hiresDraft?.linkedIn?.companyName;
    const scrappedCompanyName = hiresDraft?.companyName;
    const linkedInIndustry = hiresDraft?.linkedIn?.industry;
    let totalConfidence = 0;

    if (!linkedInCompanyName || !scrappedCompanyName) {
      confidenceRatioLogger.info(
        "hiresConfidenceRatio: some values not available",
        { linkedInCompanyName, scrappedCompanyName }
      );
      return;
    }

    const jaroWinklerDistance = natural.JaroWinklerDistance(
      linkedInCompanyName,
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

    confidenceRatioLogger.info("Hires Confidence", {
      linkedInCompanyName,
      scrappedCompanyName,
      linkedInIndustry,
      isIndustryMapable,
      jaroWinklerDistance,
      totalConfidence,
    });

    confidenceRatioLogger.info("updating confidenceRato", totalConfidence);
    const createdDraftHires = await ExecutiveHiresModel.updateOne(
      { _id: hiresDraft._id },
      { $set: { confidenceRatio: totalConfidence } }
    );
    confidenceRatioLogger.info("createdDraftHires: ", createdDraftHires);

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

    const hiresLive = {
      dataEntryOperatorId: null,
      firstName: hiresDraft.firstName,
      lastName: hiresDraft.lastName,
      position: hiresDraft.position,
      companyName: hiresDraft.companyName,
      companyHQ: hiresDraft.companyHQ,
      companyCity: hiresDraft.companyCity,
      industry: hiresDraft.industry,
      companyEmployeeCount: hiresDraft.companyEmployeeCount,
      companyLinkedIn: hiresDraft.companyLinkedIn,
      companyWebsite: hiresDraft.companyWebsite,
    };

    const hiresLiveSchema = z.object({
      dataEntryOperatorId: z.null(),
      firstName: z.string().min(1, "First Name is required"),
      lastName: z.string().min(1, "Last Name is required"),
      position: z.string().min(1, "Position is required"),
      companyName: z.string().min(1, "Company Name is required"),
      companyLinkedIn: z
        .string()
        .min(1, "Company LinkedIn is required")
        .regex(/^(https?:\/\/)?([a-z]{2,3}\.)?linkedin\.com\/.*$/, {
          message: "Company LinkedIn must be a valid LinkedIn URL",
        }),
    });

    const hiresValidationResult = hiresLiveSchema.safeParse(hiresLive);

    confidenceRatioLogger.info("hiresLive: ", hiresLive);

    if (hiresValidationResult.success) {
      confidenceRatioLogger.info("Validation passed: publishing to live");
      await ExecutiveHiresModel.updateOne(
        { _id: hiresDraft._id },
        { $set: { transferred: true, autoScrape: true } },
        { upsert: true }
      );
      await ExecutiveHiresLiveModel.create(hiresLive);

      try {
        const response = await fetch(
          `${config.leadhawk.filterServiceUrl}/filters1/percolate`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json; charset=utf-8",
            },
            body: JSON.stringify({ ...hiresLive, page: "NewExecutiveHires" }),
          }
        );

        console.log("hires percolate api success: ", response.json());
      } catch (error) {
        console.log("hires percolate api failed");
      }
    } else {
      confidenceRatioLogger.info(
        "Validation failed: NOT publishing to live",
        hiresValidationResult.error.errors
      );
    }

    confidenceRatioLogger.info(
      "\n#-------------------------------------------------------------------------------------#\n"
    );
  } catch (error) {
    confidenceRatioLogger.info("hiresConfidenceRatio: error", error);
  } finally {
    confidenceRatioLogger.info("hiresConfidenceRatio: end");
  }
}
