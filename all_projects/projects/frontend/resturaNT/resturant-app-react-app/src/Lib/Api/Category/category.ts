import axios from '../Axios/axios';
import { CategoryAllResponse, CategoryResponse, ItemResponse, SubCategoryResponse } from '../../Interface/Category/category.interface';
export const categoryApi = {
  getAllCategory: async (): Promise<CategoryAllResponse> => {
    const res = await axios.get('/category?page=1&pageSize=10');
    const data = res.data.data;
    return data;
  },

  getCurrentCategory: async (id: number): Promise<CategoryAllResponse> => {
    const res = await axios.get(`/category/${id}`);
    const data = res.data.data;
    return data;
  },

  putCategory: async (id: number, data: boolean): Promise<CategoryResponse> => {
    const res = await axios.put(
      `/category/${id}`,
      {
        status: data,
      }
    );
    return res.data;
  },

  putItem: async (id: number, data: boolean): Promise<ItemResponse> => {
    const res = await axios.put(
      `/item/${id}`,
      {
        status: data,
      }
    );
    return res.data;
  },

  createCategory: async (name: string): Promise<CategoryResponse> => {
    const res = await axios.post(
      '/category',
      {
        name: name,
      }
    );
    return res.data;
  },

  createSubCategory: async (name: string, parentId: string): Promise<CategoryResponse> => {
    const res = await axios.post(
      '/category',
      {
        name: name,
        parent_id: parentId,
      }
    );
    return res.data;
  },

  createItem: async (
    name: string,
    subcategoryId: string,
    price: number,
    description: string,
    img: any,
    limit: string
  ): Promise<ItemResponse> => {
    const formData = new FormData();
    formData.append('img', img);
    formData.append('name', name);
    formData.append('description', description);
    formData.append('subcategory_id', subcategoryId);
    formData.append('price', String(price));
    formData.append('item_limit', limit);
    const res = await axios.post(
      '/item',
      formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    return res.data;
  },

  deleteCategory: async (id: number) => {
    const res = await axios.delete(`/category/${id}`);
    return res.data;
  },

  deleteItem: async (id: number) => {
    const res = await axios.delete(`/item/${id}`);
    return res.data;
  },

  getParticularItem: async (id: number): Promise<ItemResponse> => {
    const res = await axios.get(`/item/${id}`);
    const data = res.data.data;
    return data;
  },

  updateCategory: async (id: number, name: string): Promise<CategoryResponse> => {
    const res = await axios.put(`/category/${id}`, {
      name: name
    });
    return res.data;
  },

  updateSubCategory: async (id: number, name: string, parentId: string): Promise<SubCategoryResponse> => {
    const res = await axios.put(`/category/${id}`, {
      name: name,
      parent_id: parentId
    });
    return res.data;
  },

  updateItem: async (
    id: number,
    name: string,
    subcategoryId: string,
    price: number,
    description: string,
    img: any,
    limit: string
  ): Promise<ItemResponse> => {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('subcategory_id', subcategoryId);
    formData.append('price', String(price));
    formData.append('item_limit', limit);
    if (img) {
      formData.append('img', img);
    }
    const res = await axios.put(
      `/item/${id}`,
      formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    return res.data;
  },
};
