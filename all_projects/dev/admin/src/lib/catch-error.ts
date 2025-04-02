import { GraphQLError } from 'graphql';
import { toast } from 'react-toastify';

export default function catchError(
  error: unknown,
  notification?: boolean,
) {
  if (notification) {
    if (error instanceof Error) {
      toast.error(error.message);
    }
  } else {
  const e = error as Error;
    console.error(e);
  }
}

export  function getError(
  error: unknown
) {
  if (error instanceof Error) {
    return error.message;
  }
  return null;
}

export function getGraphError(errors: readonly GraphQLError[]) {
  const messages: Array<string> = [];
  errors.forEach(err => messages.push(err.message));
  return messages;
}
