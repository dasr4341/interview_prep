import { useNavigate } from 'react-router-dom';
import CardParticularOrderDetails from '../../Components/Card/CardParticularOrderDetails';
import WarningIcon from '../../Icons/Warning-icon';
import { OrderInterface } from '../../Lib/Interface/Order/Order.Interface';
import { OrderPage, STATUS } from '../../Lib/Helper/constants';
import { useAppSelector } from '../../Lib/Store/hooks';

export default function ParticularOrderDetail({ orderId, pageType }: { orderId: number; pageType: string }) {
  const navigate = useNavigate();

  // getting the info from store
  const allOrder: OrderInterface = useAppSelector((state) => state.order.orders);
  // finding the particular order  with respect to the orderId provided
  const particularOrder = allOrder.details.find((order) => order.id == orderId);

  if (
    (pageType === OrderPage.NEW_ORDER && particularOrder?.status !== STATUS.PENDING) ||
    (pageType === OrderPage.PREPARATION && particularOrder?.status !== STATUS.CONFIRMED)
  ) {
    navigate('./');
  }

  return (
    <>
      {!!particularOrder && <CardParticularOrderDetails order={particularOrder} pageType={pageType} />}
      {!particularOrder && (
        <div className='bg-white p-4 rounded-md text-red-600 flex flex-row '>
          <WarningIcon /> <span className='ml-3'>No Orders Found</span>
        </div>
      )}
    </>
  );
}
