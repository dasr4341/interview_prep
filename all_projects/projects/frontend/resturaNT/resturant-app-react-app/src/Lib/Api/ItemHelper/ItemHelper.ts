import axiosInstance from '../../Api/Axios/axios';

export const itemHelperApi = {
  getAllItemsLeftOverQuantity: async () => {
    const response = await axiosInstance.get('/details/GetAllItemsLeftOverDetails');
    return response.data.data;
  }
};