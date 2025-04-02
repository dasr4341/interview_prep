import queryString from 'query-string';
import { PostListRouteQuery, PostRouteParams } from './routes.interface';

export const routes = {
  home: {
    path: '/',
  },
  login: {
    path: '/login'
  },
  forgetPassword: {
    path: '/forget-password'
  },
  register: {
    path: '/register'
  },
  app: {
    path: '/app',

    children: {
      me: {
        path: '/app/me',
        fullPath: '/app/me'
      }
    }
  },
  dashboard: {
    path: '/dashboard',

    children: {
      me: {
        path: 'me',
        fullPath: '/dashboard/me'
      },
      postMatchingPath: '/dashboard/post',
      postList: {
        path: 'post-list',
        fullPath: '/dashboard/post-list',
        build: (query: PostListRouteQuery ) => `/dashboard/post-list?${queryString.stringify(query)}`,
      },
      post: {
        path: 'post/:postId',
        fullPath: ({ postId }: PostRouteParams ) => `/dashboard/post/${postId}`
      },
      todo: {
        path: 'todo',
        fullPath: '/dashboard/todo'
      }
    },
  }

};

export default routes;
