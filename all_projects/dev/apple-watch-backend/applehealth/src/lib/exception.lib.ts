import { ExceptionType } from '../enums/exception.enum.js';

export default class Exception extends Error {
  code: number;
  data: any;
  type: ExceptionType;

  constructor(message: string, code: number, data: any, type: ExceptionType) {
    super(message);
    this.message = message;
    this.code = code;
    this.data = data;
    this.type = type;
  }
}
