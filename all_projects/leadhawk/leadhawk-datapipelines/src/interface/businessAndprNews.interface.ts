import type { CodeFlowType } from "../enums/codeFlowType.js";
import type { NewsItem } from "./newsxml.interface.js";

export interface IBusinessAndPRNews {
  trigger: string;
  triggerArticle: string;
  companyName: string;
  source: CodeFlowType;
  publishedDate: Date;
  businesswire?: NewsItem;
  prnewswire?: NewsItem;
}

export interface IScrapPrNews {
  title:string,
  pubDate: string,
  description: string,
  link: string
}