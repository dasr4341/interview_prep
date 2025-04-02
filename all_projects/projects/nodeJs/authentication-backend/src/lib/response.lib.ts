import { StatusCodes } from "http-status-codes";
import { Exception } from "../exception/Exception.js";
import { Response } from 'express';

export const responseLib = {
    success: (res: Response, info: { status: StatusCodes, message: string, data: any }) => {
        return res.status(info.status).json({
            success: true,
            message: info.message,
            data: info.data,
          });
    },
    error: (res: Response, error: Exception,) => {
        return res.status(error.status).json({
            success: false,
            message: error.message,
            data: error.data,
          });
    }
}