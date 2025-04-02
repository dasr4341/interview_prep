import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import CategoryService from '../services/CategoryService';
import categorySchema from '../validation/CategoryValidation';
import HttpError from '../error/HttpError';
import ValidationError from '../error/ValidationError';
import config from '../config/config';

export default class CategoryController {
  GetCategories = async (req: Request, res: Response, next: any) => {
    try {
      const service = new CategoryService();
      const { error, value } = categorySchema.querySchema.validate(req.query, { abortEarly: false });
      if (error) {
        throw new ValidationError(
          'Validation error',
          StatusCodes.BAD_REQUEST,
          error.details.map((err) => err.message.replace(/"/gi, ''))
        );
      }
      const page = value.page ? value.page - 1 : 0;
      const pageSize = value.pageSize ? value.pageSize : 10;
      const category = await service.getAllCategories(page, pageSize);
      // eslint-disable-next-line max-len, no-return-assign, no-param-reassign
      category.data.map((categ: any) => categ.subcategory.map((subcategory: any) => subcategory.item.map((item: any) => (item.img = config.imgUrl + item.img))));
      return res.status(StatusCodes.OK).json({
        success: true,
        message: 'Retrived all category details',
        data: category.data,
        totalCount: category.count,
      });
    } catch (err) {
      return next(err);
    }
  };

  GetSubCategories = async (req: Request, res: Response, next: any) => {
    try {
      const service = new CategoryService();
      const { error, value } = categorySchema.querySchema.validate(req.query, { abortEarly: false });
      if (error) {
        throw new ValidationError(
          'Validation error',
          StatusCodes.BAD_REQUEST,
          error.details.map((err) => err.message.replace(/"/gi, ''))
        );
      }
      const page = value.page ? value.page - 1 : 0;
      const pageSize = value.pageSize ? value.pageSize : 10;
      const category = await service.getAllSubCategories(page, pageSize);
      return res.status(StatusCodes.OK).json({
        success: true,
        message: 'Retrived all subcategory details',
        data: category.data,
        totalCount: category.count,
      });
    } catch (err) {
      return next(err);
    }
  };

  CreateCategory = async (req: Request, res: Response, next: any) => {
    try {
      const { error, value } = categorySchema.createSchema.validate(req.body, { abortEarly: false });
      if (error) {
        throw new ValidationError(
          'Validation Error',
          StatusCodes.BAD_REQUEST,
          error.details.map((err) => err.message.replace(/"/gi, ''))
        );
      }
      const service = new CategoryService();
      const data = value;
      if (data.parent_id !== undefined) {
        const updateId = await service.getCategory(data.parent_id);
        if (!updateId) {
          throw new HttpError('parent_id doesnot exist', StatusCodes.BAD_REQUEST, null);
        }
      }
      const isName = await service.findName(data.name);
      if (isName) {
        throw new HttpError('Category name already exists', StatusCodes.BAD_REQUEST, null);
      }
      const category = await service.addCategory(data);
      return res.status(StatusCodes.CREATED).json({
        success: true,
        message: 'Created new category',
        data: category,
      });
    } catch (err) {
      return next(err);
    }
  };

    GetCategory = async (req: Request, res: Response, next: any) => {
        try {
            const service = new CategoryService();
            const { error, value } = categorySchema.idSchema.validate(req.params, { abortEarly: false });
            if (error) {
                throw new ValidationError(
                    'Validation Error',
                    StatusCodes.BAD_REQUEST,
                    error.details[0].message.replace(/"/gi, '')
                );
            }
            const category = await service.getCategory(value.id);
            const data = await service.getCategoryWithInclude(value.id, category?.parent_id);
            if (!data) {
                throw new HttpError(
                    'Failed to get id',
                    StatusCodes.BAD_REQUEST,
                    null
                );
            }
            if (category?.parent_id) {
              // eslint-disable-next-line max-len, no-return-assign, no-param-reassign
              data?.item.map((item: any) => (item.img = config.imgUrl + item.img));
            } else {
              // eslint-disable-next-line max-len, no-return-assign, no-param-reassign
              data?.subcategory.map((subcategory: any) => subcategory.item.map((item: any) => (item.img = config.imgUrl + item.img)));
            }
            return res.status(StatusCodes.OK).json({
                success: true,
                message: 'Retrived category details',
                data
            });
        } catch (err) {
            return next(err);
        }
    };

  UpdateCategory = async (req: Request, res: Response, next: any) => {
    try {
      const { error, value } = categorySchema.idSchema.validate(req.params, { abortEarly: false });
      if (error) {
        throw new ValidationError(
          'Validation Error',
          StatusCodes.BAD_REQUEST,
          error.details[0].message.replace(/"/gi, '')
        );
      }
      const service = new CategoryService();
      const resolve = categorySchema.updateSchema.validate(req.body, { abortEarly: false });
      if (resolve.error) {
        throw new ValidationError(
          'Validation Error',
          StatusCodes.BAD_REQUEST,
          resolve.error.details.map((err) => err.message.replace(/"/gi, ''))
        );
      }
      const data = resolve.value;
      if (data.parent_id) {
        const updateId = await service.getCategory(data.parent_id);
        if (!updateId) {
          throw new HttpError('parent_id doesnot exist', StatusCodes.BAD_REQUEST, null);
        }
      }
      const category = await service.updateCategory(value.id, data);
      if (!category) {
        throw new HttpError('Failed to get id', StatusCodes.BAD_REQUEST, null);
      }
      return res.status(StatusCodes.OK).json({
        success: true,
        message: 'Updated category details',
        data: category,
      });
    } catch (err) {
      return next(err);
    }
  };

  DeleteCategory = async (req: Request, res: Response, next: any) => {
    try {
      const service = new CategoryService();
      const { error, value } = categorySchema.idSchema.validate(req.params, { abortEarly: false });
      if (error) {
        throw new ValidationError(
          'Validation Error',
          StatusCodes.BAD_REQUEST,
          error.details[0].message.replace(/"/gi, '')
        );
      }
      const isId = await service.getCategory(value.id);
      if (!isId) {
        throw new HttpError('Failed to get id', StatusCodes.BAD_REQUEST, null);
      }
      await service.deleteCategory(value.id);
      return res.status(StatusCodes.OK).json({
        success: true,
        message: 'Deleted category',
      });
    } catch (err) {
      return next(err);
    }
  };
}
