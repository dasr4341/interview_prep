export const messageGenerators = {
  required: (field: string) => `${field} required`,
  wrongPattern: (field: string) => `invalid ${field}`,
  verification: (field: string) => `Please verify your ${field.toLowerCase()}`,
  wrongInput: (field: string) => `Please check your ${field.toLowerCase()}`,
  phoneIsRequired: 'Please enter phone number to continue',
  phoneShouldBeValid: 'Phone number must be exactly 10 digits',
  loginRedirect: 'Login required. Kindly log in to proceed.',
  successMessage: (message: string) => `${message} successfully`,
  noChanges: 'No changes were made',
  failedToFetch: 'Failed to fetch',
};
