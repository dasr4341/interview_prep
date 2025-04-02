import { ApolloClient, from, InMemoryCache } from '@apollo/client';
import { BatchHttpLink } from '@apollo/client/link/batch-http';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { config } from './config';
import version from './version.json';
import eventEm from 'event-emitter';
import { extendedTypes, typePolicies } from 'graphql/extend-graphql-schema';
import { resetState } from 'lib/api/users';
import * as Sentry from '@sentry/react';
import { getAppData } from 'lib/set-app-data';


export const eventEmitter = eventEm();

const httpLink = new BatchHttpLink({
  uri: config.pretaa.apiURL,
  batchMax: process.env.NODE_ENV === 'development' ? 4 : 5,
  batchInterval: 400,
  batchDebounce: true,
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('token');
  const appData =  getAppData();
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const customHeaders =  {
    ...headers,
    authorization: token ? `Bearer ${token}` : '',
    timezone: timezone,
    appVersion: version.version,
    appType: 'web',
  };

  if (appData && appData.selectedRole) {
    customHeaders.selectedRole = appData.selectedRole;
  }

  if (appData && appData.selectedFacilityId) {
    customHeaders.selectedFacilityId = JSON.stringify(appData.selectedFacilityId);
  }
  
  return {
    headers: {
      ...headers,
      ...customHeaders
    },
  };
});

const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  const appData = getAppData();
  if (graphQLErrors) {
    if (!networkError) {
      Sentry.withScope(scope => {
        Sentry.captureMessage(`API error: ${operation.operationName}`);
        scope.setExtra('API_ERROR', `${JSON.stringify(graphQLErrors)}`);
        scope.setExtra('API_PAYLOAD', ` ${JSON.stringify(operation.variables)}`);
        scope.setExtra('SELECTED_FACILITY', `${JSON.stringify(appData.selectedFacilityId)}`);
        scope.setExtra('SELECTED_ROLE', `${JSON.stringify(appData.selectedRole)}`);
      });
      
    }
    
    graphQLErrors.forEach(({ message, extensions }: { message: string; extensions: any }) => {
      if (extensions.code === 'FORBIDDEN' && operation.operationName !== 'HealthLogin') {
        eventEmitter.emit(config.emitter.forBidden);
      }

      if (message.includes('Token incorrect') || extensions.code === 'UNAUTHENTICATED') {
        eventEmitter.emit(config.emitter.tokenIncorrect);
        resetState();
      }
    });
    forward(operation);
  }


  if (networkError) {
    if (networkError.message.includes('Failed to fetch')) {
      eventEmitter.emit(config.emitter.api_server_down);
    }
    console.log('client error', networkError.message);
  }
});

export const client = new ApolloClient({
  link: from([errorLink, authLink.concat(httpLink)]),
  uri: config.pretaa.apiURL,
  typeDefs: extendedTypes,
  cache: new InMemoryCache({
    addTypename: false,
    typePolicies: typePolicies,
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
