import mongoose from "mongoose";

const formDsLastResSchema = new mongoose.Schema(
  {
    companyName: { type: String, trim: true },
    investmentFund: { type: String, trim: true },
  },
  {
    timestamps: {
      createdAt: "createdDate",
      updatedAt: "lastModifiedDate",
    },
  }
);

export const FormDsLastResModel = mongoose.model(
  "formDsLastData",
  formDsLastResSchema
);
