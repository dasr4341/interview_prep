import Joi from 'joi';

const createSchema = Joi.object({
  user_id: Joi.number().required(),
});

const itemsSchema = Joi.object().keys({
  item_id: Joi.number().required(),
  no_of_items: Joi.number().required(),
});
const itemsCreateSchema = Joi.array().items(itemsSchema);
const Id = Joi.string().required();
const orderStatus = Joi.string().required();

const updateNoOfItems = Joi.object({
  id: Joi.string().required(),
  no_of_items: Joi.number().required(),
});

const deleteItems = Joi.object({
  id: Joi.string().required(),
  order_id: Joi.string().required(),
});
const updateStatus = Joi.object({
  id: Joi.string().required(),
  status: Joi.string().required(),
});

export default {
  createSchema,
  itemsSchema,
  itemsCreateSchema,
  Id,
  updateNoOfItems,
  deleteItems,
  updateStatus,
  orderStatus,
};
