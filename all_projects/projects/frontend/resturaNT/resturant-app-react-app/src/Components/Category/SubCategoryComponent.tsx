import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { categorySliceActions } from '../../Lib/Store/Menu/Category/Category.Slice';
// import { useDispatch, useSelector } from 'react-redux';

export default function SubCategoryComponent(props: { status: boolean; active: string; activeCategoryElement: string; num: number; parent_id: string; id: string ; itemSubmit: any; name: string ; itemlength: number; }) {
  const dispatch = useDispatch();
  const [checked, setChecked] = useState(props.status);
  const [color, setColor] = useState('250');
  const active: string = props.active;

  const handleClick = () => {
    if (checked === true) {
      setChecked(false);
      setColor('750');
      dispatch(categorySliceActions.updateCategoryStatus({
        'active': props.activeCategoryElement,
        'id': props.num,
        'data': false,
        'parentId': props.parent_id
      }));
    } else {
      setChecked(true);
      setColor('250');
      dispatch(categorySliceActions.updateCategoryStatus({
        'active': props.activeCategoryElement,
        'id': props.num,
        'data': true,
        'parentId': props.parent_id
      }));
    }
  };
  return (
    <div className={`${active === props.id ? 'bg-white' : 'bg-gray-720'} hover:bg-blue-200 hover:text-gray-500 flex flex-row md:flex-col lg:flex-row justify-between md:items-center p-4 lg:px-2 xl:px-4 md:px-8 border`} onClick={props.itemSubmit}>
      <p className='xl:text-lg lg:text-md md:text-lg w-20 md:w-12 lg:break-all xl:break-normal'>
        {props.name}
      </p>
      <div className='text-md bg-gray-400 text-white lg:ml-4 md:mt-2 lg:mt-0 h-8 p-1'>{props.itemlength} item</div>
      <div className='flex items-center'>
      <label htmlFor={props.id} className="inline-flex relative items-center cursor-pointer" style={{ height: '50px', width: '50px' }}>
        <input type="checkbox" value="Hello" id={props.id} className="sr-only peer" defaultChecked={checked} onClick={handleClick} />
        <div className={`w-15 h-7 bg-gray-250 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-750 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[15px] after:left-[5px] after:bg-gray-${color} after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-gray-750`}></div>
      </label>
      </div>
    </div>
  );
}
