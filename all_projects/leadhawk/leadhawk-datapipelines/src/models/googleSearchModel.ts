import { Schema, model } from 'mongoose';

const googleSearchSchema = new Schema(
  {
    query: { type: String, trim: true, required: true },
    linkedInUrl: { type: String, trim: true },
    scrapeCompanyName: { type: String, trim: true },
  },
  {
    timestamps: {
      createdAt: "createdDate",
      updatedAt: "lastModifiedDate",
    },
  }
);

export const GoogleSearchModel = model<typeof googleSearchSchema>(
  "googleSearchResult",
  googleSearchSchema,
  "GoogleSearchResult"
);
