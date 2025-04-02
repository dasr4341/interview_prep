import { dashboardRoutes } from './DashboardRoutes';
import queryString from 'query-string';

export interface PostRouteParams { 
  postId: string | number
}

export interface PostListRouteQuery { 
  page?: number | string;
}


export const postRoutes = {
  postMatchingPath: `${dashboardRoutes.path}/post`,
  list: {
    path: 'post-list',
    fullPath: `${dashboardRoutes.path}/post-list`,
    build: (query: PostListRouteQuery) =>
      `${dashboardRoutes.path}/post-list?${queryString.stringify(query)}`,
  },
  post: {
    path: 'post/:postId',
    fullPath: ({ postId }: PostRouteParams) => `${dashboardRoutes.path}/post/${postId}`,
  },
};