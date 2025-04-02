import mongoose from "mongoose";

export const linkedInSchema = new mongoose.Schema({
  companyName: { type: String, trim: true, required: true },
  rawIndustry: { type: String, trim: true },
  industry: { type: String, trim: true },
  companyWebsite: { type: String, trim: true },
  companySize: { type: String, trim: true },
  companyEmployeeCount: { type: Number, trim: true },
  specialties: { type: String, trim: true },
  companyLinkedIn: { type: String, trim: true },
  googleSearchCompany: { type: String, trim: true },
  companyHQ: { type: String, trim: true },
  scrappedCompanyHQ: { type: String, trim: true },
  companyCity: { type: String, trim: true },
  country: { type: String, trim: true },
}, {
  timestamps: {
    createdAt: "createdDate",
    updatedAt: "lastModifiedDate",
  },
});

export const linkedInDataModel = mongoose.model<typeof linkedInSchema>(
  "linkedInData",
  linkedInSchema,
  "LinkedInData"
);
