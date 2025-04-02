import { ApolloError } from '@apollo/client';
import { GraphQLError } from 'graphql';
import { toast } from 'react-toastify';
import * as Sentry from '@sentry/react';
import { getAppData } from './set-app-data';

export function sentryCaptureMessage(
  message: string
) {
  const appData = getAppData();

  Sentry.withScope(scope => {
    scope.setExtra('SELECTED_FACILITY', `${JSON.stringify(appData.selectedFacilityId)}`);
    scope.setExtra('SELECTED_ROLE', `${JSON.stringify(appData.selectedRole)}`);
    Sentry.captureMessage(message);
  });
}

export function sentryErrorCatch(error: any) {
  Sentry.captureMessage(error?.message);
  Sentry.captureException(error);
}

export default function catchError(error: unknown, notification?: boolean) {
  console.log(JSON.stringify(error));
  let errorMessage = '';

  if (error instanceof Error) {
    errorMessage = error.message;
  } else if (error instanceof ApolloError) {
    errorMessage = getGraphError(error.graphQLErrors).join(',');
  }

  if (notification) {
    toast.error(errorMessage, { toastId: errorMessage.split(' ').join('_') });
  } else {
    console.error(errorMessage);
    Sentry.captureMessage('API error not handled from UI side');
  }
  return errorMessage;
}

export function getError(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }
  return null;
}

export function getGraphError(errors: readonly GraphQLError[]) {
  const messages: Array<string> = [];
  errors.forEach((err) => messages.push(err.message));
  return messages;
}
