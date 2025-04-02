import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import InputFieldComponent from '../InputField/InputFieldComponent';
import { SubCategoryData, ItemNew } from '../../Lib/Interface/Category/category.interface';
// import { categorySliceActions } from '../../Lib/Store/Menu/Category/Category.Slice';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../../Lib/Store/hooks';
import CloseIcon from '../../Icons/Close-Icon';
import { menuEditorActions } from '../../Lib/Store/Menu/MenuEdiotor/MenuEditor.Slice';
import { categorySliceActions } from '../../Lib/Store/Menu/Category/Category.Slice';

export default function NewCategoryComponent() {
  const category = useAppSelector((state) => state.menueditor.allsubcategory);

  const dispatch = useDispatch();

  const [selectValue, setSelectValue] = useState('');

  const validationItemSchema = Yup.object().shape({
    name: Yup.string().required('Name is required').matches(/^\D+$/, 'Must be only characters'),
    price: Yup.string().required('Price is required').matches(/^\d+$/, 'Must be only digits'),
    description: Yup.string().required('Description is required').matches(/^\D+$/, 'Must be only characters'),
    limit: Yup.string().required('Limit is required').matches(/^\d+$/, 'Must be only digits'),
    file: Yup
    .mixed()
    .required('You need to provide a file')
    // .test("fileSize", "The file is too large", (value) => {
    //     return value && value[0].sienter code hereze <= 2000000;
    // })
    // .test({
    //   message: 'Please provide a supported file type',
    //   test: (file, context) => {
    //     const isValid = ['png', 'jpeg', 'jpg'].includes(file?.name);
    //     if (!isValid) context?.createError();
    //     return isValid;
    //   }
    // })
  ,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm<ItemNew>({
    mode: 'onChange',
    resolver: yupResolver(validationItemSchema),
  });
  setValue('subcategory_id', category ? String(category[0].id) : '');
  const onItemSubmit = async (data: ItemNew) => {
    dispatch(categorySliceActions.addNewItem({ name: data.name, subcategoryId: data.subcategory_id, price: data.price, description: data.description, img: data.file[0], limit: data.limit }));
  };

  const handleChange = (e: any) => {
    setSelectValue(e.target.value);
  };

  const closeClick = () => {
    dispatch(menuEditorActions.changeItemClass({ itemPage: '', itemNewPage: 'hidden' }));
  };

  return (
    <>
    <div className='bg-blue-300 flex justify-end'>
    <CloseIcon className={'w-8 h-8 p-2 cursor-pointer'} onClick={()=>closeClick()} />
      </div>
      <div className='flex items-center justify-around bg-blue-100'>
        <form onSubmit={handleSubmit(onItemSubmit)} className='md:p-4 p-2 md:h-[calc(100vh_-_23.5rem)] xl:h-[calc(100vh_-_22rem)] overflow-auto' encType='multipart/form-data'>
            <div className='py-2 text-center text-xl'>Item Name</div>
            <InputFieldComponent
              type={'text'}
              placeholder={'Item Name'}
              register={register('name')}
              iconType={'hidden'}
            />
            <span>
              {errors.name && <span className='block pt-2 text-sm text-red-500'>{errors.name.message}</span>}
            </span>
        

          <div className='py-2 text-center text-xl'>Item Price</div>
          <InputFieldComponent
              type={'text'}
              placeholder={'Item Price'}
              register={register('price')}
              iconType={'hidden'}
          />
          <span>
            {errors.price && <span className='block pt-2 text-sm text-red-500'>{errors.price.message}</span>}
          </span>

          <div className='py-2 text-center text-xl'>Item Description</div>
          <InputFieldComponent
              type={'text'}
              placeholder={'Item Description'}
              register={register('description')}
              iconType={'hidden'}
          />
          <span>
            {errors.description && <span className='block pt-2 text-sm text-red-500'>{errors.description.message}</span>}
          </span>

          <div className='py-2 text-center text-xl'>Item Limit</div>
          <InputFieldComponent
              type={'text'}
              placeholder={'Item Limit'}
              register={register('limit')}
              iconType={'hidden'}
          />
          <span>
          {errors.limit && <span className='block pt-2 text-sm text-red-500'>{errors.limit.message}</span>}
          </span>

          <div className='py-2 text-center text-xl'>Item Image</div>
          <input
              type='file'
              placeholder='Item Iamge'
              {...register('file')}
              className='w-full rounded-md bg-white'
          />
          <span>
            {/* {errors.file && <span className='block pt-2 text-sm text-red-500'>{errors.file.message}</span>} */}
          </span>

          <label
            htmlFor='subcategory'
            className='block my-2 text-xl font-medium text-gray-900 dark:text-gray-400 text-center'>
            Select an option
          </label>
          <select
            id='subcategory'
            {...register('subcategory_id')}
            value={selectValue}
            className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
            onChange={handleChange}>
            {category?.map((item: SubCategoryData) => {
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
