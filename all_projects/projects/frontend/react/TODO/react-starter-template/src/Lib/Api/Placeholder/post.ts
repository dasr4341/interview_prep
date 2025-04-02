import axios from 'axios';
import queryString from 'query-string';
import { PostQuery } from '../../Store/Post/Post.query.interface';

export interface Post {
  userId: number,
  id: number,
  title: string,
  body: string;
}

const http = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com'
});


const postApi = {
  getPostList: async (postQuery?: PostQuery): Promise<Post[]> => {
    const { data } = await http.get(`/posts?${postQuery ? queryString.stringify(postQuery) : { _limit: 10 }}`);
    return data as Post[];
  },
  getPost: async (id: string) => {
    const { data } = await http.get(`/posts/${id}`);
    return data as Post;
  }
};

export default postApi;
