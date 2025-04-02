import { Request, Response } from 'express';
import fs from 'fs';
import { StatusCodes } from 'http-status-codes';
import path from 'path';
import HttpError from '../error/HttpError';
import ValidationError from '../error/ValidationError';
import CategoryService from '../services/CategoryService';
import ItemService from '../services/ItemService';
import itemSchema from '../validation/ItemValidation';

export default class ItemController {
  GetItems = async (req: Request, res: Response, next: any) => {
    try {
      const service = new ItemService();
      const { error, value } = itemSchema.querySchema.validate(req.query, { abortEarly: false });
      if (error) {
        throw new ValidationError(
          'Validation Error',
          StatusCodes.BAD_REQUEST,
          error.details.map((err) => err.message.replace(/"/gi, ''))
        );
      }
      const page = value.page ? value.page - 1 : 0;
      const pageSize = value.pageSize ? value.pageSize : 10;
        const category = await service.getAllItems(page, pageSize);
        return res.status(StatusCodes.OK).json({
          success: true,
          message: 'Retrived all item details',
          data: category.data,
          totalCount: category.count,
        });
    } catch (err) {
      return next(err);
    }
  };

  CreateItem = async (req: any, res: Response, next: any) => {
    try {
      const imgPath = path.join(__dirname, '../images/');
      const img = req.file;
      if (!img) {
        throw new HttpError('Image file Error', StatusCodes.BAD_REQUEST, null);
      }
      if (!img && req.fileError === 'error') {
        throw new HttpError('File format wrong', StatusCodes.BAD_REQUEST, null);
      }
      const { error, value } = itemSchema.createSchema.validate(req.body, { abortEarly: false });
      if (error) {
        fs.unlinkSync(imgPath + img.filename);
        throw new ValidationError(
          'Validation Error',
          StatusCodes.BAD_REQUEST,
          error.details.map((err) => err.message.replace(/"/gi, ''))
        );
      }
      const service = new ItemService();
      const categoryService = new CategoryService();
      const data = value;
      if (data.subcategory_id) {
        const updateId = await categoryService.getCategory(data.subcategory_id);
        if (!updateId) {
          fs.unlinkSync(imgPath + img.filename);
          throw new HttpError('subcategory_id doesnot exist', StatusCodes.BAD_REQUEST, null);
        }
      }
      const isName = await service.findName(data.name);
      if (isName) {
        fs.unlinkSync(imgPath + img.filename);
        throw new HttpError('Failed to create because of same item name', StatusCodes.BAD_REQUEST, null);
      }
      const category = await service.addItem(data, img);
      return res.status(StatusCodes.CREATED).json({
        success: true,
        message: 'Created new item',
        data: category,
      });
    } catch (err) {
      return next(err);
    }
  };

  GetItem = async (req: Request, res: Response, next: any) => {
    try {
      const { error, value } = itemSchema.idSchema.validate(req.params, { abortEarly: false });
      if (error) {
        throw new ValidationError(
          'Validation Error',
          StatusCodes.BAD_REQUEST,
          error.details[0].message.replace(/"/gi, '')
        );
      }
      const { id } = value;
      const service = new ItemService();
      const category = await service.getItem(id);
      if (!category) {
        throw new HttpError('Failed to get id', StatusCodes.BAD_REQUEST, null);
      }
      return res.status(StatusCodes.OK).json({
        success: true,
        message: 'Retrived item details',
        data: category,
      });
    } catch (err) {
      return next(err);
    }
  };

  UpdateItem = async (req: any, res: Response, next: any) => {
    try {
      const imgPath = path.join(__dirname, '../images/');
      const img = req.file;
      const { error, value } = itemSchema.idSchema.validate(req.params, { abortEarly: false });
      if (error) {
        if (img) {
          fs.unlinkSync(imgPath + img.filename);
        }
        throw new ValidationError(
          'Validation Error',
          StatusCodes.BAD_REQUEST,
          error.details[0].message.replace(/"/gi, '')
        );
      }
      const service = new ItemService();
      const { id } = value;
      const isId = await service.getItem(id);
      if (!isId) {
        if (img) {
          fs.unlinkSync(imgPath + img.filename);
        }
        throw new HttpError('Failed to get id', StatusCodes.BAD_REQUEST, null);
      }
      if (Object.keys(req.body).length === 0 && req.body.constructor === Object) {
        throw new HttpError('Body Empty', StatusCodes.BAD_REQUEST, null);
      }
      const resolve = itemSchema.updateSchema.validate(req.body, { abortEarly: false });
      if (resolve.error) {
        if (img) {
          fs.unlinkSync(imgPath + img.filename);
        }
        throw new ValidationError(
          'Validation Error',
          StatusCodes.BAD_REQUEST,
          resolve.error.details.map((err) => err.message.replace(/"/gi, ''))
        );
      }
      const data = resolve.value;
      const categoryService = new CategoryService();
      if (data.subcategory_id) {
        const updateId = await categoryService.getCategory(data.subcategory_id);
        if (!updateId) {
          if (img) {
            fs.unlinkSync(imgPath + img.filename);
          }
          throw new HttpError('subcategory_id doesnot exist', StatusCodes.BAD_REQUEST, null);
        }
      }
      if (!img && req.fileError === 'error') {
        throw new HttpError('File format wrong', StatusCodes.BAD_REQUEST, null);
      }
      if (img) {
        const imgVal = await service.getItem(id);
        const prevImg = imgVal?.img;
        try {
          await fs.promises.unlink(imgPath + prevImg);
        } catch (err) {
          fs.unlinkSync(imgPath + img.filename);
          throw new HttpError('Image Updation Error', StatusCodes.INTERNAL_SERVER_ERROR, null);
        }
      }
      const category = await service.updateItem(id, data, img);
      return res.status(StatusCodes.OK).json({
        success: true,
        message: 'Updated item details',
        data: category,
      });
    } catch (err) {
      return next(err);
    }
  };

  DeleteItem = async (req: Request, res: Response, next: any) => {
    try {
      const imgPath = path.join(__dirname, '../images/');
      const { error, value } = itemSchema.idSchema.validate(req.params, { abortEarly: false });
      if (error) {
        throw new ValidationError(
          'Validation Error',
          StatusCodes.BAD_REQUEST,
          error.details[0].message.replace(/"/gi, '')
        );
      }
      const { id } = value;
      const service = new ItemService();
      const isId = await service.getItem(id);
      if (!isId) {
        throw new HttpError('Failed to get id', StatusCodes.BAD_REQUEST, null);
      }
      const imgVal = await service.getItem(id);
      const prevImg = imgVal?.img;
      try {
        await fs.promises.unlink(imgPath + prevImg);
      } catch (err) {
        throw new HttpError('Image Deletion Error', StatusCodes.INTERNAL_SERVER_ERROR, null);
      }
      await service.deleteItem(id);
      return res.status(StatusCodes.OK).json({
        success: true,
        message: 'Deleted item',
      });
    } catch (err) {
      return next(err);
    }
  };
}
