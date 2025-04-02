import React from 'react';
import Button from './ButtonComponent';
import Icon from '../../Icons/Like-icon';
import { OrderButtonInterface } from '../../Lib/Interface/ButtonComponent/OrderButtonInterface';



function OrderButton(props: OrderButtonInterface) {
  return (
    <div className='flex flex-col justify-center items-center relative m-2 '>
      <Button color={props.bgColor} type='button' isFullWidth={false}
        Logo={<Icon iconStyle={props.iconStyle} stroke={props.stroke} />}
        textStyle={`font-light p-1 tracking-wide ${props.bgColor === 'black' ? 'text-white' : 'text-black'}`}>
        {props.children}
      </Button>      
      {props.downArrow ? (<div className='triangle-down'></div>) : ''}
    </div>
  );
}

export default OrderButton;