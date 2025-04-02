import React from 'react';
import { OrderPage, STATUS } from '../../Lib/Helper/constants';
import ButtonComponent from '../../Components/Button/ButtonComponent';

function GetOrderChangeStatusButton({
  type,
  onClickHandler,
  orderStatus,
}: {
  type: string;
  onClickHandler: () => void;
  orderStatus: STATUS;
}) {
  if (type === OrderPage.PREPARATION && orderStatus === STATUS.CONFIRMED) {
    // 2. Preparation
    return (
      <ButtonComponent color='black' isFullWidth={false} onclick={onClickHandler} disabledBtn={false}>
        Make Ready
      </ButtonComponent>
    );
  }
  if (type === OrderPage.READY_TO_DELIVER && orderStatus === STATUS.PREPARATION) {
    // 3. READY TO DELIVER
    return (
      <ButtonComponent color='black' isFullWidth={false} onclick={onClickHandler} disabledBtn={false}>
        Ready To Deliver
      </ButtonComponent>
    );
  }
  if (type === OrderPage.ALL_ORDERS && orderStatus === STATUS.DELIVERED) {
    // 4. View Past Order
    return (
      <ButtonComponent color='theme-btn-400' isFullWidth={false} onclick={onClickHandler} disabledBtn={true}>
        Delivered
      </ButtonComponent>
    );
  }

  return (
    // when
    // type === OrderPage.NEW_ORDER &&
    // orderStatus === STATUS.PENDING
    <ButtonComponent color='black' isFullWidth={false} onclick={onClickHandler} disabledBtn={false}>
      Confirm Order
    </ButtonComponent>
  );
}

export default GetOrderChangeStatusButton;
