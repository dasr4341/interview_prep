import queryString from 'query-string';

export const routes = {
  compilationList: {
    path: '/',
    build: (query: { newCompilation: boolean } ) => `?${queryString.stringify(query ? query : { })}`,
  },
  tilesList: {
    absolutePath: 'tiles-list/',
    path: 'tiles-list/:id',
    build: (id: number | string, query?: { newTitles?: boolean } ) => `tiles-list/${id}?${queryString.stringify(query ? query : { })}`,
  },
  videoList: {
    path: 'video-list',
  },
  login: {
    path: '/login'
  }
};

export default routes;
