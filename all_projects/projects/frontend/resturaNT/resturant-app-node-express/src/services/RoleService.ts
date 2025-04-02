import { StatusCodes } from 'http-status-codes';
import RoleModel from '../models/RoleModel';
import HttpError from '../error/HttpError';

export default class RoleService {
  // Role db logic
  findIdByName = async (name: any) => {
    try {
      return await RoleModel.findOne({ where: { name } });
    } catch (err) {
      throw new HttpError('Internal Server Error', StatusCodes.INTERNAL_SERVER_ERROR, null);
    }
  };
}
