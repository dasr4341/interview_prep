import { Link } from 'react-router-dom';
import ButtonComponent from '../../Components/Button/ButtonComponent';
import Tag from '../../Components/Tag/Tag';
import DoneIcon from '../../Icons/Done-Icon';
import { OrderPage } from '../../Lib/Helper/constants';
import { CartItemInterface, CartUserInterface } from '../../Lib/Interface/Cart/CartInterface';
import routes from '../../Lib/Routes/Routes';
import { cartSliceActions } from '../../Lib/Store/Cart/Cart.slice';
import { useAppDispatch, useAppSelector } from '../../Lib/Store/hooks';

function HelperCart({ id, name, phone }: CartUserInterface) {
  const dispatch = useAppDispatch();

  const cartData: CartItemInterface[] = useAppSelector((state) => state.cart.cart.items);
  const cartUser: CartUserInterface = useAppSelector((state) => state.cart.cart.user);

  const placeOrderHandler = () => {
    // getting the needed key : value pair
    const itemData = cartData.map((element) => {
      return {
        item_id: element.id,
        no_of_items: element.noOfItems,
      };
    });
    // arranging the data to send to the server
    const placeOrderData = {
      order: {
        user_id: cartUser.id,
      },
      items: itemData,
    };
    dispatch(cartSliceActions.placeOrder(placeOrderData));
  };

  return (
    <>
      {cartData.length === 0 ? (
        // if cartData is empty then the order is placed successfully
        // we will show the success message
        <>
          <div className='text-white flex flex-col justify-center items-center'>
            <DoneIcon style='w-10 h-10' color='rgb(53, 217, 72)' />
            <div className='text-3xl font-extra-bold mt-4'>Congratulations </div>
            <div className='font-extralight mt-2 tracking-widest'>Order Placed Successfully</div>
            <Link to={routes.dashboard.children.order.children.pages.fullPath(OrderPage.NEW_ORDER)}>
              <div className='text-extra-light mt-2 tracking-widest text-green-200 text-xs hover:underline hover:cursor-pointer'>
                Click to check orders
              </div>
            </Link>
          </div>
        </>
      ) : (
        // if cartData is not empty then we will ---
        // allow the user to place the order
        <>
          <div className='flex flex-col mb-6 bg-theme-overlay p-3 rounded'>
            <Tag bg={true} padding='py-0.5 px-2 w-fit inline' textSize='xs'>
              <span>Selected</span>
            </Tag>
            <span className='text-slate-300 text-2xl tracking-widest font-light mt-1 md:text-3xl '>
              Customer Details
            </span>
            <span className='text-slate-300 text-xl tracking-widest font-semibold md:mt-4 mt-3 md:text-xl capitalize'>
              {name} #{id}
            </span>
            <span className='text-slate-300 text-xs  tracking-widest md:text-sm'>Phone: {phone}</span>
            <span className='text-green-400 text-xs mt-4 tracking-widest '>
              NOTE : Order will be placed under this user
            </span>
          </div>

          <div className='pt-4 pb-4 bottom-0 absolute left-10 right-10'>
            <ButtonComponent
              type='submit'
              color='black'
              textStyle='uppercase tracking-widest text-sm font-normal'
              onclick={placeOrderHandler}>
              Place Order
            </ButtonComponent>
          </div>
        </>
      )}
    </>
  );
}

export default HelperCart;
