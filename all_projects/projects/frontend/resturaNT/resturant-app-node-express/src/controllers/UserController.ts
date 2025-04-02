import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import crypto from 'crypto';
import sgMail from '@sendgrid/mail';
import config, { Role } from '../config/config';
import UserService from '../services/UserService';
import RoleService from '../services/RoleService';
import UserValidation from '../validation/UserValidation';
import UserAuthentication from '../authentication/UserAuthentication';
import ForgetPasswordAuthentication from '../authentication/ForgetPasswordAuthentication';
import UserEncryption from '../cryptography/UserEncryption';
import ValidationError from '../error/ValidationError';
import forgetPasswordEmailBody from '../public/forgetPasswordEmailBody';
import emailTemplate from '../utils/EmailTemplate';

export default class UserController {
  signup = async (req: Request, res: Response, next: any) => {
    try {
      const userService = new UserService();
      const roleService = new RoleService();
      const { error, value } = UserValidation.signupSchema.validate(req.body, { abortEarly: false });
      if (error) {
        const joiError = error.details.map((e) => e.message.replace(/"/gi, ''));
        throw new ValidationError('Validation Error', StatusCodes.BAD_REQUEST, joiError);
      } else {
        const findUserByEmail = await userService.findOneUserByEmail(value.email);
        const findOneUserByPhone = await userService.findOneUserByPhone(value.phone);
        const role = await roleService.findIdByName(Role.Admin);

        if (findUserByEmail) {
          return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: 'Email already exists, please enter a new email',
            data: null,
          });
        }
        if (findOneUserByPhone) {
          return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: 'Phone already exists, please enter a new phone',
            data: null,
          });
        }
        if (!role) {
          return res.status(StatusCodes.NOT_FOUND).json({
            success: false,
            message: 'Role not found',
            data: role,
          });
        }
        const data = {
          name: `${value.firstName} ${value.lastName}`,
          email: value.email,
          phone: value.phone,
          address: value.address,
          password: await UserEncryption.encrypt(value.password),
          roleId: role.id,
        };
        try {
          await userService.addUser(data);
          return res.status(StatusCodes.CREATED).json({
            success: true,
            message: 'SignUp successful',
            data: null,
          });
        } catch (err) {
          return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'SignUp failed',
            data: null,
          });
        }
      }
    } catch (err) {
      return next(err);
    }
  };

  searchUser = async (req: Request, res: Response, next: any) => {
    try {
      const userService = new UserService();
      const roleService = new RoleService();
      const role = await roleService.findIdByName(Role.User);
      if (role) {
        const data = await userService.searchUser(role.id, req.body.phone);
        return res.status(StatusCodes.OK).json({
          success: true,
          message: 'All Users',
          data,
        });
      }
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'failed to get users',
        data: null,
      });
    } catch (err) {
      next(err);
    }
  };

  signupUser = async (req: Request, res: Response, next: any) => {
    try {
      const userService = new UserService();
      const roleService = new RoleService();
      const { error, value } = UserValidation.signupSchema.validate(req.body, { abortEarly: false });
      if (error) {
        const joiError = error.details.map((e) => e.message.replace(/"/gi, ''));
        throw new ValidationError('Validation Error', StatusCodes.BAD_REQUEST, joiError);
      } else {
        const findUserByEmailPhone = await userService.findOneUserByEmailAndPhone(value.email, value.phone);
        if (!findUserByEmailPhone) {
          const role = await roleService.findIdByName(Role.User);
          if (role) {
            const data = {
              name: `${value.firstName} ${value.lastName}`,
              email: value.email,
              phone: value.phone,
              address: value.address,
              password: await UserEncryption.encrypt(value.password),
              roleId: role.id,
            };
            try {
              const { id, name, phone } = await userService.addUser(data);
              return res.status(StatusCodes.CREATED).json({
                success: true,
                message: 'SignUp successful',
                data: {
                  id,
                  name,
                  phone,
                },
              });
            } catch (err) {
              return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'SignUp failed',
                data: null,
              });
            }
          } else {
            return res.status(StatusCodes.NOT_FOUND).json({
              success: false,
              message: 'Role not found',
              data: role,
            });
          }
        } else {
          return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: 'Email or Phone already exists, please enter a new email',
            data: null,
          });
        }
      }
    } catch (err) {
      return next(err);
    }
  };

  login = async (req: Request, res: Response, next: any) => {
    try {
      const userService = new UserService();
      const { error, value } = UserValidation.loginSchema.validate(req.body, { abortEarly: false });
      if (error) {
        const joiError = error.details.map((e) => e.message.replace(/"/gi, ''));
        throw new ValidationError('Validation Error', StatusCodes.BAD_REQUEST, joiError);
      } else {
        const user = await userService.findOneUserByEmail(value.email);
        if (!user) {
          return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: 'Login failed, please enter proper credentials',
            data: null,
          });
        }
        if (!(await UserEncryption.decrypt(value.password, user.password))) {
          return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: 'Login failed, please enter proper credentials',
            data: null,
          });
        }
        const data = await userService.findOneUserAndRoleByEmail(value.email);
        return res.status(StatusCodes.OK).json({
          success: true,
          message: 'Login successful',
          data: {
            id: data?.id,
            name: data?.name,
            email: data?.email,
            phone: data?.phone,
            address: data?.address,
            roleId: data?.roleId,
            role: {
              id: data?.role.id,
              name: data?.role.name,
            },
            authToken: UserAuthentication.authToken(user.id, user.email),
          },
        });
      }
    } catch (err) {
      return next(err);
    }
  };

  resetPassword = async (req: any, res: Response, next: any) => {
    try {
      const userService = new UserService();
      const { error, value } = UserValidation.resetPasswordSchema.validate(req.body, { abortEarly: false });
      if (error) {
        const joiError = error.details.map((e) => e.message.replace(/"/gi, ''));
        throw new ValidationError('Validation Error', StatusCodes.BAD_REQUEST, joiError);
      } else {
        const user = await userService.findOneUserByEmail(req.user.email);
        if (!user) {
          return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: 'Not a valid user',
            data: user,
          });
        }
        const incomingPassword = value.oldPassword;
        const bool = await UserEncryption.decrypt(incomingPassword, user.password);
        if (!bool) {
          return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: 'Old password does not match',
            data: incomingPassword,
          });
        }
        try {
          await userService.updateUserPassword(await UserEncryption.encrypt(value.newPassword), user.id);
          return res.status(StatusCodes.OK).json({
            success: true,
            message: 'Password updated successfully',
            data: UserAuthentication.authToken(user.id, user.email),
          });
        } catch (err) {
          return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Failed to update password',
            data: null,
          });
        }
      }
    } catch (err) {
      return next(err);
    }
  };

  getProfile = async (req: any, res: Response, next: any) => {
    try {
      const userEmail = req.user.email;
      const userService = new UserService();
      const user = await userService.findOneUserAndRoleByEmail(userEmail);
      if (!user) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: 'User not found',
          data: null,
        });
      }
      return res.status(StatusCodes.OK).json({
        success: true,
        message: 'User data retrieved',
        data: user,
      });
    } catch (err) {
      return next(err);
    }
  };

  updateProfile = async (req: any, res: Response, next: any) => {
    try {
      const { name, phone, address } = req.body;
      const userService = new UserService();
      const { id, email } = req.user;
      const { error } = UserValidation.profileSchema.validate(req.body, { abortEarly: false });
      if (error) {
        const joiError = error.details.map((e) => e.message.replace(/"/gi, ''));
        throw new ValidationError('Validation Error', StatusCodes.BAD_REQUEST, joiError);
      } else {
        const user = await userService.findOneUserByEmail(email);
        if (!user) {
          return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: 'User not found',
            data: null,
          });
        }
        if (phone !== user.phone && phone !== undefined) {
          const findOneUserByPhone = await userService.findOneUserByPhone(phone);
          if (findOneUserByPhone) {
            return res.status(StatusCodes.BAD_REQUEST).json({
              success: false,
              message: 'Phone already exists, enter a new phone',
              data: null,
            });
          }
        }
        try {
          await userService.updateUser({ name, phone, address }, id);
          const updatedUser = await userService.findOneUserAndRoleByEmail(email);
          return res.status(StatusCodes.OK).json({
            success: true,
            message: 'Profile updated successfully',
            data: updatedUser,
          });
        } catch (err) {
          return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Profile update failed',
            data: null,
          });
        }
      }
    } catch (err) {
      return next(err);
    }
  };

  forgetPassword = async (req: any, res: any, next: any) => {
    try {
      const { email } = req.body;
      const { error } = UserValidation.forgetPasswordSchema.validate(req.body, { abortEarly: false });
      if (error) {
        const joiError = error.details.map((e) => e.message.replace(/"/gi, ''));
        throw new ValidationError('Validation Error', StatusCodes.BAD_REQUEST, joiError);
      } else {
        const userService = new UserService();
        const user = await userService.findOneUserByEmail(email);
        if (!user) {
          return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: 'Invalid email, please enter proper credentials',
            data: null,
          });
        }
        const forgetPasswordToken = crypto.randomBytes(16).toString('hex');
        const forgetPasswordAuthToken = ForgetPasswordAuthentication.forgetPasswordAuthToken(
          forgetPasswordToken,
          email
        );

        sgMail.setApiKey(String(config.SEND_GRID_API_KEY));

        const message = emailTemplate(
          email,
          config.COMPANY_NAME,
          config.SENDER_EMAIL,
          config.FORGET_PASSWORD_EMAIL_SUBJECT,
          forgetPasswordEmailBody(config.FORGET_PASSWORD_FRONTEND_URL, forgetPasswordAuthToken)
        );

        await userService.updateForgetPasswordToken(forgetPasswordToken, user.id);

        try {
          await sgMail.send(message);
          return res.status(StatusCodes.OK).json({
            success: true,
            message: 'Email sent successfully',
            data: null,
          });
        } catch (err) {
          return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Failed to send forget password email',
            data: err,
          });
        }
      }
    } catch (err) {
      return next(err);
    }
  };

  newPassword = async (req: any, res: any, next: any) => {
    try {
      const { error } = UserValidation.newPasswordSchema.validate(req.body, { abortEarly: false });
      if (error) {
        const joiError = error.details.map((e) => e.message.replace(/("|\[|\])/gi, ''));
        throw new ValidationError('Validation Error', StatusCodes.BAD_REQUEST, joiError);
      } else {
        const { forgetPasswordAuthToken, newPassword } = req.body;
        const tokenObj = ForgetPasswordAuthentication.checkForgetPasswordAuth(forgetPasswordAuthToken);
        if (tokenObj === null) {
          return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: 'Invalid - Forget Password Authentication Token',
            data: null,
          });
        }
        const userService = new UserService();
        const user = await userService.findOneUserByEmail(tokenObj.email);
        if (!user) {
          return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: 'User not found',
            data: null,
          });
        }
        if (tokenObj.forgetPasswordToken !== user.forgetPasswordToken) {
          return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: 'Invalid - Forget Password Token',
            data: null,
          });
        }

        try {
          await userService.updateUserPassword(await UserEncryption.encrypt(newPassword), user.id);
          await userService.updateForgetPasswordToken(null, user.id);
          return res.status(StatusCodes.OK).json({
            success: true,
            message: 'Password updated successfully',
            data: null,
          });
        } catch (err) {
          return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Failed to update password',
            data: err,
          });
        }
      }
    } catch (err) {
      return next(err);
    }
  };
}
