import React from 'react';
import { Route } from 'react-router-dom';
import routes from 'Lib/Routes/Routes';

const PostList = React.lazy(() => import('Page/Dashboard/Post/PostList/PostList'));
const PostDetails = React.lazy(() => import('Page/Dashboard/Post/PostDetails/PostDetails'));

export const PostRoutes = [
  <Route key='PostRoutes'>
    <Route path={routes.dashboard.children.postList.path} element={<PostList />} />
    <Route path={routes.dashboard.children.post.path} element={<PostDetails />} />
  </Route>,
];
