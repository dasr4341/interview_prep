import React from 'react';
import { Route } from 'react-router-dom';
import { postRoutes } from 'Lib/Routes/PostRoutes';

const PostList = React.lazy(() => import('Page/Dashboard/Post/PostList/PostList'));
const PostDetails = React.lazy(() => import('Page/Dashboard/Post/PostDetails/PostDetails'));

export const PostRoutes = [
  <Route key='PostRoutes'>
    <Route path={postRoutes.list.path} element={<PostList />} />
    <Route path={postRoutes.post.path} element={<PostDetails />} />
  </Route>,
];
