/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import OrderStatusSkeletonLoading from '../../Components/SkeletonLoading/OrderStatusSkeletonLoading';
import Tag from '../../Components/Tag/Tag';
import CookingIcon from '../../Icons/Cooking-Icon';
import DeliveryIcon from '../../Icons/Delivery-Icon';
import DoneIcon from '../../Icons/Done-Icon';
import DownArrowIcon from '../../Icons/DownArrow-Icon';
import LoadingIcon from '../../Icons/Loading-Icon';
import LocationIcon from '../../Icons/Location-Icon';
import RestaurantIcon from '../../Icons/Restaurant-Icon';
import UpArrowIcon from '../../Icons/UpArrow-Icon';
import { STATUS } from '../../Lib/Helper/constants';
import { getDate } from '../../Lib/Helper/helper';
import { ItemInterface } from '../../Lib/Interface/Order/Order.Interface';
import { useAppDispatch, useAppSelector } from '../../Lib/Store/hooks';
import { orderSliceActions } from '../../Lib/Store/Order/Order.slice';

// using this colors for orderStatus.tsx page icons fill color
enum OrderColors {
  done = 'rgb(53, 217, 72)',
  pending = 'rgb(212, 212, 212)',
}

function OrderStatus() {
  const { orderId } = useParams();
  const [dropDown, setDropDown] = useState(false);
  const dispatch = useAppDispatch();
  const userOrderData = useAppSelector((state) => state.order.orders.userOrderStatus);
  useEffect(() => {
    if (!userOrderData.loading) {
      dispatch(orderSliceActions.getOrderById({ orderId }));
    }
  }, [orderId]);

  return (
    <section className='w-full bg-theme-bg min-h-[100vh]'>
      <section className='bg-white flex md:px-6 px-2 md:mb-8 mb-1 py-4 shadow-lg justify-between items-center'>
        <div className='leading-5 flex items-center'>
          <RestaurantIcon style='md:w-10 md:h-10 w-5 h-5 bg-black md:p-1 p-[2px] rounded ' />
          <span className='ml-4 text-slate-500 font-light text-sm md:text-lg tracking-wider font-bold uppercase text-'>
            Gangoti
          </span>
        </div>
      </section>
      {userOrderData.loading && <OrderStatusSkeletonLoading />}
      {!userOrderData.loading && (
        <section className='flex pb-8 md:w-[90%] gap-2 m-auto justify-center top-0'>
          {/* card */}
          <div className=' bg-white md:w-[50%] w-full rounded flex flex-col p-2 '>
            <div className='flex justify-between items-start p-2 '>
              <div className='flex flex-col w-full'>
                <span className='text-sm md:text-2xl text-slate-700 flex items-center font-semibold'>
                  Your order has been Placed <DoneIcon style='w-4 h-4 ml-2' color='rgb(53, 217, 72)' />
                </span>
                <span className='text-xs font-light '>
                  &nbsp;
                  {userOrderData.details !== null &&
                    `${getDate(new Date(), new Date(userOrderData.details.createdAt))} `}
                </span>
                {/* user details */}
                <span className='text-sm md:text-sm flex items-center font-medium text-slate-600 tracking-wider mt-1'>
                  {`${userOrderData.details?.userDetails.name} | ${userOrderData.details?.userDetails.phone}`}
                </span>
                {/* order details section */}
                <div className='mt-6 '>
                  <div
                    className='flex items-center justify-between w-full bg-slate-100 py-1 px-2 rounded  hover:cursor-pointer '
                    onClick={() => setDropDown(!dropDown)}>
                    <div className=' flex items-center'>
                      <span className='font-medium text-slate-700 mr-2'>
                        Order Details ( {userOrderData?.details?.items.length} Items)
                      </span>
                      <Tag bg={true} textSize='xs' bold='light'>
                        <>{userOrderData.details?.status}</>
                      </Tag>
                    </div>
                    <span>
                      {dropDown ? (
                        <UpArrowIcon style='w-5 h-5 ' color='rgb(51 65 85)' />
                      ) : (
                        <DownArrowIcon style='w-5 h-5 ' color='rgb(51 65 85)' />
                      )}
                    </span>
                  </div>
                  {/* Drop Down */}
                  {dropDown && (
                    <div className='mt-2 px-2'>
                      {userOrderData?.details?.items.map((element, index) => {
                        return (
                          <div className='capitalize text-xs md:text-sm tracking-wider font-light flex justify-between'>
                            <span>{`${index + 1}. ${element.itemName}`}</span>
                            <span>{`${element.noOfItems} x ${element.itemPrice}`}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  <div className='bg-theme-bg  p-1 mt-2  text-sm md:text-base'>
                    <div className='px-2 flex justify-between tracking-wide '>
                      <span className=' text-slate-700'>Order Id </span>
                      <span>#&nbsp;{userOrderData.details?.id}</span>
                    </div>
                    <div className='px-2 flex justify-between  tracking-wide '>
                      <span className=' text-slate-700'>Delivery </span>
                      <span className='text-green-500'>Free</span>
                    </div>
                    <div className='px-2 flex justify-between  tracking-wide  '>
                      <span className=' text-slate-700'>To Pay</span>
                      <span className=' text-slate-700'>
                        &#8377; &nbsp;
                        {userOrderData.details !== null &&
                          `${userOrderData.details.items.reduce(
                            (sum: number, current: ItemInterface) => sum + current.noOfItems * current.itemPrice,
                            0
                          )} `}
                      </span>
                    </div>
                  </div>
                </div>
                {/* order details section ends */}
              </div>
            </div>
            <hr />
            {/* order status graphical interface */}
            <div className='p-2 gap-y-8 grid grid-cols-5 justify-items-start items-center self-start '>
              {/* ---------------------------------------- LEVEL 1-------------------------------------------------- */}
              {/* if order status is === pending , order level == 1 */}
              {/* 1. order not confirmed */}
              <div className='col-span-1 timeline-container mt-4'>
                <div className='timeline bg-black rounded-[50%] py-2 px-3 h-fit w-fit'>
                  <LoadingIcon
                    style={`${userOrderData.details?.status === STATUS.PENDING ? 'hourglass-animated' : 'hourglass'} w-3 h-5 md:w-4 md:h-6`}
                    outerStyle={userOrderData.details?.status === STATUS.PENDING ? 'orderStatus-pending' : 'outer'}
                  />
                </div>
              </div>
              <div className='col-span-4 bg-theme-bg tracking-wider p-2 mt-4 text-slate-700 text-light w-full  text-xs md:text-sm rounded md:text-sm'>
                Order waiting for conformation
              </div>
              {/* ---------------------------------------- LEVEL 2-------------------------------------------------- */}
              {/* if order status is === confirmed , order level == 2 */}
              {/* 2. order confirmed */}
              <div className='col-span-1 timeline-container '>
                <div className='timeline bg-black rounded-[50%] p-3 h-fit w-fit '>
                  <DoneIcon style='md:w-5 w-3 md:h-5 h-3 ' color={userOrderData.details?.status === STATUS.CONFIRMED ||
                    userOrderData.details?.status === STATUS.DELIVERED || 
                    userOrderData.details?.status === STATUS.PREPARATION ? OrderColors.done : OrderColors.pending} />
                </div>
              </div>
              <div className='col-span-4 bg-theme-bg tracking-wider p-2 text-slate-700 text-light w-full text-xs md:text-sm rounded md:text-sm  '>
                Order Confirmed
              </div>
              {/* ---------------------------------------- LEVEL 3-------------------------------------------------- */}
              {/* if order status is === confirmed , order level == 3 */}
              {/* 3. preparation */}
              <div className='col-span-1 timeline-container '>
                <div className='timeline bg-black rounded-[50%] p-3  h-fit w-fit'>
                  <CookingIcon style='md:w-5 w-3 md:h-5 h-3  rounded' color={userOrderData.details?.status === STATUS.CONFIRMED ||
                    userOrderData.details?.status === STATUS.DELIVERED ||
                    userOrderData.details?.status === STATUS.PREPARATION ? OrderColors.done : OrderColors.pending} />
                </div>
              </div>
              <div className='col-span-4 bg-theme-bg tracking-wider p-2 text-slate-700 text-light w-full  text-xs md:text-sm rounded md:text-sm  '>
                Order is preparing
              </div>
              {/* ---------------------------------------- LEVEL 4 -------------------------------------------------- */}
              {/* if order status is === ready , order level == 4 */}
              {/* 4. ready to deliver */}
              <div className='col-span-1 timeline-container '>
                <div className='timeline  bg-black rounded-[50%] p-3  h-fit w-fit '>
                  <DeliveryIcon style='md:w-5 w-3 md:h-5 h-3  rounded' color={userOrderData.details?.status === STATUS.DELIVERED ||
                    userOrderData.details?.status === STATUS.PREPARATION ? OrderColors.done : OrderColors.pending} />
                </div>
              </div>
              <div className='col-span-4 bg-theme-bg tracking-wider p-2 text-slate-700 text-light w-full text-xs md:text-sm rounded md:text-sm  '>
                Ready To Deliver
              </div>

              {/* ---------------------------------------- LEVEL 5 -------------------------------------------------- */}
              {/* if order status is === delivered , order level == 5 */}
              {/* 4. ready to deliver */}
              <div className='col-span-1 timeline-container '>
                <div className='timeline  bg-black rounded-[50%] p-3  h-fit w-fit '>
                  <LocationIcon style='md:w-5 w-3 md:h-5 h-3  rounded' color={userOrderData.details?.status === STATUS.DELIVERED ? OrderColors.done : OrderColors.pending} />
                </div>
              </div>
              <div className='col-span-4 bg-theme-bg tracking-wider p-2 text-slate-700 text-light w-full text-xs md:text-sm rounded md:text-sm  '>
                Delivered 
                <span className='text-xs p-1'>({ userOrderData.details?.userDetails.address})</span>
              </div>
            </div>
            <div className=' bg-slate-700 w-full text-sm p-2 mt-4 rounded text-white tracking-wider font-light'>
              For any kind of query can contact out customer executive at --&nbsp;
              <a href={`tel:+91${process.env.REACT_APP_CUSTOMER_CARE}`}>
                <span className='text-white font-bold'>+91{process.env.REACT_APP_CUSTOMER_CARE}</span>
              </a>
            </div>
          </div>
        </section>
      )}
    </section>
  );
}

export default OrderStatus;
