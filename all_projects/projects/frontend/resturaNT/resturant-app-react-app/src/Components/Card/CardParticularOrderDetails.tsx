import CardParticularOrderDetailsHelper from './CardParticularOrderDetailsHelper';
import Tag from '../Tag/Tag';
import { getDate } from '../../Lib/Helper/helper';
import { ItemInterface, OrderDetailsInterface } from '../../Lib/Interface/Order/Order.Interface';
import WarningIcon from '../../Icons/Warning-icon';
import { useDispatch } from 'react-redux';
import { orderSliceActions } from '../../Lib/Store/Order/Order.slice';
import { OrderPage, STATUS } from '../../Lib/Helper/constants';
import GetOrderChangeStatusButton from '../../Lib/Helper/GetOrderChangeStatusButton';

function CardParticularOrderDetails({ order, pageType }: { order: OrderDetailsInterface; pageType: string }) {
  const dispatch = useDispatch();
  const items: ItemInterface[] = [];
  let totalAmount = 0;
  const preparationTime = 0;

  if (order.items && order.items.length > 0) {
    for (const key in order.items) {
      items.push(order.items[key]);
      totalAmount += order.items[key].itemPrice * order.items[key].noOfItems;
    }
  }

  const OrderChangeStatusButtonHandler = () => {
    dispatch(
      orderSliceActions.setOrderStatus({
        orderId: order.id,
        status: pageType === OrderPage.NEW_ORDER ? STATUS.CONFIRMED : STATUS.PREPARATION,
        orderStatus: order.status,
      })
    );
  };

  return (
    <div className='bg-white p-4 rounded-md flex flex-col   '>
      {/* header of the order details card */}
      <div className='flex flex-row justify-between '>
        <span className='md:text-2xl text-base'>
          Order ID
          <Tag bold='dark'>
            <>#{order.id}</>
          </Tag>
        </span>
        <span className='text-base md:text-xl font-bold text-slate-600 md:text-black mt-1 md:mt-auto'>
          Order OTP {order.id}
        </span>
      </div>
      <div className='flex flex-row justify-items-center items-center mt-4 md:mt-2'>
        <Tag bg={true} textColor='400' textSize='sm'>
          <>
            {items.length} {items.length > 0 ? 'Items' : 'Item'}
          </>
        </Tag>
        <Tag textColor='400' textSize='sm'>
          <> {getDate(new Date(), new Date(order.createdAt))}</>
        </Tag>
      </div>

      {/* this 'map' will show all the items related to particular order  */}
      <div className='flex flex-col mt-6'>
        {items.map((element) => {
          return (
            <CardParticularOrderDetailsHelper
              noOfItem={element.noOfItems}
              pricePerItem={element.itemPrice * element.noOfItems}
              categoryName={element.itemSubCategory}
              imageSrc={element.itemImage}
              itemName={element.itemName}
              key={element.id * 100}
              orderItemId={element.id}
              itemId={element.itemId}
              orderId={order.id}
              showIncrementButton={pageType === OrderPage.NEW_ORDER}
            />
          );
        })}
        {/* in case of no items found in an order */}
        {!order.items.length && (
          <div className='bg-white py-4 rounded-md text-slate-400 text-sm  flex flex-row items-center justify-center'>
            <WarningIcon bgColor='red' /> <span className='ml-3'>No Items Found</span>
          </div>
        )}
      </div>

      {/* bottom section */}
      <div className='flex flex-row justify-between items-center  mt-14'>
        <div className='flex flex-row'>
          <div className='flex flex-col justify-start'>
            <Tag textColor='slate-6' textSize='sm'>
              <>Prep Time</>
            </Tag>
            <Tag bold='light' textSize='sm'>
              <> {preparationTime} Min</>
            </Tag>
          </div>
          <div className='bg-slate-400 w-0.5'></div>
          <div className='flex flex-col justify-start'>
            <Tag textColor='slate-6' textSize='sm'>
              <>Total</>
            </Tag>
            <Tag bold='light' textSize='sm'>
              <> ₹ {totalAmount}</>
            </Tag>
          </div>
        </div>
        <GetOrderChangeStatusButton
          type={pageType}
          onClickHandler={OrderChangeStatusButtonHandler}
          orderStatus={order.status}
        />
      </div>
    </div>
  );
}

export default CardParticularOrderDetails;
