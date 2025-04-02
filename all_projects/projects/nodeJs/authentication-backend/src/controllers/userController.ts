import { Request, Response, NextFunction, response } from 'express';
import { userServices } from '../services/userServices.js';
import { authentication, random } from '../helper/authentication.helper.js';
import { Exception } from '../exception/Exception.js';
import { StatusCodes } from 'http-status-codes';
import { messageData } from '../config/message.js';
import { responseLib } from '../lib/response.lib.js';
import { config } from '../config/config.js';

export const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password, name } = req.body;
  
      if (!email || !password || !name) {
        throw new Exception(messageData.invalidData, {}, StatusCodes.BAD_REQUEST);
      }
  
      const existingUser = await userServices.getUserByEmail(email);
    
      if (existingUser) {
        throw new Exception(messageData.userExist, { existingUser }, StatusCodes.BAD_REQUEST);
      }
  
      const salt = random();
      const user = await userServices.createUser({
        email,
        name,
        authentication: {
          salt,
          password: authentication(salt, password),
        },
      });
  
     responseLib.success(res, { status: StatusCodes.OK, message: messageData.registeredSuccessfully, data: user  })
    } catch (error) {
      if (error instanceof Exception) {
        next(error);
        return;
      }
      throw new Exception(error.message, { error }, StatusCodes.INTERNAL_SERVER_ERROR);
    }
}
  
export const getAllUser = async (req: Request, res: Response, next: NextFunction) => { 
    try {
        const users = await userServices.getAllUsers();
        responseLib.success(res, { status: StatusCodes.OK, message: messageData.allUserData, data: users  })
    } catch (error) {
      if (error instanceof Exception) {
        next(error);
        return;
      }
      throw new Exception(error.message, { error }, StatusCodes.INTERNAL_SERVER_ERROR);
    }   
}

export const getSingleUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id:userId } = req.params;
    const userData = await userServices.getUserById(userId); 
    if (!userData?._id) {
      throw new Exception(messageData.userNotFound, { user: userData }, StatusCodes.BAD_REQUEST)
    }
    return responseLib.success(res, { status: StatusCodes.ACCEPTED, message: messageData.fetchedDataSuccessfully, data: { user: userData }})
  } catch (error) {
    next(error);
  }
}

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try { 
    const { email, password } = req.body;
    if (!email || !password) {
      throw new Exception(messageData.invalidData, {}, StatusCodes.BAD_REQUEST);
    }
    const userExist = await userServices.getUserByEmail(email).select('+authentication.password +authentication.salt');

    if (!userExist._id) {
      throw new Exception(messageData.userNotFound, {}, StatusCodes.BAD_REQUEST);
    }

    const expectedHash = authentication(userExist.authentication.salt, password);
    
    if (expectedHash === userExist.authentication.password) {
      const newSlat = random();
      userExist.authentication.sessionToken = newSlat;
      await userExist.save();

      res.cookie(config.sessionToken, newSlat, { domain: 'localhost', path: '/' });
      responseLib.success(res, { status: StatusCodes.OK,  message: messageData.loggedInSuccessfully, data: { sessionToken: newSlat }, } );
      return;
    }

    throw new Exception(messageData.wrongPassword, {}, StatusCodes.INTERNAL_SERVER_ERROR);
  } catch (error) {
    return next(error);
  }
}

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try { 
    const { id } = req.params;
    const deleteRes = await userServices.deleteUsersById(id);
    if (!deleteRes?._id) {
      throw new Exception(messageData.userNotFound, { user: deleteRes }, StatusCodes.BAD_REQUEST)
    }
    return responseLib.success(res, { status: StatusCodes.ACCEPTED, message: messageData.userDeleted, data: { user: deleteRes }})
  } catch (error) {
    next(error);
  }
}

