import { STATUS } from '../../Helper/constants';

export interface CardOrderDetailsInterface {
  orderId: number;
  orderNoOfItems: string;
  orderPrice: string;
  orderTime: string;
  hover: boolean;
  showAddOn: boolean;
  pageType: string;
  orderStatus: STATUS;
}