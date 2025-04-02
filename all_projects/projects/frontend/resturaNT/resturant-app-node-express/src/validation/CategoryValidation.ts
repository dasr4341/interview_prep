import Joi from 'joi';

const createSchema = Joi.object({
  name: Joi.string().required(),
  status: Joi.boolean(),
  parent_id: Joi.number(),
});

const updateSchema = Joi.object({
  name: Joi.string(),
  status: Joi.boolean(),
  parent_id: Joi.number(),
});

const idSchema = Joi.object({
  id: Joi.number(),
});

const querySchema = Joi.object({
  page: Joi.number(),
  pageSize: Joi.number(),
});

export default {
  createSchema,
  updateSchema,
  idSchema,
  querySchema,
};
