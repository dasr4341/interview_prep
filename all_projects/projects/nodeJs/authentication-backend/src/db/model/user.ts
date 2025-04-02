import { Schema, model } from "mongoose";
import { UserSchemaInterface } from "../interface/user.interface.js";

const userSchema = new Schema<UserSchemaInterface>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  authentication: {
    password: {
      type: String,
      required: true,
      select: false,
    },
    salt: {
      type: String,
      select: false,
    },
    sessionToken: {
      type: String,
      select: false,
    },
  },
});

// Create a Model.
export const UserModel = model<UserSchemaInterface>('User', userSchema);
