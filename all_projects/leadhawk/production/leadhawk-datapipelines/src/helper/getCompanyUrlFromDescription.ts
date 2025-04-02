import { IGoogleSearch } from "../interface/googleSearch.interface.js";
import { INewHires } from "../interface/newHires.interface.js";
import natural from "natural";

export const getCompanyUrlFromDesc = (sourceData: INewHires[]) => {
  const notMatchingCompanies = [];
  const matchedCompanies: IGoogleSearch[] = [];
  for (const data of sourceData) {
    if (!data.companyLinks?.length) {
      notMatchingCompanies.push(data);
      continue;
    }
    let companyUrl: string = "";
    let companyConfidence = 0;

    for (const link of data.companyLinks) {
      const company$ = link.replace(/.*company\/([^/]+)\/?/, "$1");
      const companyFromLink = company$.replace(/[-/]/g, "");
      const preProcessedCompany =
        data.companyName?.toLowerCase()?.replace(/[^a-zA-Z0-9]/g, "") || "";

      const jaroWinklerDistance = natural.JaroWinklerDistance(
        preProcessedCompany,
        companyFromLink,
        { ignoreCase: true }
      );
      if (jaroWinklerDistance > companyConfidence) {
        companyUrl = link;
        companyConfidence = jaroWinklerDistance;
      }
    }

    console.log({ companyNameConfidence: companyConfidence });
    if (companyConfidence >= 0.9) {
      matchedCompanies.push({
        ...data,
        scrapeCompanyName: data.companyName,
        linkedInUrl: companyUrl,
      });
    } else {
      notMatchingCompanies.push(data);
    }
  }
  return { notMatchingCompanies, matchedCompanies };
};
