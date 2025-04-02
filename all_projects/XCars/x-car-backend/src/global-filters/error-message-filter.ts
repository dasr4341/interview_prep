const ErrorMessage = {
  notFound: (field: string) => `${field} not found`,
  alreadyExists: (field: string) => `${field} already exists`,
  alreadyActive: (field: string) => `${field} already active`,
  notEditable: (field: string) => `${field} not editable`,
  tryAgain: (field: string) => `Try again with ${field}`,
  invalid: (field: string) => `Invalid ${field}`,
  pending: (field: string) => `Pending for ${field}`,
  serverError: (field: string) => field ?? 'INTERNAL SERVER ERROR',
  canNotSame: (field1: string, field2: string) =>
    `${field1} and ${field2} can not be same`,
  failed: (field: string) => `Failed to ${field}`,
  custom: (field: string) => field,
  notApproved: (field: string) => `${field} not approved`,
  disabled: (field: string) => `${field} disabled`,
  expired: (field: string) => `${field} expired`,
};
export default ErrorMessage;
