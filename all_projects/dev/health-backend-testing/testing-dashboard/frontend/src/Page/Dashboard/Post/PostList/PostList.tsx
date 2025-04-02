/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import queryString from 'query-string';

import { useAppSelector } from 'Lib/Store/hooks';
import { postSliceActions } from 'Lib/Store/Post/Post.slice';
import { PostListRouteQuery, postRoutes } from 'Lib/Routes/PostRoutes';
import { Button, Menu } from '@mantine/core';

export default function PostListPage() {
  const dispatch = useDispatch();
  const postLists = useAppSelector((state) => state.post.posts);
  const [page, setPage] = useState(1);
  const location = useLocation();

  useEffect(() => {
    const q: PostListRouteQuery = queryString.parse(location.search);

    if (q.page) {
      setPage(+q.page);
      dispatch(postSliceActions.getPosts({ _page: +q.page, _limit: 10 }));
    } else {
      dispatch(postSliceActions.getPosts({ _limit: 10 }));
    }
  }, [location.search]);

  return (
    <div>
      <table className='table p-4 bg-white shadow rounded-lg w-full text-left'>
        <thead>
          <tr>
            <th
              className='border-b-2 p-4 dark:border-dark-5 whitespace-nowrap font-normal text-gray-900'
              style={{ width: '100px' }}>
              ID
            </th>
            <th className='border-b-2 p-4 dark:border-dark-5 whitespace-nowrap font-normal text-gray-900'>
              Title
            </th>
            <th
              className='border-b-2 p-4 dark:border-dark-5 whitespace-nowrap font-normal text-gray-900'
              style={{ width: '100px' }}>
              #
            </th>
          </tr>
        </thead>
        <tbody>
          {postLists.map((post) => {
            return (
              <tr
                className='text-gray-700'
                key={post.id}>
                <td className='border-b-2 p-4 dark:border-dark-5'>{post.id}</td>
                <td className='border-b-2 p-4 dark:border-dark-5'>
                  <Link
                    className='text-blue-400 hover:text-gray-700'
                    to={postRoutes.post.fullPath({ postId: post.id })}>
                    {post.title}
                  </Link>
                </td>
                <td className='border-b-2 p-4 dark:border-dark-5'>
                  <Menu
                    shadow='md'
                    position='right-start'
                    width={200}>
                    <Menu.Target>
                      <Button variant='subtle'>...</Button>
                    </Menu.Target>

                    <Menu.Dropdown>
                      <Link to={postRoutes.post.fullPath({ postId: post.id })}>
                        <Menu.Item>Edit</Menu.Item>
                      </Link>
                    </Menu.Dropdown>
                  </Menu>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className='px-5 bg-white py-5 flex flex-col xs:flex-row items-center xs:justify-between'>
        <div className='flex items-center'>
          <Link to={postRoutes.list.build({ page: page + -1 })}>
            <button
              type='button'
              className='w-full p-4 border text-base rounded-l-xl text-gray-600 bg-white hover:bg-gray-100'>
              <svg
                width='9'
                fill='currentColor'
                height='8'
                className=''
                viewBox='0 0 1792 1792'
                xmlns='http://www.w3.org/2000/svg'>
                <path d='M1427 301l-531 531 531 531q19 19 19 45t-19 45l-166 166q-19 19-45 19t-45-19l-742-742q-19-19-19-45t19-45l742-742q19-19 45-19t45 19l166 166q19 19 19 45t-19 45z'></path>
              </svg>
            </button>
          </Link>
          <div
            style={{ minWidth: '100px' }}
            className='text-center'>
            Page: {page}
          </div>

          <Link to={postRoutes.list.build({ page: page + 1 })}>
            <button
              type='button'
              className='w-full p-4 border-t border-b border-r text-base  rounded-r-xl text-gray-600 bg-white hover:bg-gray-100'>
              <svg
                width='9'
                fill='currentColor'
                height='8'
                className=''
                viewBox='0 0 1792 1792'
                xmlns='http://www.w3.org/2000/svg'>
                <path d='M1363 877l-742 742q-19 19-45 19t-45-19l-166-166q-19-19-19-45t19-45l531-531-531-531q-19-19-19-45t19-45l166-166q19-19 45-19t45 19l742 742q19 19 19 45t-19 45z'></path>
              </svg>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
