import { gql } from "apollo-server";

export const typeDefs = gql`
  type Post {
    id: ID
    title: String!
    img: String!
    body: String!
  }
  type User {
    _id: ID
    name: String
    email: String
    phone: String
    password: String
  }
  type Query {
    getAllPost: [Post]
    getAllUser: [User]
  }
  type Mutation {
    createPost(postData: createPostInput!): Post
    deletePost(postId: ID): String
    signUpUser(signUpUserData: signUpUserInput!): User
    signInUser(signInUserData: signInUserInput!): Token
  }
  type Token {
    token: String
  }
  input createPostInput {
    title: String!
    img: String!
    body: String!
  }
  input signUpUserInput {
    name: String
    email: String
    phone: String
    password: String
  }
  input signInUserInput{
    email: String
    password: String
  }
`;
