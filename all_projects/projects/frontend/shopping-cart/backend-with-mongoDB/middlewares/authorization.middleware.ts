import { Request, Response, NextFunction } from "express";

export const authorization = async (req: Request,res: Response,next: NextFunction ) => {
	console.log("Request -->", req.body);
	next();
};
