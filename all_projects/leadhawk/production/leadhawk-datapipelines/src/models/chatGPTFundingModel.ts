import { Schema, model } from 'mongoose';

const chatGPTFundingModel = new Schema(
  {
    Text: { type: String, trim: true, required: true },
    result: {
      companyName: { type: String, trim: true },
      fundingRaised: { type: Number },
    },
  },
  {
    timestamps: {
      createdAt: "createdDate",
      updatedAt: "lastModifiedDate",
    },
  }
);

export const ChatGPTFundingModel = model<typeof chatGPTFundingModel>(
  "chatGPTFundingModel",
  chatGPTFundingModel,
  "ChatGPTFundingModel"
);
