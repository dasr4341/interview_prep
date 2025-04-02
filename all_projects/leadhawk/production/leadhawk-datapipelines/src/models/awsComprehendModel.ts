import { Schema, model } from 'mongoose';

const awsComprehendSchema = new Schema(
  {
    Text: { type: String, trim: true, required: true },
    companyName: { type: String, trim: true },
  },
  {
    timestamps: {
      createdAt: "createdDate",
      updatedAt: "lastModifiedDate",
    },
  }
);

export const AWSComprehendModel = model<typeof awsComprehendSchema>(
  "aWSComprehendResult",
  awsComprehendSchema,
  "AWSComprehendResult"
);
