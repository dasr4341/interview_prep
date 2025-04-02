import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import InputFieldComponent from '../InputField/InputFieldComponent';
import { CategoryData, CategoryNew } from '../../Lib/Interface/Category/category.interface';
import { categorySliceActions } from '../../Lib/Store/Menu/Category/Category.Slice';
import { useDispatch } from 'react-redux';
import CloseIcon from '../../Icons/Close-Icon';
import { menuEditorActions } from '../../Lib/Store/Menu/MenuEdiotor/MenuEditor.Slice';
import { useAppSelector } from '../../Lib/Store/hooks';

export default function NewCategoryComponent() {
  const category = useAppSelector((state) => state.menueditor.allcategory);
  const currentCategory = useAppSelector((state) => state.menueditor.currentCategory);

  const dispatch = useDispatch();

  const [selectValue, setSelectValue] = useState();

  const validationCategorySchema = Yup.object().shape({
    name: Yup.string().required('Name is required').matches(/^\D+$/, 'Must be only characters'),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm<CategoryNew>({
    mode: 'onChange',
    resolver: yupResolver(validationCategorySchema),
  });

  if (currentCategory) {
    setValue('name', currentCategory?.name);
    setValue('parent_id', currentCategory?.parent_id ? currentCategory?.parent_id : 'none');
  } else {
    setValue('name', '');
    setValue('parent_id', 'none');
  }

  const onCategorySubmit = async (data: CategoryNew) => {
    if (!currentCategory) {
      if (data.parent_id === 'none') {
        dispatch(categorySliceActions.addNewCategory({ name: data.name }));
      } else {
        dispatch(categorySliceActions.addNewSubCategory({ name: data.name, parentId: data.parent_id }));
      }
    } else {
      if (data.parent_id === 'none') {
        dispatch(categorySliceActions.updateCategory({ id: currentCategory.id, name: data.name }));
      } else {
        dispatch(categorySliceActions.updateCategory({ id: currentCategory.id, name: data.name, parentId: data.parent_id }));
      }
    }
  };

  const handleChange = (e: any) => {
    setSelectValue(e.target.value);
  };

  const closeClick = () => {
    dispatch(menuEditorActions.changeCategoryClass({ categoryPage: '', categoryNewPage: 'hidden' }));
    dispatch(menuEditorActions.addCurrentCategory(null));
  };

  return (
    <>
      <div className='bg-blue-300 flex justify-end'>
        <CloseIcon className={'w-8 h-8 p-2 cursor-pointer'} onClick={()=>closeClick()} />
      </div>
      <div className='bg-blue-100 md:py-4 p-4 flex items-center justify-around'>
        <form onSubmit={handleSubmit(onCategorySubmit)}>
          <div className='relative pb-2'>
            <div className='py-4 text-center text-xl'>Category Name</div>
            <InputFieldComponent
              type={'text'}
              placeholder={'Category Name'}
              register={register('name')}
              iconType={'hidden'}
            />
            {errors.name && <span className='block pt-2 text-sm text-red-500'>{errors.name.message}</span>}
          </div>
          <label
            htmlFor='subcategory'
            className='block mb-2 text-xl font-medium text-gray-900 dark:text-gray-400 text-center'>
            Select an option
          </label>
          <select
            id='subcategory'
            {...register('parent_id')}
            value={selectValue}
            className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
            onChange={handleChange}>
            <option key={'none'} value={'none'}>
              None
            </option>
            {category?.map((item: CategoryData) => {
              return (
                <option key={item.name} value={item.id}>
                  {item.name}
                </option>
              );
            })}
          </select>
          <button type='submit' className='bg-blue-400 p-2 mt-4 rounded-md w-full'>
            Submit
          </button>
        </form>
      </div>
    </>
  );
}
