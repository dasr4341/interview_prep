import { ApolloClient, from, InMemoryCache, gql } from '@apollo/client';
import { BatchHttpLink } from '@apollo/client/link/batch-http';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { config } from './config';
import version from './version.json';
import eventEm  from 'event-emitter';

export const eventEmitter = eventEm();

const typeDefs = gql`
  extend type User {
    clientField: Boolean
  }
`;

const httpLink = new BatchHttpLink({
  uri: localStorage.getItem('API_URL') || config.pretaa.apiURL,
  batchMax: 5,
  batchInterval: 100,
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('token');
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
      timezone: timezone,
      appVersion: version.version,
      appType: 'web'
    },
  };
});

const errorLink = onError(({ operation, graphQLErrors, networkError }) => {
  console.log(operation);
  if (graphQLErrors) {
    console.log('GraphQl operation:', operation);
    console.error('GraphQl Error:', graphQLErrors);

    graphQLErrors.map(({ message, extensions }: { message: string; extensions: any }) => {
      if (extensions.code === 'FORBIDDEN') {
        eventEmitter.emit(config.emitter.forBidden);
      }

      if (message.includes('Token incorrect') || extensions.code === 'UNAUTHENTICATED') {
        eventEmitter.emit(config.emitter.tokenIncorrect);
      }
    });
  }
  if (networkError) {
    console.error('Network Error:', networkError);
  }
});

export const client = new ApolloClient({
  link: from([errorLink, authLink.concat(httpLink)]),
  uri: config.pretaa.apiURL,
  cache: new InMemoryCache({
    typePolicies: {
      User: {
        fields: {
          isInCart: {
            read() {
              return false;
            },
          },
        },
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
      errorPolicy: 'ignore',
    },
    query: {
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    },
  },
  typeDefs
});
