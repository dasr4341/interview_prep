export default class ValidationError extends Error {
  status: number;

  data: any;

  constructor(message: string, status: number, data: any) {
    super(message);
    this.message = message;
    this.status = status;
    this.data = data;
  }
}
