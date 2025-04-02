import { Schema, model } from 'mongoose';

const chatGPTNewsModel = new Schema(
  {
    Text: { type: String, trim: true, required: true },
    result: {
      companyName: { type: String, trim: true },
    },
  },
  {
    timestamps: {
      createdAt: "createdDate",
      updatedAt: "lastModifiedDate",
    },
  }
);

export const ChatGPTNewsModel = model<typeof chatGPTNewsModel>(
  "chatGPTNewsModel",
  chatGPTNewsModel,
  "ChatGPTNewsModel"
);
