/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../Lib/Store/hooks';
import WarningIcon from '../../Icons/Warning-icon';
import { CartItemInterface, CartUserInterface } from '../../Lib/Interface/Cart/CartInterface';
import CardPlaceOrderCartHelper from '../../Components/Card/CardPlaceOrderCartHelper';
import Tag from '../../Components/Tag/Tag';
import { cartSliceActions } from '../../Lib/Store/Cart/Cart.slice';
import ButtonComponent from '../../Components/Button/ButtonComponent';
import UserRegistration from '../UserRegistration/UserRegistration';
import HelperCart from './HelperCart';
import SearchUser from './SearchUser/SearchUser';
import LeftArrowIcon from '../../Icons/LeftArrow-Icon';
import CloseIcon from '../../Icons/Close-Icon';
import { ItemHelperSliceActions } from '../../Lib/Store/ItemHelper/ItemHelper.Slice';
import { CartOverLayContentType } from '../../Lib/Helper/constants';

function Cart() {
  const dispatch = useAppDispatch();
  const [overlay, setOverlay] = useState(false);
  const [showSearchHelperOrRegHelper, setShowSearchHelperOrRegHelper] = useState(CartOverLayContentType.SEARCH);

  const cartData: CartItemInterface[] = useAppSelector((state) => state.cart.cart.items);
  const cartUser: CartUserInterface = useAppSelector((state) => state.cart.cart.user);

  // this no of items ->> parameter will help to find the grand total
  const noOfItem = cartData.length;
  let grandTotal = 0;

  // managing the visibility of overlay
  // NOTE : this over lay contains 3 part (described below **)
  const overLayHandler = (status: boolean) => {
    setOverlay(status);
  };

  // CartOverLayContentTypeHandler ---

  // helps to toggle the state of ->>> setShowSearchHelperOrRegHelper useState hook
  // which in turns helps to toggle the content on overlay

  // ** Three screens are designed on the overlay  : ---
  // 1. < SearchUser />  --> to search the user
  // 2. < UserRegistration/> --> to register the user
  // 3. < HelperCart />  --> to place the order on behalf of selected user

  const CartOverLayContentTypeHandler = (ContentType: CartOverLayContentType) => {
    // when we are toggling the screens on overlay , we are setting the cartUser to undefined
    // as if once the cart user is set then ->>> HelperCart will always overlap
    if (ContentType !== CartOverLayContentType.PLACE) {
      dispatch(
        cartSliceActions.setUser({
          id: undefined,
          name: undefined,
          phone: undefined,
        })
      );
    }
    setShowSearchHelperOrRegHelper(ContentType);
  };

  useEffect(() => {
    dispatch(ItemHelperSliceActions.getLeftAllItemsLeftOverQuantity());
  }, [cartData]);

  return (
    <>
      <div
        className={` fixed top-0 bottom-0 left-0 right-0 w-full h-full  transition-all duration-300 
      grid grid-cols-5 
      ${overlay ? 'left-0 bg-theme-overlay' : 'left-[-100%] '} 
      `}>
        <div className='bg-theme-dark px-4 py-4 flex flex-col  h-full col-span-5  md:col-span-2 overflow-auto relative'>
          <div className='flex flex-row justify-between items-center '>
            {cartData.length > 0 && (
              <LeftArrowIcon
                className='w-9 h-9 rounded-[25px] hover:bg-slate-500 hover:cursor-pointer py-1 pr-1'
                color='white'
                onCLick={() => CartOverLayContentTypeHandler(CartOverLayContentType.SEARCH)}
              />
            )}
            <CloseIcon
              className='w-9 h-9 rounded-[25px] hover:bg-slate-500 hover:cursor-pointer p-1.5 '
              color='white'
              onClick={() => overLayHandler(false)}
            />
          </div>

          <div className='py-5 px-2 mt-2'>
            {showSearchHelperOrRegHelper === CartOverLayContentType.PLACE && (
              <HelperCart id={cartUser.id} name={cartUser.name} phone={cartUser.phone} />
            )}
            {showSearchHelperOrRegHelper === CartOverLayContentType.CREATE && (
              <UserRegistration CartOverLayContentTypeHandler={CartOverLayContentTypeHandler} />
            )}
            {showSearchHelperOrRegHelper === CartOverLayContentType.SEARCH && (
              <SearchUser CartOverLayContentTypeHandler={CartOverLayContentTypeHandler} />
            )}
          </div>
        </div>

        <div className='md:col-span-3 md:block hidden' onClick={() => overLayHandler(false)}></div>
      </div>

      <section className='w-full h-full p-2 grid grid-cols-6 gap-x-2 items-start'>
        <div className='flex flex-col col-span-6 md:col-span-4 overflow-auto md:h-[calc(100vh_-_7rem)]'>
          {cartData.map((element) => {
            grandTotal += element.price * element.noOfItems;
            return (
              <CardPlaceOrderCartHelper
                noOfItem={element.noOfItems}
                pricePerItem={element.price}
                itemDescription={element.description}
                categoryName={element.SubCategory}
                imageSrc={element.img}
                itemName={element.name}
                key={element.id * 100}
                itemId={element.id}
              />
            );
          })}

          {/* when cart is empty */}
          {cartData.length === 0 && (
            <div className='bg-white p-4 m-2 rounded-md text-red-600 font-bold flex flex-row'>
              <WarningIcon /> <span className='ml-3'>Your cart is empty ! </span>
            </div>
          )}
        </div>

        <div
          className={`${noOfItem === 0 && 'hidden'}
        col-span-6 md:col-span-2 bg-white rounded flex flex-col py-2 px-3 shadow`}>
          <div className='text-slate-800 tracking-wider'>PRICE DETAILS</div>

          <div className='flex flex-row justify-between mt-6 items-center'>
            <span className='text-sm tracking-wide text-slate-500'>No Of Items</span>
            <span className='text-sm tracking-wide text-black '>{noOfItem}</span>
          </div>
          <div className='flex flex-row justify-between mt-2 items-center'>
            <span className='text-sm tracking-wide text-slate-500'>Delivery Charges</span>
            <span className='text-sm tracking-wide text-green-400 '>FREE</span>
          </div>
          <div className='flex flex-row justify-between mt-2 items-center'>
            <span className='text-sm tracking-wide text-slate-500'>Packaging Charges</span>
            <span className='text-sm tracking-wide text-green-400 '>FREE</span>
          </div>

          <div className='flex flex-row justify-between mt-6 mb-2 items-center border-t border-dashed border-slate-400'>
            <span className='font-bold tracking-wide '>Total Amount</span>
            <Tag textColor='400' bold='dark' padding='md:py-1 md:px-0 p-0'>
              <> ₹ {grandTotal}</>
            </Tag>
          </div>
          <ButtonComponent
            disabledBtn={noOfItem === 0}
            onclick={() => overLayHandler(true)}
            color='black'
            textStyle='uppercase tracking-wider font-normal'>
            Proceed
          </ButtonComponent>
        </div>
      </section>
    </>
  );
}

export default Cart;
