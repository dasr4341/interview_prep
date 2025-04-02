import { config } from './config';

export const message = {
  required: (field: string) => `Please enter ${field}`,
  wrongPattern: (field: string) => `Invalid ${field}`,
  verification: (field: string) => `Please verify your ${field}`,
  wrongInput: (field: string) => `Please check your ${field}`,
  dealerDetailsNotFound: () => 'Dealer details not found',
  failedToFetch: 'Failed to fetch',
  inValidFileUpload: 'Please select file to upload !',
  wrongUrl: 'You have visited wrong url',
  fileNotSelected: 'File not selected',
  noLeadFound: 'No leads found !!',
  notFound: (name: string) => ` ${name} is missing !!`,
  noDocumentsFound: 'No documents uploaded',
  successDelete: (name: string) => `${name} deleted successfully`,
  customMessage: (msg: string) => `${msg}`,
  zeroValue: (name: string) => `${name} cannot be zero`,
  maxAllowedFiles: (maxAllowed?: number) =>
    `Maximum allowed number of files is ${maxAllowed || config.app.maxAllowedFiles}`,
  loggedOut: 'Logout successfully',
};
