import express from "express";
import { get, merge } from 'lodash';
import { userServices } from '../services/userServices';
import { config } from "../config/config.js";
import { Exception } from "../exception/Exception.js";
import { messageData } from "../config/message.js";
import { StatusCodes } from 'http-status-codes';


export const isAuthenticated =  async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const sessionToken = req.cookies[config.sessionToken];
        if (!sessionToken) {
            throw new Exception(messageData.tokenNotFound, {}, StatusCodes.FORBIDDEN);
        }

        const existingUser = await userServices.getUserBySessionToken(sessionToken);
        if (!existingUser._id) {
            throw new Exception(messageData.userNotFound, {}, StatusCodes.FORBIDDEN);
        }

        merge(req, { identity: existingUser });
        next();
        
    } catch (error) {
        next(error);
    }
}

