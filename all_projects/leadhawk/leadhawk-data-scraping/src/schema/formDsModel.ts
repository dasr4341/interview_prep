import mongoose from "mongoose";

const formDsDataSchema = new mongoose.Schema(
  {
    company: { type: String, trim: true, required: true },
    fillingsRecordUrl: { type: String, trim: true, required: true },
    inverstmentType: { type: String, trim: true, required: true },
    linkedinUrl: { type: String, trim: true },
    fundingRaised: { type: String, trim: true },
  },
  { timestamps: true }
);

export const formDsDataModel = mongoose.model("formDsData", formDsDataSchema);
