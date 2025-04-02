import { Schema, model } from "mongoose";

const unlistedJobTitleSchema = new Schema({
  jobTitle: { type: String, trim: true, required: true },
});

export const unlistedJobTitleModel = model<typeof unlistedJobTitleSchema>(
  "unlistedJobTitle",
  unlistedJobTitleSchema,
  "UnlistedJobTitle"
);
