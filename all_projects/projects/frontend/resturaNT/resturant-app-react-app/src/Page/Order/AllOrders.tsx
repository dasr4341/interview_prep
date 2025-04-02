/* eslint-disable react-hooks/exhaustive-deps */
import CardOrderDetails from '../../Components/Card/CardOrderDetails';
import { Link, useParams } from 'react-router-dom';
import routes from '../../Lib/Routes/Routes';
import { getDate } from '../../Lib/Helper/helper';
import ParticularOrderDetail from '../Order/ParticularOrderDetail';
import { OrderDetailsInterface, OrderInterface } from '../../Lib/Interface/Order/Order.Interface';
import 'react-toastify/dist/ReactToastify.css';
import { OrderPage } from '../../Lib/Helper/constants';
import WarningIcon from '../../Icons/Warning-icon';
import { useAppSelector } from '../../Lib/Store/hooks';
import OrderSkeletonLoading from '../../Components/SkeletonLoading/OrderSkeletonLoading';

function AllOrders() {
  const { orderId, pageType } = useParams();

  // i am getting the value of orders from store (redux)
  const allOrder: OrderInterface = useAppSelector((state) => state.order.orders);
  const allOrderDetails: OrderDetailsInterface[] = allOrder.details;

  // we have 4 sections : ---------------

  // 1. New order :
  // - a.[orderStatus == PENDING] -> we are storing the values in the variables , according to pageType
  // - b.[cardUrlPath = the path the cart will redirect] -> according to the pageType we are storing cardRedirect path to a variable

  // 2. Preparation
  // - a.[orderStatus == CONFIRMED] -> we are storing the values in the variables , according to pageType
  // - b.[cardUrlPath = the path the cart will redirect] -> according to the pageType we are storing cardRedirect path to a variable

  // 3. Ready  To Deliver
  // - a.[orderStatus == PREPARATION] -> we are storing the values in the variables , according to pageType
  // - b.[cardUrlPath = the path the cart will redirect] -> we will not store the link path, as we don't want to show the order details respective to this orderStatus

  // 4. View Past Order
  // - a.[orderStatus == DELIVERED] -> we are storing the values in the variables , according to pageType
  // - b.[cardUrlPath = the path the cart will redirect] -> we will not store the link path, as we don't want to show the order details respective to this orderStatus

  return (
    <>
      <section className='grid grid-cols-1 md:grid-cols-6  '>
        <div
          className={`${
            pageType === OrderPage.ALL_ORDERS || pageType === OrderPage.READY_TO_DELIVER ? 'col-span-6' : 'col-span-2'
          } `}>
          {/* we are showing a loading animation  */}
          {allOrder.loading &&
            new Array(5).fill(<OrderSkeletonLoading pageType={pageType} />).map((element) => element)}

          {/* below 'map' function returns the order cart  */}
          {/* onClick --> this cart will show the orderDetails ** , (for only -- 1. New order && 2. Preparation) */}
          {!allOrder.loading &&
            allOrderDetails.map((element: OrderDetailsInterface) => {
              // calculating the grandTotal
              const grandTotal = element.items.reduce(
                (sum: number, current) => sum + current.itemPrice * current.noOfItems,
                0
              );
              return (
                // ** here  we have just make the url here , with the help('fullPath(pageType as OrderPage, element.id)') of the function in -> routes.ts page
                // fullPath(pageType as OrderPage, element.id) -> two parameters : 1. pageType (url Params) 2. orderId
                // and for only -> 1. NEW_ORDER && 2.PREPARATION
                // the card will be clickable
                <Link
                  // ** we are getting the url
                  to={`${
                    pageType === OrderPage.NEW_ORDER || pageType === OrderPage.PREPARATION
                      ? routes.dashboard.children.order.children.pages.fullPath(pageType as OrderPage, element.id)
                      : ''
                  }`}
                  key={`${element.id}`}>
                  <CardOrderDetails
                    orderId={element.id}
                    orderNoOfItems={`${
                      element.items.length > 1 ? element.items.length + ' Items' : element.items.length + ' Item'
                    }`}
                    orderPrice={`₹ ${grandTotal}`}
                    orderTime={getDate(new Date(), new Date(element.createdAt))}
                    hover={true}
                    showAddOn={pageType === OrderPage.READY_TO_DELIVER || pageType === OrderPage.ALL_ORDERS}
                    orderStatus={element.status}
                    // if pageType is undefined then we will send  OrderPage.NEW_ORDER as pageType
                    pageType={pageType ? pageType : OrderPage.NEW_ORDER}
                  />
                </Link>
              );
            })}

          {/* if order related to order status not found then we will show the error msg  */}
          {!allOrder.loading && !allOrderDetails.length && (
            <div className='bg-white p-4  rounded-md text-red-600 flex flex-row'>
              <WarningIcon /> <span className='ml-3'>Oops , No Orders Found ! </span>
            </div>
          )}
        </div>

        <div className='hidden md:block md:col-span-4 px-2 '>
          {/* ** onClick --> of order Cart it will redirect to = /{cardUrlPath}/{orderID}  */}
          {/* when orderID exist then we will show the orderDetails */}
          {/* ParticularOrderDetail -> will show the details according to the orderId  */}
          {!!orderId && pageType && <ParticularOrderDetail pageType={pageType} orderId={parseInt(orderId)} />}
        </div>
      </section>
    </>
  );
}

export default AllOrders;
