import Joi from 'joi';

const signupSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().min(10).max(10).pattern(/^\d+$/)
.required(),
  address: Joi.string().min(4).max(40).required(),
  password: Joi.string().min(4).max(40).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const resetPasswordSchema = Joi.object({
  oldPassword: Joi.string().required(),
  newPassword: Joi.string().disallow(Joi.ref('oldPassword')).required(),
});

const profileSchema = Joi.object({
  name: Joi.string(),
  phone: Joi.string().min(10).max(10).pattern(/^\d+$/),
  address: Joi.string().min(4).max(40),
});

const forgetPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
});

const newPasswordSchema = Joi.object({
  forgetPasswordAuthToken: Joi.string().required(),
  newPassword: Joi.string().required(),
  // confirmPassword: Joi.ref('newPassword')
});

export default {
  signupSchema,
  loginSchema,
  resetPasswordSchema,
  profileSchema,
  forgetPasswordSchema,
  newPasswordSchema,
};
