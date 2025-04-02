import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
  Observable,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { getAppData } from './appData';
import { config } from '@/config/config';
import { onError } from '@apollo/client/link/error';
import eventEm from 'event-emitter';

export const eventEmitter = eventEm();

const httpLink = new HttpLink({
  uri: config.app.baseUrl,
});

const authLink = setContext((_, { headers }) => {
  const token = getAppData().token;
  return {
    headers: {
      ...headers,
      app: config.app.applicationType,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const uploadLink = new ApolloLink((operation, forward) => {
  if (operation.variables.files) {
    const { files, ...otherVariables } = operation.variables;

    const formData = new FormData();
    formData.append(
      'operations',
      JSON.stringify({
        query: `
            mutation AddDealerDocument(
            $files: [Upload!]!
            $fileName: String!
            $uploadCategory: FileType!
            $userId: String!
          ) {
            addDealerDocument(
              files: $files
              fileName: $fileName
              uploadCategory: $uploadCategory
              userId: $userId
            ) {
              success
            }
          }`,
        variables: {
          files: null,
          ...otherVariables,
        },
      })
    );
    formData.append('map', JSON.stringify({ files: ['variables.files'] }));
    formData.append('files', files);

    return new Observable((observer) => {
      const token = getAppData().token;

      fetch(config.app.baseUrl as string, {
        method: 'POST',
        body: formData,
        headers: {
          app: config.app.applicationType,
          authorization: token ? `Bearer ${token}` : '',
        },
      })
        .then((response) => response.json())
        .then((result) => {
          operation.setContext({ response: result });
          observer.next(result);
          observer.complete();
        })
        .catch((error) => {
          observer.error(error);
        });
    });
  }

  return forward(operation);
});

const errorLink = onError(({ graphQLErrors, operation, forward }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, extensions }) => {
      // TODO
      if (
        message.includes('jwt expired') ||
        extensions?.code === 'UNAUTHORIZED'
      ) {
        eventEmitter.emit(config.emitter.tokenIncorrect);
      }
    });
    forward(operation);
  }
});

export const client = new ApolloClient({
  link: ApolloLink.from([authLink, errorLink, uploadLink, httpLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    query: {
      fetchPolicy: 'network-only',
    },
    mutate: {
      fetchPolicy: 'network-only',
    },
    watchQuery: {
      fetchPolicy: 'network-only',
    },
  },
});
