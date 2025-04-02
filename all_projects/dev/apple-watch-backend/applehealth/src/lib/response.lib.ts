import { NextFunction, Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

export const responseLib = {
  success: (res: Response, code: number, message: string, data: any) => {
    return res.status(code).json({
      success: true,
      code,
      message,
      error: '',
      data,
    });
  },

  error: (res: Response, code: number, message: string, error: any, data: any) => {
    return res.status(code ?? StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message,
      error: {
        code: error?.code ?? StatusCodes.INTERNAL_SERVER_ERROR,
        codeName: error?.codeName ?? '',
        message: error?.message ?? ReasonPhrases.INTERNAL_SERVER_ERROR,
        type: error?.type ?? '',
      },
      data,
    });
  },

  authorized: (next: NextFunction) => {
    return next();
  },

  unauthorized: (res: Response) => {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      code: StatusCodes.UNAUTHORIZED,
      message: ReasonPhrases.UNAUTHORIZED,
      error: '',
      data: '',
    });
  },
};
