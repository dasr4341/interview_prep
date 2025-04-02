import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import ArrowDownIcon from '../../Icons/Arrow-Down-Icon';
import ArrowUpIcon from '../../Icons/Arrow-Up-Icon';
import DeleteIcon from '../../Icons/Delete-icon';
import EditIcon from '../../Icons/Edit-Icon';
import { SubCategoryData } from '../../Lib/Interface/Category/category.interface';
import { categorySliceActions } from '../../Lib/Store/Menu/Category/Category.Slice';
import { menuEditorActions } from '../../Lib/Store/Menu/MenuEdiotor/MenuEditor.Slice';
import MenuSubCategoryComponent from './MenuSubCategoryComponent';

export default function CategoryComponent(props: {
  key: number,
  name: string,
  id: string,
  num: number,
  status: boolean,
  active: string,
  toggleCategoryArrow: boolean,
  handleSubmit: any,
  subCategoryData: SubCategoryData[] | null,
  subCategoryClass: string
}) {
  const active: string = props.active;
  const dispatch = useDispatch();
  const [activeSubCategoryElement, setActiveSubCategoryElement] = useState('');

  const itemSubmit = (obj: any, status: boolean, name: any) => {
    if (activeSubCategoryElement !== name) {
      setActiveSubCategoryElement(activeSubCategoryElement !== name ? name : '');
    }
    if (status) {
      dispatch(menuEditorActions.addItem(obj));
    } else {
      dispatch(menuEditorActions.addItem([]));
    }
  };

  const deleteCategory = () => {
    dispatch(categorySliceActions.deleteCategory({ id : props.num }));
  };

  const editCategory = () => {
    dispatch(menuEditorActions.changeCategoryClass({ categoryPage: 'hidden', categoryNewPage: 'flex flex-col' }));
    dispatch(menuEditorActions.getCurrentCategory({ id: props.num }));
  };

  return (
    <>
      <div className={`${active === props.id ? 'bg-white' : 'bg-gray-720'} hover:bg-blue-200 hover:text-gray-500 flex flex-row justify-between md:items-center p-4 lg:py-4 lg:px-8 border md:flex-col lg:flex-row`} onClick={props.handleSubmit}>
        <p className='text-xl font-medium lg:break-all xl:break-normal w-20 md:text-center lg:text-left'>
          {props.name}
        </p>
        <div className='flex flex-row items-center'>
          <div className= 'cursor-pointer' onClick={editCategory}>
            <EditIcon width={'18'} height={'18'} />
          </div>
          <div onClick={deleteCategory} className='cursor-pointer'><DeleteIcon style={'w-8 h-8 p-2'} /></div>
        </div>
        <div className=''>{active === props.id ? props.toggleCategoryArrow ? <ArrowUpIcon width={'21px'} height={'14px'} /> : <ArrowDownIcon width={'21px'} height={'14px'} /> : <ArrowDownIcon width={'21px'} height={'14px'} />}</div>
      </div>
      <div className={`${active === props.id ? props.subCategoryClass : 'hidden'}`}>
          {props.subCategoryData?.map((item: any) => {
            return (
              <MenuSubCategoryComponent
                      key={item.id}
                      name={item.name}
                      id={item.name}
                      num={item.id}
                      status={item.status}
                      active={activeSubCategoryElement}
                      itemSubmit={() => itemSubmit(item.item, item.status, item.name)}
                    />
            );
          })}
        </div>
    </>
  );
}
