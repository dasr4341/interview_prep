import type { CodeFlowType } from "../enums/codeFlowType.js";
import type { IBusinessAndPRNews } from "./businessAndprNews.interface.js";
import type { IFormDs } from "./formDs.interface.js";
import type { IIndeed } from "./indeed.interface.js";
import type { INewHires } from "./newHires.interface.js";

export interface IGoogleSearch
  extends Partial<Omit<IFormDs, "companyName">>,
    Partial<Omit<IIndeed, "companyName">>,
    Partial<Omit<IBusinessAndPRNews, "companyName">>,
    Partial<Omit<INewHires, "companyName">> {
  linkedInUrl: string | null;
  companyName: string | null;
  scrapeCompanyName: string | null;
}
