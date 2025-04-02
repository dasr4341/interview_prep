import mongoose from "mongoose";

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

export const Cookie = mongoose.model(
  "LinkedInCookie",
  cookieSchema,
  "LinkedInCookie"
);
