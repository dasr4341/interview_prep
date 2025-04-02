/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import OrderButton from '../../Components/Button/OrderButton';
import { Outlet, Link, useParams } from 'react-router-dom';
import routes from '../../Lib/Routes/Routes';
import { OrderPage, STATUS } from '../../Lib/Helper/constants';
import { useDispatch } from 'react-redux';
import { helperSliceActions } from '../../Lib/Store/Helper/Helper.Slice';
import { orderSliceActions } from '../../Lib/Store/Order/Order.slice';
import { ItemHelperSliceActions } from '../../Lib/Store/ItemHelper/ItemHelper.Slice';

function Order() {
  const dispatch = useDispatch();
  const { pageType } = useParams();
  const [activeBtn, setActiveBtn] = useState(pageType);

  // getting the pageType from the urlParams
  if (!pageType) {
    dispatch(
      helperSliceActions.setRedirectUrl(routes.dashboard.children.order.children.pages.fullPath(OrderPage.NEW_ORDER))
    );
  }

  // 1. New order:
  let orderStatus = STATUS.PENDING;
  if (pageType === OrderPage.PREPARATION) {
    // 2. Preparation
    orderStatus = STATUS.CONFIRMED;
  } else if (pageType === OrderPage.READY_TO_DELIVER) {
    // 3. Ready  To Deliver
    orderStatus = STATUS.PREPARATION;
  } else if (pageType === OrderPage.ALL_ORDERS) {
    // 4. View Past Order
    orderStatus = STATUS.DELIVERED;
  }

  useEffect(() => {
    // getting the order data for particular order status -> pageType
    dispatch(orderSliceActions.getOrders({ orderStatus: orderStatus }));
    // getting left over data of -> 'Items' from server
    // which will help to decide how much items can be ordered
    // this check is done in IncrementDecrementButton.tsx
    dispatch(ItemHelperSliceActions.getLeftAllItemsLeftOverQuantity());
    setActiveBtn(pageType);
  }, [pageType]);

  return (
    <div className='bg-theme-bg h-full w-full p-2 overflow-auto'>
      <div
        className='flex flex-col-reverse justify-between items-stretch
        md:flex-row md:items-center mb-2'>
        <div
          className={`flex flex-row overflow-x-auto  md:justify-items-center justify-between bg-white px-2 pt-2 rounded-md mt-2 
          md:mt-0 md:flex-row  items-center ${pageType === OrderPage.ALL_ORDERS && 'py-2'}  `}>
          <Link
            to={routes.dashboard.children.order.children.pages.fullPath(OrderPage.NEW_ORDER)}
            onClick={() => setActiveBtn(OrderPage.NEW_ORDER)}>
            <OrderButton
              downArrow={activeBtn === OrderPage.NEW_ORDER}
              bgColor={activeBtn === OrderPage.NEW_ORDER ? 'black' : 'slate'}
              iconStyle='mr-1.5'
              stroke={activeBtn === OrderPage.NEW_ORDER ? 'white' : 'black'}>
              <> New Orders</>
            </OrderButton>
          </Link>
          <span className='md:text-3xl text-sm md:block'>&#8594;</span>
          <Link
            to={routes.dashboard.children.order.children.pages.fullPath(OrderPage.PREPARATION)}
            onClick={() => setActiveBtn(OrderPage.PREPARATION)}>
            <OrderButton
              downArrow={activeBtn === OrderPage.PREPARATION}
              bgColor={activeBtn === OrderPage.PREPARATION ? 'black' : 'slate'}
              iconStyle=' mr-1.5'
              stroke={activeBtn === OrderPage.PREPARATION ? 'white' : 'black'}>
              <>Preparation</>
            </OrderButton>
          </Link>
          <span className='md:text-3xl text-sm md:block'>&#8594;</span>
          <Link
            to={routes.dashboard.children.order.children.pages.fullPath(OrderPage.READY_TO_DELIVER)}
            onClick={() => setActiveBtn(OrderPage.READY_TO_DELIVER)}>
            <OrderButton
              downArrow={activeBtn === OrderPage.READY_TO_DELIVER}
              bgColor={activeBtn === OrderPage.READY_TO_DELIVER ? 'black' : 'slate'}
              iconStyle=' mr-1.5'
              stroke={activeBtn === OrderPage.READY_TO_DELIVER ? 'white' : 'black'}>
              <>Ready To Deliver</>
            </OrderButton>
          </Link>
        </div>

        <div className='md:ml-2 '>
          <Link
            to={routes.dashboard.children.order.children.pages.fullPath(OrderPage.ALL_ORDERS)}
            onClick={() => setActiveBtn(OrderPage.ALL_ORDERS)}>
            <div
              className={`py-1 px-3 rounded-md ${
                activeBtn === OrderPage.ALL_ORDERS ? 'bg-black text-slate-100' : 'bg-white text-slate-700'
              }`}>
              <span className={`font-normal tracking-wider   text-sm ${activeBtn === OrderPage.ALL_ORDERS && 'p-1'}`}>
                View Past Orders
              </span>
            </div>
          </Link>
        </div>
      </div>
      <Outlet />
    </div>
  );
}

export default Order;
