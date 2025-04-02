import { PlaceOrderPayload } from '../../Interface/Cart/CartInterface';
import http from '../Axios/axios';



const cartApi = {
  placeOrder: async (data: PlaceOrderPayload) => {
      const response = await http.post('/order/', data);
      return response.data;
  },
};
export default cartApi;