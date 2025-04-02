import mongoose from "mongoose";
import type { ICookie } from "../interface/cookie.interface.js";

const cookieSchema = new mongoose.Schema(
  {
    name: String,
    value: String,
    domain: String,
    path: String,
    secure: Boolean,
    httpOnly: Boolean,
    sameSite: String,
    expirationDate: Number,
  },
  {
    timestamps: {
      createdAt: "createdDate",
      updatedAt: "lastModifiedDate",
    },
  }
);

// linkedInJobPostSchema.add(linkedInSchema.obj);
export const Cookie = mongoose.model<ICookie>(
  "LinkedInCookie",
  cookieSchema,
  "LinkedInCookie"
);
