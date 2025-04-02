import natural from "natural";
import { z } from "zod";
import { connectDatabase } from "../config/dbConnection.js";
import { NewsLiveModel } from "../models/businessNewsLiveModel.js";
import {
  type IDraftNewsModel,
  businessNewsModel,
} from "../models/businessNewsModel.js";
import type { Logger } from "winston";
import { config } from "../config/config.js";
import IndustrySingleton from "../config/constants/industries.js";

export async function newsConfidenceRatio(
  newsDraft: IDraftNewsModel,
  logger: Logger
) {
  const confidenceLogger = logger.child({
    subservice: "ConfidenceRatio - News",
  });
  try {
    confidenceLogger.silly("Confidence Ratio: start");

    await connectDatabase(confidenceLogger);

    const businessnewswireCompanyName = newsDraft?.businesswire?.companyName;
    const prnewswireCompanyName = newsDraft?.prnewswire?.companyName;
    const usableCompanyName =
      businessnewswireCompanyName ?? prnewswireCompanyName;
    const scrappedCompanyName = newsDraft?.companyName;
    const linkedInIndustry = newsDraft?.linkedIn?.industry;
    let totalConfidence = 0;

    if (!scrappedCompanyName) {
      confidenceLogger.info("newsConfidenceRatio: some values not available", {
        businessnewswireCompanyName,
        prnewswireCompanyName,
        scrappedCompanyName,
      });
      return;
    }

    const jaroWinklerDistance = natural.JaroWinklerDistance(
      usableCompanyName,
      scrappedCompanyName,
      { ignoreCase: true }
    );
    totalConfidence = structuredClone(jaroWinklerDistance); // check 1

    const isIndustryMapable = !!IndustrySingleton.mappedIndustries.get(
      String(linkedInIndustry)
    );
    if (isIndustryMapable || !linkedInIndustry) {
      totalConfidence += 1; // check 2
    }

    totalConfidence = Number(((totalConfidence / 2) * 100).toFixed(3));
    confidenceLogger.info({
      businessnewswireCompanyName,
      prnewswireCompanyName,
      usableCompanyName,
      scrappedCompanyName,
      linkedInIndustry,
      isIndustryMapable,
      jaroWinklerDistance,
      totalConfidence,
    });

    confidenceLogger.info(
      `${newsDraft._id} :: confidenceRato: ${totalConfidence}`
    );

    const updateDraftNews = await businessNewsModel.updateOne(
      { _id: newsDraft._id },
      { $set: { confidenceRatio: totalConfidence } }
    );

    confidenceLogger.info("updateDraftNews: ", updateDraftNews);

    if (totalConfidence < 80) {
      confidenceLogger.info("totalConfidence < 80, not publishing to live");
      console.log(
        "\n#-------------------------------------------------------------------------------------#\n"
      );
      return;
    }

    confidenceLogger.info(
      "totalConfidence > 80, validating the data for publishing"
    );

    const newsLive = {
      dataEntryOperatorId: null,
      trigger: newsDraft.trigger,
      triggerArticle: newsDraft.triggerArticle,
      companyName: newsDraft.companyName,
      companyHQ: newsDraft.companyHQ,
      companyCity: newsDraft.companyCity,
      industry: newsDraft.industry,
      companyEmployeeCount: newsDraft.companyEmployeeCount,
      companyLinkedIn: newsDraft.companyLinkedIn,
      companyWebsite: newsDraft.companyWebsite,
      publishedDate: newsDraft.publishedDate,
    };

    const newsLiveSchema = z.object({
      dataEntryOperatorId: z.null(),
      trigger: z.string().min(1, "Trigger is required"),
      triggerArticle: z.string().min(1, "Trigger Article is required"),
      companyName: z.string().min(1, "Company Name is required"),
      companyLinkedIn: z
        .string()
        .min(1, "Company LinkedIn is required")
        .regex(/^(https?:\/\/)?([a-z]{2,3}\.)?linkedin\.com\/.*$/, {
          message: "Company LinkedIn must be a valid LinkedIn URL",
        }),
    });

    const newsValidationResult = newsLiveSchema.safeParse(newsLive);

    confidenceLogger.info("newsLive: ", newsLive);

    if (newsValidationResult.success) {
      confidenceLogger.info("Validation passed: publishing to live");
      await businessNewsModel.updateOne(
        { _id: newsDraft._id },
        { $set: { transferred: true, autoScrape: true } }
      );
      await NewsLiveModel.create(newsLive);

      try {
        const response = await fetch(
          `${config.leadhawk.filterServiceUrl}/filters1/percolate`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json; charset=utf-8",
            },
            body: JSON.stringify({ ...newsLive, page: "GeneralBusinessNews" }),
          }
        );

        console.log("news percolate api success: ", await response.json());
      } catch (error) {
        console.log("news percolate api failed");
      }
    } else {
      confidenceLogger.info(
        "Validation failed: NOT publishing to live",
        newsValidationResult.error.errors
      );
    }

    console.log(
      "\n#-------------------------------------------------------------------------------------#\n"
    );
  } catch (error) {
    confidenceLogger.info("newsConfidenceRatio: error", error);
  } finally {
    confidenceLogger.info("newsConfidenceRatio: end");
  }
}
