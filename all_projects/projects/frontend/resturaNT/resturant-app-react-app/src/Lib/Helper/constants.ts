export enum STATUS {
  // orderStatus
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PREPARATION = 'ready',
  DELIVERED = 'delivered',
}
export enum OrderPage {
  // pageType
  NEW_ORDER = 'new-order',
  PREPARATION = 'preparation',
  READY_TO_DELIVER = 'ready-To-Deliver',
  ALL_ORDERS = 'all-orders',
}
export enum NoOfItemsCountHandlerActions {
  ADD = 'add',
  SUBTRACT = 'deduct',
}
export enum IncrementDecrementButtonType {
  ORDER = 'order',
  CART = 'cart',
}
export enum CartOverLayContentType {
  SEARCH = 'search',
  PLACE = 'place',
  CREATE = 'create',
}
