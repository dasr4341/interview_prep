import { StatusCodes } from 'http-status-codes';
import Item from '../models/ItemsModel';
import Category from '../models/CategoryModel';
import HttpError from '../error/HttpError';

export default class ItemService {
  getAllItems = async (page: number, pageSize: number) => {
    try {
      const offset = page * pageSize;
      const limit = pageSize;
      const { count } = await Item.findAndCountAll({
        limit,
        offset,
      });
      return {
        data: await Item.findAll({
          limit,
          offset,
          include: Category,
          order: [['name', 'ASC']],
        }),
        count,
      };
    } catch (err) {
      throw new HttpError('Failed to get all item details', StatusCodes.BAD_REQUEST, err);
    }
  };

  getDefaultAllItems = async () => {
    try {
      return await Item.findAll({
        order: [['name', 'ASC']],
      });
    } catch (err) {
      throw new HttpError('Failed to get all item details', StatusCodes.BAD_REQUEST, err);
    }
  };

  addItem = async (category: any, img: any) => {
    try {
      return await Item.create({
        img: img.filename,
        name: category.name,
        price: category.price,
        description: category.description,
        status: category.status,
        subcategory_id: category.subcategory_id,
        item_limit: category.item_limit,
      });
    } catch (err) {
      throw new HttpError('Failed to create item', StatusCodes.BAD_REQUEST, err);
    }
  };

  getItem = async (id: any) => {
    try {
      return await Item.findByPk(id, { include: Category });
    } catch (err) {
      throw new HttpError('Failed to get item details', StatusCodes.BAD_REQUEST, err);
    }
  };

    updateItem = async (id: any, categoryUpdate: any, img: any) => {
        try {
            if (!img) {
                await Item.update({
                    name: categoryUpdate.name,
                    price: categoryUpdate.price,
                    description: categoryUpdate.description,
                    status: categoryUpdate.status,
                    subcategory_id: categoryUpdate.subcategory_id,
                    item_limit: categoryUpdate.item_limit
                }, { where: { id } });
            } else {
                await Item.update({
                    img: img.filename,
                    name: categoryUpdate.name,
                    price: categoryUpdate.price,
                    description: categoryUpdate.description,
                    status: categoryUpdate.status,
                    subcategory_id: categoryUpdate.subcategory_id,
                    item_limit: categoryUpdate.item_limit
                }, { where: { id } });
            }
        } catch (err) {
            throw new HttpError('Failed to update item details', StatusCodes.BAD_REQUEST, err);
        }
        return this.getItem(id);
    };

  deleteItem = async (id: any) => {
    try {
      return await Item.destroy({ where: { id } });
    } catch (err) {
      throw new HttpError('Failed to delete item details', StatusCodes.BAD_REQUEST, err);
    }
  };

  findName = async (name: any) => {
    try {
      return await Item.findOne({ where: { name } });
    } catch (err) {
      throw new HttpError('Failed to get Name', StatusCodes.BAD_REQUEST, err);
    }
  };

  getItemMaxLimit = async (id: string) => {
    try {
      return await Item.findByPk(id, { attributes: ['item_limit'] });
    } catch (err) {
      throw new HttpError('Failed to get item details', StatusCodes.BAD_REQUEST, err);
    }
  };
}
