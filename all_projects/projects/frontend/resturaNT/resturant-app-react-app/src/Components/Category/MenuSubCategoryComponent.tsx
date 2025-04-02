import React from 'react';
import { useDispatch } from 'react-redux';
import DeleteIcon from '../../Icons/Delete-icon';
import EditIcon from '../../Icons/Edit-Icon';
import { categorySliceActions } from '../../Lib/Store/Menu/Category/Category.Slice';
import { menuEditorActions } from '../../Lib/Store/Menu/MenuEdiotor/MenuEditor.Slice';

export default function MenuSubCategoryComponent(props: {
  key: number,
  name: string,
  id: string,
  num: number,
  status: boolean
  active: string,
  itemSubmit: any
}) {
  const active: string = props.active;
  const dispatch = useDispatch();

  const editCategory = () => {
    dispatch(menuEditorActions.changeCategoryClass({ categoryPage: 'hidden', categoryNewPage: 'flex flex-col' }));
    dispatch(menuEditorActions.getCurrentCategory({ id: props.num }));
  };

  const deleteCategory = () => {
    dispatch(categorySliceActions.deleteCategory({ id: props.num }));
  };

  return (
    <div className={`${active === props.id ? 'bg-gray-720' : 'bg-white'} hover:bg-blue-200 hover:text-gray-500 flex flex-row items-center justify-between p-4 lg:py-4 lg:px-6 border md:flex-col lg:flex-row`} onClick={props.itemSubmit}>
      <div className='flex items-center'>
        <div className='bg-gray-900 h-3 w-3 mr-4 ' style={{ borderRadius: '50%' }}></div>
        <p className='xl:text-lg lg:text-md md:text-lg md:w-20 xl:w-auto lg:break-all xl:break-normal'>
          {props.name}
        </p>
      </div>
      
      <div className='flex flex-row items-center'>
          <div onClick={editCategory} className='cursor-pointer'><EditIcon width={'18'} height={'18'} /></div>
          <div onClick={deleteCategory} className='cursor-pointer'><DeleteIcon style={'w-8 h-8 p-2'} /></div>
        </div>
    </div>
  );
}
