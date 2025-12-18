import {FetchBaseQueryError} from '@reduxjs/toolkit/query';

/**
 * Type predicate to narrow an unknown error to `FetchBaseQueryError`
 */
const isFetchBaseQueryError = (
  error: unknown,
): error is FetchBaseQueryError => {
  return typeof error === 'object' && error != null && 'status' in error;
};

/**
 * Type predicate to narrow an unknown error to an object with a string 'message' property
 */
const isErrorWithMessage = (error: unknown): error is {message: string} => {
  return (
    typeof error === 'object' &&
    error != null &&
    'message' in error &&
    typeof (error as any).message === 'string'
  );
};

/**
 *
 * returns array of error messages from backend as string
 */
const ErrorMessageArrayToString = ({message}: {message: string[]}): string => {
  return message.toString();
};

export {ErrorMessageArrayToString, isErrorWithMessage, isFetchBaseQueryError};
