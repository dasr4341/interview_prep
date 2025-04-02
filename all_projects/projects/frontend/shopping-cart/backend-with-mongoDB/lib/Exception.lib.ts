export class Exception extends Error {
  status: number;
  // rome-ignore lint/suspicious/noExplicitAny: <explanation>
  data: any;

  // rome-ignore lint/suspicious/noExplicitAny: <explanation>
  constructor(message: string, statusCode: number, data: any) {
    super(message);
    this.status = statusCode;
    this.data = data;
  }
}
