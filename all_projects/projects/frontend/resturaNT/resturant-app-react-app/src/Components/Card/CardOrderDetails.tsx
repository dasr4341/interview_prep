import Tag from '../Tag/Tag';
import GetOrderChangeStatusButton from '../../Lib/Helper/GetOrderChangeStatusButton';
import { STATUS } from '../../Lib/Helper/constants';
import { orderSliceActions } from '../../Lib/Store/Order/Order.slice';
import { useDispatch } from 'react-redux';
import { useState } from 'react';
import ParticularOrderDetail from '../../Page/Order/ParticularOrderDetail';
import { CardOrderDetailsInterface } from '../../Lib/Interface/CardComponent/CardOrderDetailsInterface';

function CardOrderDetails(props: CardOrderDetailsInterface) {
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const dispatch = useDispatch();

  const orderChangeStatusButtonHandler = () => {
    dispatch(
      orderSliceActions.setOrderStatus({
        orderId: props.orderId,
        status: STATUS.DELIVERED,
        orderStatus: props.orderStatus
      })
    );
  };

  return (
    <div className='relative '>
      <div
        className={`py-3 px-4 mb-4 bg-white rounded-md border
      flex flex-col justify-between items-start content-start
      md:flex  md:flex-row md:content-center md:items-center 
     ${props.hover === true && 'hover:shadow-md'}
     ${showOrderDetails && 'border-1 border-black bg-zinc-800 text-white'}
     hover:bg-zinc-800 hover:shadow-md hover:text-white
     `}
        key={props.orderId}>
        <div
          className={` ${!props.showAddOn && 'w-full'}`}
          onClick={() => {
            setShowOrderDetails(!showOrderDetails);
          }}>
          <span>
            Order ID
            <Tag bold='dark'>
              <>#{props.orderId}</>
            </Tag>
          </span>
          <div className='flex flex-row justify-between items-center  mt-4'>
            <div className=' flex flex-row items-center '>
              <Tag bg={true} textColor='400' textSize='sm'>
                <> {props.orderNoOfItems}</>
              </Tag>
              <Tag bg={true} textColor='400' textSize='sm'>
                <>{props.orderPrice}</>
              </Tag>
            </div>
            <Tag textColor='400' textSize='xs' padding='px-1 py-1'>
              <>{props.orderTime} </>
            </Tag>
          </div>
        </div>

        {/* only to be included in -> 3. Ready  To Deliver page   */}
        {props.showAddOn && (
          <>
            <Tag textColor='slate-6' textSize='sm' margin='hidden md:block'>
              <>Order OTP : {props.orderId}</>
            </Tag>
            <div className='flex flex-row items-center justify-between w-full md:w-auto mt-4 md:mt-0  '>
              <Tag textSize='sm' margin='md:hidden'>
                <>Order OTP : {props.orderId}</>
              </Tag>
              <GetOrderChangeStatusButton
                type={props.pageType}
                onClickHandler={orderChangeStatusButtonHandler}
                orderStatus={props.orderStatus}
              />
            </div>
          </>
        )}
      </div>
      <div
        className={`md:hidden block mb-4 rounded-md duration-400 w-full h-full ${
          showOrderDetails ? 'block bottom-auto' : ' bottom-[-100%] hidden'
        }`}>
        {/* on mobile ->> we will show the orderDetails like below , on bigger screens we will show the orderDetails in ->> AllOrders.tsx page  */}
        {!props.showAddOn && props.pageType && (
          <ParticularOrderDetail pageType={props.pageType} orderId={props.orderId} />
        )}
      </div>
    </div>
  );
}

export default CardOrderDetails;
