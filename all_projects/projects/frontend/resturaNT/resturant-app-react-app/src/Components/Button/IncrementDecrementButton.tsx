import React, { useState } from 'react';
import Tag from '../Tag/Tag';
import { orderSliceActions } from '../../Lib/Store/Order/Order.slice';
import { useDispatch } from 'react-redux';
import { cartSliceActions } from '../../Lib/Store/Cart/Cart.slice';
import { useAppSelector } from '../../Lib/Store/hooks';
import { helperSliceActions } from '../../Lib/Store/Helper/Helper.Slice';
import { IncrementDecrementButtonType, NoOfItemsCountHandlerActions } from '../../Lib/Helper/constants';

export interface IncrementDecrementButtonInterface {
  quantity: number;
  itemId: number;
  orderItemId?: number;
  orderId?: number;
  type: IncrementDecrementButtonType;
}
 
function IncrementDecrementButton(props: IncrementDecrementButtonInterface) {
  const [count, setCount] = useState(props.quantity);
  const dispatch = useDispatch();
  // getting the left over quantity of all the items from store
  const ItemLeftoverQuantity = useAppSelector((state) => state.ItemHelper.itemHelper);


  const noOfItemsCountHandler = (noOfItems: number, actionType: string) => {
    const leftQuantity = ItemLeftoverQuantity.find((element) => element.itemId === props.itemId);

    // we have two parts :
    // 1. order -> order page increment decrement button
    // 2. cart -> cart page increment decrement button

    if (noOfItems >= 0 &&
      props.type === IncrementDecrementButtonType.ORDER &&
      ((!!leftQuantity?.leftOver && leftQuantity?.leftOver >= noOfItems) || actionType === NoOfItemsCountHandlerActions.SUBTRACT)) {
      dispatch(
        orderSliceActions.setNoOfItems({
          itemId: props.orderItemId,
          noOfItems,
          orderId: props.orderId,
        })
      );
      setCount(noOfItems);
    } else if (
      props.type === IncrementDecrementButtonType.CART &&
      !!noOfItems &&
      (
        (!!leftQuantity?.leftOver && leftQuantity?.leftOver >= noOfItems) ||
        actionType === NoOfItemsCountHandlerActions.SUBTRACT
      )
    ) {
      // if the IncrementDecrementButtonType is === CART &&
      // noOfItems > 0
      // leftQuantity(which is a object) is not undefined for this particular item && leftQuantity.leftOver > noOfItems  -> that means
      // we have some leftover item ->>> so we allow the user to add items
      // or
      // if the the action  === deduct (  actionType === NoOfItemsCountHandlerActions.SUBTRACT)
      // then we also allow the user so that , the user can able to deduct the noOfItems

      dispatch(
        cartSliceActions.setNoOfItems({
          itemId: props.itemId,
          noOfItems,
        })
      );
      setCount(noOfItems);

    } else if (
      props.type === IncrementDecrementButtonType.CART &&
      !noOfItems
    ) {
      // if the IncrementDecrementButtonType is === CART &&
      // and noOfItems === 0 , which is a falsy value && can be written as ->> !noOfItems 
      // that means the noOfItems is 0 &&  in that case we will ->> delete the item from cart store
      dispatch(
        cartSliceActions.deleteItems({
          itemId: props.itemId,
        })
      );
      setCount(noOfItems);
    } else {
      dispatch(
        helperSliceActions.setToastMessage({ message: `Now only ${noOfItems - 1} items are left `, success: false })
      );
    }

  };

  return (
    <div className='flex flex-row justify-center w-fit items-center shadow-sm rounded-md  shadow-teal-500 md:px-1 md:py-0.5'>
      <button
        className='px-2 text-sm rounded hover:bg-red-500  hover:text-white'
        onClick={() => noOfItemsCountHandler(count - 1, NoOfItemsCountHandlerActions.SUBTRACT)}>
        -
      </button>
      <Tag margin='0' textColor='slate-6' textSize='xs' padding='md:py-1 md:px-2 py-0 p-1 '>
        <>{count}</>
      </Tag>
      <button
        className='px-2 text-sm rounded hover:bg-green-500 hover:text-white'
        onClick={() => noOfItemsCountHandler(count + 1, NoOfItemsCountHandlerActions.ADD)}>
        +
      </button>
    </div>
  );
}

export default IncrementDecrementButton;
