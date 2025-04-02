import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import UserAuthentication from '../authentication/UserAuthentication';

const fetchUser = (req: any, res: any, next: any) => {
  const authHeader = req.header('Authorization');
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message: 'Authentication failed',
      data: null
    });
  } else {
    jwt.verify(token, UserAuthentication.JWT_SECRET_KEY, (err: any, decoded: any) => {
      if (err) {
        res.status(StatusCodes.UNAUTHORIZED).json({
          success: false,
          message: 'Authentication failed',
          data: null
        });
      } else {
        req.user = decoded.user;
        next();
      }
    });
  }
};

export default fetchUser;
