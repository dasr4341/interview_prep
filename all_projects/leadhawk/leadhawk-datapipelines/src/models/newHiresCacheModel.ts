import { Schema, model } from "mongoose";

const newHiresCacheSchema = new Schema(
  {
    description: { type: String, trim: true },
    jobStarterName: { type: String, trim: true },
    companyName: { type: String, trim: true },
    currentRole: { type: String, trim: true },
    classification: { type: String, trim: true },
  },
  {
    timestamps: {
      createdAt: "createdDate",
      updatedAt: "lastModifiedDate",
    },
  }
);

export const NewHiresCacheModel = model<typeof newHiresCacheSchema>(
  "newHiresCacheData",
  newHiresCacheSchema,
  "NewHiresCacheData"
);
