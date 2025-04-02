export interface CartItemInterface {
  // CartItemInterface === CartItemPayload of addToCart
  id: number;
  img: string;
  name: string;
  price: number;
  noOfItems: number;
  date: string;
  SubCategory: string;
  description: string;
}

export interface CartUserInterface {
 id: number | undefined;
    name: string | undefined;
    phone: number | undefined
}
export interface CartSliceInterface {
  user: CartUserInterface,
  items: CartItemInterface[];
}
export interface PlaceOrderItemInterface {
  'item_id': number,
  'no_of_items': number
}

export interface PlaceOrderPayload {
   order: {
      user_id: number,
   },
  items: PlaceOrderItemInterface
}
export interface PlaceOrderApiResponseInterface {
  message: string,
  data: {
   id: number,
   user_id: number,
   status:string,
   updated_at:Date,
   created_at:Date
  },
 success: boolean
}