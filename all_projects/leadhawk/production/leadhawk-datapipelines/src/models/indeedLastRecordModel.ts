import mongoose from "mongoose";

const indeedLastRecordSchema = new mongoose.Schema(
  {
    companyName: { type: String, trim: true },
    searchJobTitle: { type: String, trim: true },
    jobTitle: { type: String, trim: true },
  },
  {
    timestamps: {
      createdAt: "createdDate",
      updatedAt: "lastModifiedDate",
    },
  }
);

export const IndeedLastRecordModel = mongoose.model(
  "indeedLastData",
  indeedLastRecordSchema
);
