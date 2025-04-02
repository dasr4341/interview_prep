
import React from 'react';
import { useDispatch } from 'react-redux';
import DeleteIcon from '../../Icons/Delete-icon';
import { categorySliceActions } from '../../Lib/Store/Menu/Category/Category.Slice';
export default function ItemComponent(props: {
  key: number,
  img: string,
  price: number,
  desc: string,
  name: string
  id: string
  num: number,
  status: boolean,
  active: string,
  buttonSubmit: any
}) {
  const dispatch = useDispatch();
  const deleteItem = (id: number) => {
    dispatch(categorySliceActions.deleteItem({ id : id }));
  };

  return (
    <div
      className={`${props.active === props.name ? 'bg-white' : 'bg-gray-720'} hover:bg-blue-200 hover:text-gray-500 flex flex-row md:flex-col lg:flex-row justify-between md:items-center p-4 md:py-4 md:px-8 border`}
      onClick={props.buttonSubmit}>
      <div className='flex items-center md:flex-col xl:flex-row'>
        <img src={props.img} alt='img' style={{ width: '75px', height: '76px' }} className='rounded-lg' />
        <div className='ml-2'>
          <h2>
            <p className='text-xl font-medium text-center'>{props.name}</p>
          </h2>
        </div>
      </div>
      <div className='cursor-pointer' onClick={() => deleteItem(props.num)}><DeleteIcon style={'w-8 h-8 p-2'} /></div>
    </div>
  );
}
