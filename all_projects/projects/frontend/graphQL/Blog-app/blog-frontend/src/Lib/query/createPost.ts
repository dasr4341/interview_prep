import { gql } from '@apollo/client';

export const CREATE_POST_MUTATION = gql`
  mutation createPost($postData: createPostInput!) {
    post: createPost(postData: $postData) {
      title
    }
  }
`;