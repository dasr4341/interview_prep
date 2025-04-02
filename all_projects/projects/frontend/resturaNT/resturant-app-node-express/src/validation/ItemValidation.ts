import Joi from 'joi';

const createSchema = Joi.object({
    name: Joi.string().required(),
    price: Joi.number().required(),
    description: Joi.string().required(),
    status: Joi.boolean(),
    subcategory_id: Joi.number().required(),
    item_limit: Joi.number().required()
});

const updateSchema = Joi.object({
    name: Joi.string(),
    price: Joi.number(),
    description: Joi.string(),
    status: Joi.boolean(),
    subcategory_id: Joi.number(),
    item_limit: Joi.number()
});

const idSchema = Joi.object({
    id: Joi.number()
});

const querySchema = Joi.object({
    page: Joi.number(),
    pageSize: Joi.number()
});

export default {
    createSchema, updateSchema, idSchema, querySchema
};
