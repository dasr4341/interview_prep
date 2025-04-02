const graphql_url =  process.env.REACT_APP_PRETAA_API_URL
? process.env.REACT_APP_PRETAA_API_URL + '/graphql'
: 'https://pretaa-health-dev.x-studio.io/graphql';

console.log('Graphql URL:', graphql_url );

module.exports = {
  client: {
    incudes: ['./src/graphql/*.ts'],
    excludes: [],
    service: {
      url: graphql_url,
    },
  },
};
