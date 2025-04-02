/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable max-lines */
import { SetStateAction, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import CategoryWithSubComponent from '../../Components/Category/MenuCategoryWithSubComponent';
import MenuItemComponent from '../../Components/Category/MenuItemComponent';
import { CategoryData, ItemData, ItemNew, SubCategoryData } from '../../Lib/Interface/Category/category.interface';
import { categorySliceActions } from '../../Lib/Store/Menu/Category/Category.Slice';
import NewCategoryComponent from '../../Components/Category/NewCategoryComponent';
import NewItemComponent from '../../Components/Category/NewItemComponent';
import { useAppSelector } from '../../Lib/Store/hooks';
import { menuEditorActions } from '../../Lib/Store/Menu/MenuEdiotor/MenuEditor.Slice';
import InputFieldComponent from '../../Components/InputField/InputFieldComponent';
import EditIcon from '../../Icons/Edit-Icon';
export default function CategoryPage() {
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [subCategoryData, setSubCategoryData] = useState<SubCategoryData[] | null>([]);
  const [activeCategoryElement, setActiveCategoryElement] = useState('');
  const [activeItemElement, setActiveItemElement] = useState('');
  const [selectValue, setSelectValue] = useState('');
  const [saveDisabled, setSaveDisable] = useState(true);
  const [nameDisabled, setNameDisabled] = useState(true);
  const [descriptionDisabled, setDescriptionDisabled] = useState(true);
  const [priceDisabled, setPriceDisabled] = useState(true);
  const [limitDisabled, setLimitDisabled] = useState(true);
  const [subCategoryDivClass, setSubCategoryDivClass] = useState('hidden');
  const [toggleCategoryArrow, setTogleCategoryArrow] = useState(false);

  const dispatch = useDispatch();

  const category = useAppSelector((state) => state.menueditor.allcategory);
  const subcategory = useAppSelector((state) => state.menueditor.allsubcategory);
  const items = useAppSelector((state) => state.menueditor.allitem);
  const categoryPage = useAppSelector((state) => state.menueditor.categoryPage);
  const categoryNewPage = useAppSelector((state) => state.menueditor.categoryNewPage);
  const itemData = useAppSelector((state) => state.menueditor.itemData);
  const itemPage = useAppSelector((state) => state.menueditor.itemPage);
  const itemNewPage = useAppSelector((state) => state.menueditor.itemNewPage);
  const particularItem = useAppSelector((state) => state.category.particularItem);

  const validationItemSchema = Yup.object().shape({
    name: Yup.string().matches(/^\D+$/, 'Must be only characters'),
    price: Yup.string().matches(/^\d+$/, 'Must be only digits'),
    description: Yup.string().matches(/^\D+$/, 'Must be only characters'),
    limit: Yup.string().matches(/^\d+$/, 'Must be only digits'),
    subcategory_id: Yup.string(),
    file: Yup.mixed(),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ItemNew>({
    mode: 'onChange',
    resolver: yupResolver(validationItemSchema),
  });

  useEffect(() => {
    if (category !== null && category.length > 0) {
      setCategoryData(category);
      setSubCategoryData(subcategory);
      dispatch(menuEditorActions.addItem(items));
    } else {
      dispatch(menuEditorActions.getAllCategory());
    }
    if (particularItem) {
      setValue('name', particularItem.name);
      setValue('description', particularItem.description);
      setValue('price', particularItem.price);
      setValue('limit', particularItem.item_limit);
      setValue('subcategory_id', particularItem.subcategory_id);
    }
  }, [category, subcategory, items, particularItem, dispatch]);

  const categorySubmit = (sub: SubCategoryData[], status: boolean, name: string) => {
    if (activeCategoryElement !== name) {
      setActiveCategoryElement(activeCategoryElement !== name ? name : '');
    }
    if (subCategoryDivClass == 'hidden') {
      setSubCategoryDivClass('block');
      setTogleCategoryArrow(true);
    } else {
      setSubCategoryDivClass('hidden');
      setTogleCategoryArrow(false);
    }
    if (status) {
      setSubCategoryData(sub);
      const isSubArr = sub.filter((item: SubCategoryData) => {
        if (item.status) {
          return item;
        }
      });
      const itemarr = isSubArr
        .map((item: SubCategoryData) => {
          return item.item;
        })
        .flat(Infinity);
      dispatch(menuEditorActions.addItem(itemarr));
    } else {
      setSubCategoryData([]);
      dispatch(menuEditorActions.addItem([]));
    }
    setActiveItemElement('');
  };

  const buttonSubmit = (name: string, id: number) => {
    if (activeItemElement !== name) {
      setActiveItemElement(activeItemElement !== name ? name : '');
    }
    dispatch(categorySliceActions.getParticularItem({ id: id }));
    setNameDisabled(true);
    setDescriptionDisabled(true);
    setLimitDisabled(true);
    setPriceDisabled(true);
    setSaveDisable(true);
  };

  const searchFunction = (e: any) => {
    dispatch(menuEditorActions.triggerSearch(e.target.value));
    dispatch(menuEditorActions.getAllCategory());
  };

  const handleNew = (name: string) => {
    if (name === 'category') {
      dispatch(menuEditorActions.changeCategoryClass({ categoryPage: 'hidden', categoryNewPage: 'flex flex-col' }));
    }
    if (name === 'items') {
      dispatch(menuEditorActions.changeItemClass({ itemPage: 'hidden', itemNewPage: 'flex flex-col' }));
    }
  };

  const handleSelectChange = (e: { target: { value: SetStateAction<string>; }; }) => {
    setSelectValue(e.target.value);
  };

  const handleSelectClick =  () => {
    setSaveDisable(false);
  };

  const onItemUpdate = async (data: ItemNew) => {
    dispatch(
      categorySliceActions.updateItem({
        id: particularItem?.id,
        name: data.name,
        subcategoryId: data.subcategory_id,
        price: data.price,
        description: data.description,
        img: data.file[0],
        limit: data.limit,
      })
    );
  };

  const handleNameDisabledState = () => {
    setNameDisabled(false);
    setSaveDisable(false);
  };

  const handleDescriptionDisabledState = () => {
    setDescriptionDisabled(false);
    setSaveDisable(false);
  };

  const handlePriceDisabledState = () => {
    setPriceDisabled(false);
    setSaveDisable(false);
  };

  const handleLimitDisabledState = () => {
    setLimitDisabled(false);
    setSaveDisable(false);
  };

  const handleImageDisabled = () => {
    setSaveDisable(false);
  };

  return (
    <>
      {/* Search Input */}
      <div className='bg-white py-4 px-2'>
        <form className='flex items-center'>
          <label htmlFor='simple-search' className='sr-only'>
            Search
          </label>
          <div className='relative w-full md:w-1/2 lg:w-1/4'>
            <div className='flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none'>
              <svg
                aria-hidden='true'
                className='w-5 h-5 text-gray-500 dark:text-gray-400'
                fill='currentColor'
                viewBox='0 0 20 20'
                xmlns='http://www.w3.org/2000/svg'>
                <path
                  fillRule='evenodd'
                  d='M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z'
                  clipRule='evenodd'></path>
              </svg>
            </div>
            <input
              type='search'
              id='simple-search'
              className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
              placeholder='Search'
              required
              onInput={searchFunction}
            />
          </div>
        </form>
      </div>
      <div>
        <div className='grid md:grid-cols-4 mt-2 md:gap-1 '>
          <div className='text-left bg-gray-660 rounded'>
            <>
              <div className='py-4 md:px-2 lg:px-4 flex justify-around md:justify-between md:flex-col xl:flex-row'>
                <div className='text-xl'>Category</div>
                <div className='text-xl cursor-pointer' onClick={() => handleNew('category')}>
                  + Add New
                </div>
              </div>
              {/* Category New Page */}
              <div className={`${categoryNewPage}`}>
                <NewCategoryComponent />
              </div>
              {/* Category List */}
              <div
                className={`${categoryPage} h-80 md:h-[calc(100vh_-_21.5rem)] xl:h-[calc(100vh_-_20rem)] overflow-auto`}>
                {categoryData.map((item: CategoryData) => {
                  return (
                    <CategoryWithSubComponent
                      key={item.id}
                      name={item.name}
                      id={item.name}
                      num={item.id}
                      status={item.status}
                      active={activeCategoryElement}
                      toggleCategoryArrow={toggleCategoryArrow}
                      handleSubmit={() => categorySubmit(item.subcategory, item.status, item.name)}
                      subCategoryData={subCategoryData}
                      subCategoryClass={subCategoryDivClass}
                    />
                  );
                })}
              </div>
            </>
          </div>
          <div className='text-left bg-gray-660 rounded'>
            <>
              <div className='py-4 md:px-2 lg:px-4 flex justify-around md:justify-between md:flex-col xl:flex-row'>
                <div className='text-xl'>Items</div>
                <div className='text-xl cursor-pointer' onClick={() => handleNew('items')}>
                  + Add New
                </div>
              </div>
              {/* SubCategory New Page */}
              <div className={`${itemNewPage}`}>
                <NewItemComponent />
              </div>
              <div className={`${itemPage} h-80 md:h-[calc(100vh_-_21.5rem)] xl:h-[calc(100vh_-_20rem)] overflow-auto`}>
                {itemData?.map((item: ItemData) => {
                  return (
                    <MenuItemComponent
                      key={item.id}
                      img={item.img}
                      price={item.price}
                      desc={item.description}
                      name={item.name}
                      id={item.name}
                      num={item.id}
                      status={item.status}
                      active={activeItemElement}
                      buttonSubmit={() => buttonSubmit(item.name, item.id)}
                    />
                  );
                })}
              </div>
            </>
          </div>

          <div className='md:col-span-2 text-left bg-white rounded pt-10 px-10'>
            <>
              <form
                className='h-80 md:h-[calc(100vh_-_21.5rem)] xl:h-[calc(100vh_-_20rem)] overflow-auto'
                onSubmit={handleSubmit(onItemUpdate)}>
                <div className='font-sm font-medium mb-5'>Item Name and Description</div>
                <div className='relative mb-5'>
                  <InputFieldComponent
                    type={'text'}
                    placeholder={''}
                    register={register('name')}
                    disabled={nameDisabled}
                    iconType={'hidden'}
                  />
                  <div
                    onClick={handleNameDisabledState}
                    className={`absolute ${nameDisabled ? 'opacity-50' : ''} right-2 top-3 cursor-pointer`}>
                    {<EditIcon width='18' height='18' />}
                  </div>
                  <span>
                    {errors.name && <span className='block pt-2 text-sm text-red-500'>{errors.name.message}</span>}
                  </span>
                </div>

                <div className='relative mb-5'>
                  <InputFieldComponent
                    type={'text'}
                    placeholder={''}
                    register={register('description')}
                    iconType={'hidden'}
                    disabled={descriptionDisabled}
                  />
                  <div
                    onClick={handleDescriptionDisabledState}
                    className={`absolute ${descriptionDisabled ? 'opacity-50' : ''} right-2 top-3 cursor-pointer`}>
                    {<EditIcon width='18' height='18' />}
                  </div>
                  <span>
                    {errors.description && (
                      <span className='block pt-2 text-sm text-red-500'>{errors.description.message}</span>
                    )}
                  </span>
                </div>

                <div className='text-sm font-medium mb-5'>Item Pricing</div>
                <div className='relative mb-5'>
                  <InputFieldComponent
                    type={'text'}
                    placeholder={''}
                    register={register('price')}
                    iconType={'hidden'}
                    disabled={priceDisabled}
                  />
                  <div
                    onClick={handlePriceDisabledState}
                    className={`absolute ${priceDisabled ? 'opacity-50' : ''} right-2 top-3 cursor-pointer`}>
                    {<EditIcon width='18' height='18' />}
                  </div>
                  <span>
                    {errors.price && <span className='block pt-2 text-sm text-red-500'>{errors.price.message}</span>}
                  </span>
                </div>

                <div className='text-sm font-medium mb-5'>Item Limit</div>
                <div className='relative mb-5'>
                  <InputFieldComponent
                    type={'text'}
                    placeholder={''}
                    register={register('limit')}
                    iconType={'hidden'}
                    disabled={limitDisabled}
                  />
                  <div
                    onClick={handleLimitDisabledState}
                    className={`absolute ${limitDisabled ? 'opacity-50' : ''} right-2 top-3 cursor-pointer`}>
                    {<EditIcon width='18' height='18' />}
                  </div>
                  <span>
                    {errors.limit && <span className='block pt-2 text-sm text-red-500'>{errors.limit.message}</span>}
                  </span>
                </div>

                <div className='py-2 text-center text-xl'>Item Image</div>
                <input
                  type='file'
                  placeholder='Item Iamge'
                  {...register('file')}
                  className='w-full rounded-md bg-cyan-100'
                  onClick={handleImageDisabled}
                />
                <label
                  htmlFor='subcategory'
                  className='block my-5 text-sm font-medium text-gray-900 dark:text-gray-400'>
                  Select a Sub-Category
                </label>
                <select
                  id='subcategory'
                  {...register('subcategory_id')}
                  value={selectValue}
                  className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                  onChange={handleSelectChange}
                  onClick={handleSelectClick}>
                  {subcategory?.map((item: SubCategoryData) => {
                    return (
                      <option key={item.name} value={item.id}>
                        {item.name}
                      </option>
                    );
                  })}
                </select>
                <button type='submit' className='bg-blue-400 p-2 mt-4 rounded-md w-full' disabled={saveDisabled}>
                  Save
                </button>
              </form>
            </>
          </div>
        </div>
      </div>
    </>
  );
}
