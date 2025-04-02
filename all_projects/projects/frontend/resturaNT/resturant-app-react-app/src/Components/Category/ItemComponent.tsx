/* eslint-disable @typescript-eslint/no-unused-vars */

import { format } from 'date-fns';
import React, { useState } from 'react';
import { cartSliceActions } from '../../Lib/Store/Cart/Cart.slice';
import { useAppDispatch, useAppSelector } from '../../Lib/Store/hooks';
import { categorySliceActions } from '../../Lib/Store/Menu/Category/Category.Slice';
import ButtonComponent from '../Button/ButtonComponent';

export default function ItemComponent(props: { id: string; status: boolean; num: number; name: string ; img: string; price: number ; desc: string ; active: string; activeCategoryElement: string; activeSubCategoryElement: string; SubCategory: string; buttonSubmit: any }) {
  const dispatch = useAppDispatch();
  const [checked, setChecked] = useState(props.status);
  const [status, setStatus] = useState('On');
  const [color, setColor] = useState('250');
  const cartData = useAppSelector((state) => state.cart.cart.items);
  // finding that this particular item is added to cart
  // if it is added then we will disable the button
  const cartItemsStatus = cartData.find((element) => element.id === props.num);

  const handleClick = () => {
    if (checked === true) {
      setChecked(false);
      setColor('750');
      setStatus('Off');
      dispatch(
        categorySliceActions.updateItemStatus({
          activeCategory: props.activeCategoryElement,
          activeSubCategory: props.activeSubCategoryElement,
          id: props.num,
          data: false,
        })
      );
    } else {
      setChecked(true);
      setColor('250');
      setStatus('On');
      dispatch(
        categorySliceActions.updateItemStatus({
          activeCategory: props.activeCategoryElement,
          activeSubCategory: props.activeSubCategoryElement,
          id: props.num,
          data: true,
        })
      );
    }
  };
  
  const addToCartHandler = () => {
    dispatch(cartSliceActions.addToCart({ name: props.name, id: props.num, img: props.img, price: props.price, noOfItems: 1, date: format(new Date, 'yyyy-MM-d HH:mm:ss'), SubCategory: props.SubCategory, description: props.desc }));
  };

  return (
    <div
      className={`${props.active === props.name ? 'bg-gray-600 text-white' : 'bg-white text-gray-700'} hover:bg-blue-200 hover:text-gray-500 flex flex-row md:flex-col lg:flex-row justify-between md:items-center p-4 md:py-4 md:px-8 border`}
      onClick={props.buttonSubmit}>
      <div className='flex items-center'>
        <img src={props.img} alt='img' style={{ width: '75px', height: '76px' }} className='rounded-lg' />
        <div className='ml-2'>
          <h2>
            <p className='text-xl font-medium'>{props.name}</p>
          </h2>
          <p className='text-xl font-regular'>{props.price}</p>
          <p className='text-base font-regular text-gray-350'>{props.desc}</p>
        </div>
      </div>
      <div className='flex items-center'>
        <label
          htmlFor={props.name}
          className='inline-flex relative items-center cursor-pointer mr-4'
          style={{ height: '50px', width: '50px' }}>
          <input
            type='checkbox'
            value='Hello'
            id={props.name}
            className='sr-only peer'
            defaultChecked={checked}
            onClick={handleClick}
          />
          <div className={`w-15 h-6 bg-gray-250 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-750 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[15px] after:left-[5px] after:bg-gray-${color} after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-gray-750`}></div>
        </label>
          <ButtonComponent isFullWidth={false} textStyle='uppercase tracking-wider font-normal text-sm' color='black' onclick={addToCartHandler} disabledBtn={!props.status || !!cartItemsStatus}>
            <>{cartItemsStatus ? 'ADDED' : 'ADD'} </>
          </ButtonComponent>
      </div>
    </div>
  );
}
