import { StatusCodes } from 'http-status-codes';
import { Op } from 'sequelize';
import Category from '../models/CategoryModel';
import Item from '../models/ItemsModel';
import HttpError from '../error/HttpError';

export default class CategoryService {
  getAllCategories = async (page: number, pageSize: number) => {
    try {
      const offset = page * pageSize;
      const limit = pageSize;
      const { count } = await Category.findAndCountAll({
        limit,
        offset,
        where: { parent_id: null },
      });
      return {
        data: await Category.findAll({
          limit,
          offset,
          include:
        // eslint-disable-next-line max-len
        [{ model: Category, include: [{ model: Item, include: [{ model: Category, attributes: ['id', 'name'] }] }] }],
          order: [['name', 'ASC']],
          where: { parent_id: null },
        }),
        count
      };
    } catch (err) {
      throw new HttpError('Failed to get all category details', StatusCodes.BAD_REQUEST, err);
    }
  };

  getAllSubCategories = async (page: number, pageSize: number) => {
    try {
      const offset = page * pageSize;
      const limit = pageSize;
      const { count } = await Category.findAndCountAll({
        limit,
        offset,
        where: { parent_id: { [Op.not]: null } },
      });
      return {
        data: await Category.findAll({
          limit,
          offset,
          include: [Item],
          where: { parent_id: { [Op.not]: null } },
        }),
        count,
      };
    } catch (err) {
      throw new HttpError('Failed to get all subcategory details', StatusCodes.BAD_REQUEST, err);
    }
  };

  addCategory = async (category: any) => {
    try {
      return await Category.create(category);
    } catch (err) {
      throw new HttpError('Failed to create category', StatusCodes.BAD_REQUEST, err);
    }
  };

  getCategory = async (id: any) => {
    try {
      return await Category.findByPk(id);
    } catch (err) {
      console.log(err);
      throw new HttpError('Failed to get category details', StatusCodes.BAD_REQUEST, err);
    }
  };

  getCategoryWithInclude = async (id: any, parentId: any) => {
    try {
      let category;
      if (parentId) {
        // eslint-disable-next-line max-len
        category = await Category.findByPk(id, { include: [{ model: Item, include: [{ model: Category, attributes: ['id', 'name'] }] }] });
      } else {
        // eslint-disable-next-line max-len
        category = await Category.findByPk(id, { include: [{ model: Category, include: [{ model: Item, include: [{ model: Category, attributes: ['id', 'name'] }] }] }] });
      }
      return category;
    } catch (err) {
      throw new HttpError('Failed to get category details', StatusCodes.BAD_REQUEST, err);
    }
  };

  updateCategory = async (id: any, categoryUpdate: any) => {
    try {
      await Category.update(
        {
          name: categoryUpdate.name,
          status: categoryUpdate.status,
          parent_id: categoryUpdate.parent_id,
        },
        { where: { id } }
      );
    } catch (err) {
      throw new HttpError('Failed to update category details', StatusCodes.BAD_REQUEST, err);
    }
    return this.getCategory(id);
  };

  deleteCategory = async (id: any) => {
    try {
      return await Category.destroy({ where: { id } });
    } catch (err) {
      throw new HttpError('Failed to delete category details', StatusCodes.BAD_REQUEST, err);
    }
  };

  findName = async (name: any) => {
    try {
      return await Category.findOne({ where: { name } });
    } catch (err) {
      throw new HttpError('Failed to get Name', StatusCodes.BAD_REQUEST, err);
    }
  };
}
