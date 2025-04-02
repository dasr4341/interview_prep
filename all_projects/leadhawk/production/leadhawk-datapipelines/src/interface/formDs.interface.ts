import mongoose from "mongoose";
import type { CodeFlowType } from "../enums/codeFlowType.js";

export interface IFormDs {
  source: CodeFlowType;
  companyName: string | null;
  investmentType: string | null;
  issuerLink: string | null;
  fundingRaised?: number | null;
}

export interface IFromDsLastRecordData {
  recordId: mongoose.Types.ObjectId;
  investmentType: string | null;
  prevCompany: string | null | null;
  currentCompany: string | null;
  status: boolean;
}
