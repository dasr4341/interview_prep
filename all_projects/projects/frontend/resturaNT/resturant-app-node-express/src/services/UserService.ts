import { Op } from 'sequelize';
import { StatusCodes } from 'http-status-codes';
import UserModel from '../models/UserModel';
import HttpError from '../error/HttpError';
import RoleModel from '../models/RoleModel';

export default class UserService {
  // User db logic
  searchUser = async (id: number, phoneData: number) => {
    try {
      return await UserModel.findAll({
        attributes: ['id', 'name', 'phone'],
        where: {
          roleId: id,
          phone: {
            [Op.startsWith]: phoneData,
          },
        },
      });
    } catch (err) {
      throw new HttpError('Failed to get users', StatusCodes.INTERNAL_SERVER_ERROR, null);
    }
  };

  addUser = async (user: any) => {
    try {
      return await UserModel.create({ ...user });
    } catch (err) {
      throw new HttpError('Failed to add user', StatusCodes.INTERNAL_SERVER_ERROR, null);
    }
  };

  findOneUserByEmail = async (email: any) => {
    try {
      return await UserModel.findOne({ where: { email } });
    } catch (err) {
      throw new HttpError('Failed to find one user by email', StatusCodes.INTERNAL_SERVER_ERROR, null);
    }
  };

  findOneUserByEmailAndPhone = async (email: any, phone: any) => {
    try {
      return await UserModel.findOne({
        where: {
          [Op.or]: [
            { phone },
            { email }
          ]
        }
      });
    } catch (err) {
      throw new HttpError('Failed to find one user by email', StatusCodes.INTERNAL_SERVER_ERROR, null);
    }
  };

  findOneUserByPhone = async (phone: any) => {
    try {
      return await UserModel.findOne({ where: { phone } });
    } catch (err) {
      throw new HttpError('Failed to find one user by phone', StatusCodes.INTERNAL_SERVER_ERROR, null);
    }
  };

  // https://stackoverflow.com/questions/8039932/specifying-specific-fields-with-sequelize-nodejs-instead-of
  findOneUserAndRoleByEmail = async (email: any) => {
    try {
      return await UserModel.findOne({ include: RoleModel, attributes: { exclude: ['password'] }, where: { email } });
    } catch (err) {
      throw new HttpError('Failed to find one user and role by email', StatusCodes.INTERNAL_SERVER_ERROR, null);
    }
  };

  updateUserPassword = async (password: any, id: any) => {
    try {
      return await UserModel.update({ password }, { where: { id } });
    } catch (err) {
      throw new HttpError('Failed to update user password', StatusCodes.INTERNAL_SERVER_ERROR, null);
    }
  };

  updateForgetPasswordToken = async (forgetPasswordToken: any, id: any) => {
    try {
      return await UserModel.update({ forgetPasswordToken }, { where: { id } });
    } catch (err) {
      console.log(err);
      throw new HttpError('Failed to update forget password token', StatusCodes.INTERNAL_SERVER_ERROR, null);
    }
  };

  findOneUserByPk = async (id: any) => {
    try {
      return await UserModel.findByPk(id);
    } catch (err) {
      throw new Error('Failed to get User details from user Id provided');
    }
  };

  updateUser = async (user: any, id: any) => {
    try {
      return await UserModel.update(user, { where: { id } });
    } catch (err) {
      throw new HttpError('Failed to update user', StatusCodes.INTERNAL_SERVER_ERROR, null);
    }
  };
}
