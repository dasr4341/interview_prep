import axiosInstance from '../Axios/axios';
import { OrderDetailsInterface, OrderInterface } from '../../Interface/Order/Order.Interface';
import { STATUS } from '../../Helper/constants';

const orderApi = {
  getAllOrder: async (): Promise<OrderInterface[]> => {
    const response = await axiosInstance.get('/order');
    return response.data.data as OrderInterface[];
  },
  getOrderByStatus: async (orderStatus: STATUS): Promise<OrderInterface[]> => {
    const response = await axiosInstance.get(`/order/${orderStatus}`);
    return response.data.data as OrderInterface[];
  },
  getOrderById: async (orderId: string): Promise<OrderDetailsInterface> => {
    const response = await axiosInstance.get(`/order/getOrder/${orderId}`);
    return response.data.data as OrderDetailsInterface;
  },
  setNoOfItems: async (id: string, no_of_items: number) => {
    const response = await axiosInstance.put(`/details/noOfItems/${id}`, {
      no_of_items,
    });
    return response.data;
  },
  deleteOrderItems: async (id: string, orderId: string) => {
    const response = await axiosInstance.delete(`/details/${id}/${orderId}`);
    return response.data;
  },
  updateOrderStatus: async (id: string, status: string) => {
    const response = await axiosInstance.put(`/order/status/${id}`, {
      status,
    });
    return response.data;
  },
};

export default orderApi;
