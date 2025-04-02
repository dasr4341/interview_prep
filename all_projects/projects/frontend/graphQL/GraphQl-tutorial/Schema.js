import { gql } from "apollo-server";

const typeDefs = gql`
   type Query{
        getAllUsers:[User]
        userById(_id:ID):User
    }
    type User{
        _id:ID
        name:String
        email:String
        phone:String
        password:String
    }
    type Mutation{
        signUpUser(signUpUserData:UserSignUpInput!):User
        signInUser(signInUserData:UserSignInInput!):Token
    }
    input UserSignUpInput{
        name:String!
        email:String!
        phone:String!
        password:String!
    }
    input UserSignInInput{
        email:String!
        password:String!
    }
    type Token{
        token:String!
    }

`;
export default typeDefs;