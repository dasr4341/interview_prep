/* eslint-disable @typescript-eslint/no-unused-vars */
import { OrderInterface } from '../../Interface/Order/Order.Interface';
import { createSlice } from '@reduxjs/toolkit';
export interface OrderSlice {
  orders: OrderInterface;
}

const initialState: OrderSlice = {
  orders: {
    loading: false,
    details: [],
    userOrderStatus: {
      loading: false,
      details: null,
    },
  },
};

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    getOrders: (state, action) => {
      console.log('initiate ->> get all orders');
      state.orders.loading = true;
    },
    addOrders: (state, action) => {
      // setting all the orders from action payload
      const detailsState = [];
      for (const key in action.payload) {
        const { orderItems, ...details } = action.payload[key];
        const orderDetails = {
          id: details.id,
          userId: details.user_id,
          status: details.status,
          createdAt: details.created_at,
          updatedAt: details.updated_at,
           userDetails: {
            name: details.user.name,
            email: details.user.email,
            phone: details.user.phone,
            address: details.user.address,
          },
          items: [],
        };

        const itemsData = orderItems.map((element: any) => {
          const { item, ...orderItemDetails } = element;
          const {
            category: { name },
            ...itemDetails
          } = item;

          return {
            id: orderItemDetails.id,
            noOfItems: orderItemDetails.no_of_items,
            orderId: orderItemDetails.order_id,
            itemPrice: orderItemDetails.item_price,
            itemId: item.id,
            itemName: item.name,
            itemImage: item.img,
            itemLimit: item.item_limit,
            itemSubCategory: name,
          };
        });

        orderDetails.items = itemsData;
        detailsState.push(orderDetails);
      }
      state.orders.details = detailsState;
      state.orders.loading = false;
      return state;
    },
    setNoOfItems: (state, action) => {
      console.log('initiate ->> set no of orders Items');
    },
    setOrderStatus: (state, action) => {
      console.log('initiate ->> change of order status', action);
    },
    getOrderById: (state, action) => {
      console.log('initiate ->> get orders by id');
      state.orders.userOrderStatus.loading = true;
    },
    addOrdersById: (state, action) => {
        const { orderItems, ...details } = action.payload;
        const orderDetails = {
          id: details.id,
          userId: details.user_id,
          status: details.status,
          createdAt: details.created_at,
          updatedAt: details.updated_at,
          userDetails: {
            name: details.user.name,
            email: details.user.email,
            phone: details.user.phone,
            address: details.user.address,
          },
          items: [],
        };

        const itemsData = orderItems.map((element: any) => {
          const { item, ...orderItemDetails } = element;
          const {
            category: { name },
            ...itemDetails
          } = item;

          return {
            id: orderItemDetails.id,
            noOfItems: orderItemDetails.no_of_items,
            orderId: orderItemDetails.order_id,
            itemPrice: orderItemDetails.item_price,
            itemId: item.id,
            itemName: item.name,
            itemImage: item.img,
            itemLimit: item.item_limit,
            itemSubCategory: name,
          };
        });

        orderDetails.items = itemsData;
      state.orders.userOrderStatus.details = orderDetails;
      state.orders.userOrderStatus.loading = false;
      return state;
    },
  },
});

// Action creators are generated for each case reducer function
export const orderSliceActions = orderSlice.actions;

export default orderSlice.reducer;
