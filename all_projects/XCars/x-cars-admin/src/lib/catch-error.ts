/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApolloError } from '@apollo/client';
import { GraphQLError } from 'graphql';
import { toast } from 'react-toastify';

export function getGraphError(errors: readonly GraphQLError[]) {
  const messages: Array<string> = [];
  errors.forEach((err) => messages.push(err.message));
  return messages;
}

export default function catchError(error: unknown, notification?: boolean) {
  console.log(JSON.stringify(error));
  let errorMessage = '';

  if (error instanceof Error) {
    errorMessage = error.message;
  } else if (error instanceof ApolloError) {
    errorMessage = getGraphError(error.graphQLErrors as any).join(',');
  }

  if (notification) {
    toast.error(errorMessage, { toastId: errorMessage.split(' ').join('_') });
  } else {
    console.error(errorMessage);
  }
  return errorMessage;
}
