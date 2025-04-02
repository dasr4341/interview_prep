import axios from 'axios';

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
  getPostList: async (): Promise<Post[]> => {
    const { data } = await http.get('/posts');
    return data as Post[];
  },
  getPost: async (id: string) => {
    const { data } = await http.get(`/posts/${id}`);
    return data as Post;
  }
};

export default postApi;
