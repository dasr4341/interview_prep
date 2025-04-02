import { gql } from "@apollo/client";

export const GET_ALL_POST = gql`
  query {
    getAllPost {
      id
      img
      title
      body
    }
  }
`;