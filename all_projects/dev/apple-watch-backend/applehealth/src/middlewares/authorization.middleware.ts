import { NextFunction, Request, Response } from 'express';

import { userHelper } from '../helper/user.helper.js';
import { responseLib } from '../lib/response.lib.js';

export async function authorization(req: Request | any, res: Response, next: NextFunction) {
  /* validate access_token */
  const { authorization } = req.headers;
  const access_token = authorization.split(' ')[1];
  const user = await userHelper.getPretaaUser(access_token);

  /* invalid access_token */
  if (!user) {
    return responseLib.unauthorized(res);
  }

  /* valid access_token */
  const { id, status } = user.pretaaHealthCurrentUser;
  req.user = { userId: id, status };
  return responseLib.authorized(next);
}
