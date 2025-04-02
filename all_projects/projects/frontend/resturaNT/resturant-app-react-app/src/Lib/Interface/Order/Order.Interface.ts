import { STATUS } from '../../Helper/constants';

export interface ItemInterface {
  id: number; //orderDetails id
  noOfItems: number;
  itemPrice: number;
  orderId: string;
  itemId: number;
  itemName: string;
  itemSubCategory: string;
  itemImage: string;
  itemLimit: number;
}
export interface OrderUserDetailsInterface {
  name: string | undefined;
  email: string | undefined;
  phone: string | undefined;
  address: string | undefined;
}
export interface OrderDetailsInterface {
  id: number;
  userId: number;
  status: STATUS;
  createdAt: Date;
  updatedAt: Date;
  userDetails: OrderUserDetailsInterface;
  items: ItemInterface[];
}
export interface OrderInterface {
  loading: boolean;
  details: OrderDetailsInterface[];
  userOrderStatus: {
    loading: boolean;
    details: OrderDetailsInterface | null;
  };
}
export interface PayloadSetNoOfItems {
  itemId: number;
  noOfItems: number;
  orderId: number;
}
