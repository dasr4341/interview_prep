export enum ExceptionType {
  VALIDATION = "validation",
  HTTP = "http",
}

export class Exception extends Error {
  errorCode: number;
  exceptionType: ExceptionType;
  data: any;
    
  constructor(
    message: string,
    errorCode: number,
    exceptionType: ExceptionType,
    data?: any
  ) {
    super(message);
    this.message = message;
    this.errorCode = errorCode;
    this.exceptionType = exceptionType;
    this.data = data;
  }
}
