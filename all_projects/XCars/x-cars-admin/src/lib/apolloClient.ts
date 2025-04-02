/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ApolloClient,
  ApolloLink,
  FetchResult,
  HttpLink,
  InMemoryCache,
  Observable,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { getAppData, setAppData } from './appData';
import { config } from '@/config/config';
import { onError } from '@apollo/client/link/error';
import eventEm from 'event-emitter';
import { message } from '@/config/message';
import { removeTypenameFromVariables } from '@apollo/client/link/remove-typename';
import { uploadDealerDocumentQuery } from '@/graphql/uploadDocument.mutation';
import { uploadCarGalleryDocumentsQuery } from '@/graphql/uploadCarGalleryDocuments.mutation';
import { uploadCarProductsQuery } from '@/graphql/carProducts.mutation';
import { GET_ACCESS_TOKEN } from '@/graphql/getNewToken.mutation';
import { GraphQLError } from 'graphql';
import setCookie from '@/components/Forms/login/setCookie';

export const eventEmitter = eventEm();
const MAX_RETRIES = 1;

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
  const formData = new FormData();
  const { files, ...otherVariables } = operation.variables;

  // ------------------ video(mp4) upload -------------------------------------
  if (
    operation.variables.files &&
    operation.variables.carId &&
    operation.variables.amount
  ) {
    formData.append(
      'operations',
      JSON.stringify({
        query: uploadCarProductsQuery,
        variables: {
          files: new Array(files.length).fill(null),
          ...otherVariables,
        },
      })
    );
  } else if (operation.variables.files && operation.variables.carId) {
    formData.append(
      'operations',
      JSON.stringify({
        query: uploadCarGalleryDocumentsQuery,
        variables: {
          files: new Array(files.length).fill(null),
          ...otherVariables,
        },
      })
    );
  } else if (operation.variables.files) {
    // ------------------ documents (png, jpg, pdf) upload -------------------------------------
    formData.append(
      'operations',
      JSON.stringify({
        query: uploadDealerDocumentQuery,
        variables: {
          files: new Array(files.length).fill(null),
          ...otherVariables,
        },
      })
    );
  }

  // -------------------------------------------------------
  // execute the upload process
  // -------------------------------------------------------
  if (operation.variables.files) {
    const mappedData = files.map((data: File, i: number) => {
      return [`variables.files.${i}`];
    });

    // *MAP
    formData.append(
      'map',
      JSON.stringify({
        ...mappedData,
      })
    );

    // IMP: The order matters, *MAP has to be before files
    files.forEach((data: File, i: number) => {
      formData.append(`${i}`, data);
    });

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
  // -------------------------------------------------------
  // -------------------------------------------------------

  return forward(operation);
});

const errorLink = onError(
  ({ graphQLErrors, networkError, operation, forward }) => {
    if (graphQLErrors) {
      for (const { message, extensions } of graphQLErrors) {
        if (
          message.includes('jwt expired') ||
          extensions?.code === 'UNAUTHORIZED'
        ) {
          if (operation.operationName === 'GetNewTokensQuery') return;
          const retryCount = operation.getContext().retryCount || 0;
          if (retryCount >= MAX_RETRIES) {
            console.error(`Max retry attempts (${MAX_RETRIES}) reached.`);
            eventEmitter.emit(config.emitter.tokenIncorrect);
            return;
          }
          operation.setContext({
            ...operation.getContext(),
            retryCount: retryCount + 1,
          });
          return new Observable<FetchResult<Record<string, any>>>(
            (observer) => {
              (async () => {
                try {
                  console.log(
                    `Attempting token refresh (Retry ${retryCount + 1})`
                  );
                  const accessToken = await refreshTokenFun();
                  if (!accessToken) throw new GraphQLError('Empty AccessToken');

                  // retry the failed request
                  operation.setContext({
                    headers: {
                      ...operation.getContext().headers,
                      authorization: `Bearer ${accessToken}`,
                    },
                  });
                  const subscriber = {
                    next: observer.next.bind(observer),
                    error: observer.error.bind(observer),
                    complete: observer.complete.bind(observer),
                  };
                  forward(operation).subscribe(subscriber);
                } catch (error) {
                  observer.error(error);
                }
              })();
            }
          );
        }
      }
    }

    if (networkError) {
      if (networkError.message.includes(message.failedToFetch)) {
        eventEmitter.emit(config.emitter.api_server_down);
      }
      console.log('client error', networkError.message);
    }
  }
);

const removeTypenameLink = removeTypenameFromVariables();

export const client = new ApolloClient({
  link: ApolloLink.from([
    removeTypenameLink,
    authLink,
    errorLink,
    uploadLink,
    httpLink,
  ]),
  cache: new InMemoryCache({
    addTypename: false,
  }),
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

const refreshTokenFun = async () => {
  const { data } = await client.mutate({
    mutation: GET_ACCESS_TOKEN,
    variables: {
      refreshToken: getAppData().refreshToken || '',
    },
  });
  if (data) {
    setAppData({
      token: data.getNewTokens.accessToken,
      refreshToken: data.getNewTokens.refreshToken,
    });
    setCookie('authToken__admin', data.getNewTokens.accessToken);
  }
  return data?.getNewTokens.accessToken;
};
