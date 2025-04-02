import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "./config.js";
import { GraphQLError } from "graphql";
import { UserInputError } from "apollo-server";
// import { fakePosts } from "./fakeDb.js";

// using model
const postModel = mongoose.model("Post");
const userModel = mongoose.model("User");

export const resolvers = {
  Query: {
    getAllPost: async () => {
      return await postModel.find({});
    },
    getAllUser: async () => await userModel.find({}),
  },
  Mutation: {
    createPost: async (_, { postData }) => {
      const id = Math.floor(Math.random(5) * 100);
      const newPost = new postModel({ id, ...postData });
      const result = newPost.save();
      return result;
    },
    deletePost: async (_, { postId }) => {
      const { deletedCount } = await postModel.deleteOne({ id: postId });
      if (deletedCount) return " Deleted successfully !";
      if (!deletedCount) return "Faild,  Try Again !";
    },
    signUpUser: async (_, { signUpUserData }) => {
      // check the user exist or not
      const userExist = await userModel.findOne({
        email: signUpUserData.email,
      });
      if (userExist) {
        throw new UserInputError("User already exist !");
      }
      const hashedPassword = await bcrypt.hash(signUpUserData.password, 12);
      const newUser = new userModel({
        ...signUpUserData,
        password: hashedPassword,
      });
      return newUser.save();
    },
    signInUser: async (_, { signInUserData }) => {
      // check user exist or not
      const userExist = await userModel.findOne({
        email: signInUserData.email,
      });
      if (!userExist) {
        throw new Error("User does not exist");
      }
      const passwordDoMatch = await bcrypt.compare(
        signInUserData.password,
        userExist.password
      );
      if (!passwordDoMatch) {
        throw new Error("Password do not matched !");
      }
      // signing ....
      const token = jwt.sign(
        {
          user: {
            id: userExist._id,
            email: userExist.email,
          },
        },
        config.JWT_SECRET_KEY,
        { expiresIn : '1d'}
      );
      return { token };
    },
  },
};