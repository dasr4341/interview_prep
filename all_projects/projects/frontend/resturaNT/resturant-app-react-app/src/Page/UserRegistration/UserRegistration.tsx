/* eslint-disable react-hooks/exhaustive-deps */

import { useForm } from 'react-hook-form';
import Message from '../../Components/Message/Message';
import { yupResolver } from '@hookform/resolvers/yup';
import UserSchema from './UserRegistrationSchema';
import ButtonComponent from '../../Components/Button/ButtonComponent';
import TextFieldComponent from '../../Components/TextField/TextFieldComponent';
import { UserSubmitForm } from '../../Lib/Interface/User/UserSubmitInterface';
import { useAppDispatch, useAppSelector } from '../../Lib/Store/hooks';
import { userSliceActions } from '../../Lib/Store/User/User.Slice';
import { useEffect } from 'react';
import { CartOverLayContentType } from '../../Lib/Helper/constants';
import { CartUserInterface } from '../../Lib/Interface/Cart/CartInterface';

function UserRegistration({
  CartOverLayContentTypeHandler,
}: {
  CartOverLayContentTypeHandler: (ContentType: CartOverLayContentType) => void;
}) {
  const dispatch = useAppDispatch();
  const cartUser: CartUserInterface = useAppSelector((state) => state.cart.cart.user);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserSubmitForm>({
    mode: 'onChange',
    resolver: yupResolver(UserSchema),
  });

  const onSubmit = (formData: UserSubmitForm) => {
    dispatch(userSliceActions.registerUser(formData));
  };

  useEffect(() => {
    if (cartUser.id) {
      CartOverLayContentTypeHandler(CartOverLayContentType.PLACE);
    }
  }, [cartUser]);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='flex flex-col mb-6'>
          <span className='text-white text-3xl tracking-wide'>Create User </span>
          <span className='text-slate-300 text-xs mt-1 tracking-widest '>To Continue</span>
          <span className='text-green-400 text-xs mt-2 tracking-widest '>
            NOTE : Order will be placed under this user
          </span>
        </div>

        <div className='flex flex-row gap-4 justify-between w-full '>
          <div className='w-full'>
            <TextFieldComponent placeholder='First Name' register={register('firstName')} iconType='hidden' />
            {errors.firstName?.message && <Message color='red'>{errors.firstName?.message}</Message>}
          </div>
          <div className='w-full'>
            <TextFieldComponent placeholder='Last Name' register={register('lastName')} iconType='hidden' />
            {errors.lastName?.message && <Message color='red'>{errors.lastName?.message}</Message>}
          </div>
        </div>
        <TextFieldComponent placeholder='Email' register={register('email')} iconType='hidden' />
        {errors.email?.message && <Message color='red'>{errors.email?.message}</Message>}
        <TextFieldComponent placeholder='phone' register={register('phone')} iconType='hidden' />
        {errors.phone?.message && <Message color='red'>{errors.phone?.message}</Message>}
        <TextFieldComponent placeholder='address' register={register('address')} iconType='hidden' />
        {errors.address?.message && <Message color='red'>{errors.address?.message}</Message>}
        <TextFieldComponent placeholder='password' register={register('password')} iconType='hidden' />
        {errors.password?.message && <Message color='red'>{errors.password?.message}</Message>}

        <div className='pt-4 pb-4'>
          <ButtonComponent
            isFullWidth={false}
            type='submit'
            color='black'
            textStyle='uppercase tracking-widest text-sm font-normal'>
            Create
          </ButtonComponent>
        </div>
        <div
          className='text-white px-2 py-1 bg-slate-400 inline w-fit rounded text-sm cursor-pointer hover:underline'
          onClick={() => CartOverLayContentTypeHandler(CartOverLayContentType.SEARCH)}>
          Already Registered ? Search User
        </div>
      </form>
    </>
  );
}

export default UserRegistration;
