import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import CategoryComponent from '../../Components/Category/CategoryComponent';
import ItemComponent from '../../Components/Category/ItemComponent';
import SubCategoryComponent from '../../Components/Category/SubCategoryComponent';
import { CategoryData, ItemData, SubCategoryData } from '../../Lib/Interface/Category/category.interface';
import { categorySliceActions } from '../../Lib/Store/Menu/Category/Category.Slice';
import { useAppSelector } from '../../Lib/Store/hooks';

export default function CategoryPage() {
  const [categoryData, setCategoryData] = useState< CategoryData[]>([]);
  const [subCategoryData, setSubCategoryData] = useState<SubCategoryData[] | null>([]);
  const [itemData, setItemData] = useState<any>([]);
  const [activeCategoryElement, setActiveCategoryElement] = useState('');
  const [activeSubCategoryElement, setActiveSubCategoryElement] = useState('');
  const [activeItemElement, setActiveItemElement] = useState('');
  const [categoryToggleState, setCategoryToggleState] = useState('block');
  const [categoryArrow, setCategoryArrow] = useState(false);
  const [subcategoryToggleState, setSubCategoryToggleState] = useState('block');
  const [subcategoryArrow, setSubCategoryArrow] = useState(false);
  const [itemToggleState, setItemToggleState] = useState('block');
  const [itemArrow, setItemArrow] = useState(false);

  const dispatch = useDispatch();

  const category = useAppSelector((state) => state.category.category);
  const subcategory = useAppSelector((state) => state.category.subcategory);
  const items = useAppSelector((state) => state.category.item);

  useEffect(() => {
    if (category !== null && category.length > 0) {
      setCategoryData(category);
      setSubCategoryData(subcategory);
      setItemData(items);
    } else {
      dispatch(categorySliceActions.getCategory());
    }
  }, [category, subcategory, items, dispatch]);

  const categorySubmit = (sub: SubCategoryData[], status: boolean, name: string) => {
    if (activeCategoryElement !== name) {
      setActiveCategoryElement(activeCategoryElement !== name ? name : '');
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
      setItemData(itemarr);
    } else {
      setSubCategoryData([]);
      setItemData([]);
    }
    setActiveSubCategoryElement('');
    setActiveItemElement('');
  };

  const itemSubmit = (obj: ItemData[], status: boolean, name: any) => {
    if (activeSubCategoryElement !== name) {
      setActiveSubCategoryElement(activeSubCategoryElement !== name ? name : '');
    }
    if (status) {
      setItemData(obj);
    } else {
      setItemData([]);
    }
    setActiveItemElement('');
  };

  const buttonSubmit = (name: string) => {
    if (activeItemElement !== name) {
      setActiveItemElement(activeItemElement !== name ? name : '');
    }
  };

  const searchFunction = (e: any) => {
    dispatch(categorySliceActions.triggerSearch(e.target.value));
    dispatch(categorySliceActions.getCategory());
  };

  const categoryToggleTabs = () => {
    if (categoryToggleState === 'block') {
      setCategoryToggleState('hidden');
      setCategoryArrow(true);
    } else {
      setCategoryToggleState('block');
      setCategoryArrow(false);
    }
  };

  const subcategoryToggleTabs = () => {
    if (subcategoryToggleState === 'block') {
      setSubCategoryToggleState('hidden');
      setSubCategoryArrow(true);
    } else {
      setSubCategoryToggleState('block');
      setSubCategoryArrow(false);
    }
  };

  const itemToggleTabs = () => {
    if (itemToggleState === 'block') {
      setItemToggleState('hidden');
      setItemArrow(true);
    } else {
      setItemToggleState('block');
      setItemArrow(false);
    }
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
        <div className='grid md:grid-cols-4 md:gap-1 '>
          <div className='text-left bg-gray-660 rounded'>
            <>
              <div
                className='py-4 xl:px-8 px-4 md:px-2 lg:px-4 md:inline-flex  md:flex-col lg:flex-row flex justify-between'
                onClick={categoryToggleTabs}>
                <div className='text-xl w-32 md:w-auto'>Category</div>
                <div
                  className='bg-white text-center h-9 w-9 text-lgx lg:ml-6 flex justify-center items-center '
                  style={{ borderRadius: '50%' }}>
                  {categoryData.length}
                </div>
                <p className='text-xl md:hidden'>
                  {categoryArrow ? <strong>&#x2191;</strong> : <strong>&#x2193;</strong>}
                </p>
              </div>
              <div
                className={`max-h-80 lg:h-[calc(100vh_-_19.75rem)] md:h-[calc(100vh_-_21.5rem)] overflow-auto md:block ${categoryToggleState}`}>
                {categoryData.map((item: CategoryData) => {
                  return (
                    <CategoryComponent
                      key={item.id}
                      name={item.name}
                      id={item.name}
                      num={item.id}
                      status={item.status}
                      parent_id={item.parent_id}
                      active={activeCategoryElement}
                      handleSubmit={() => categorySubmit(item.subcategory, item.status, item.name)}
                    />
                  );
                })}
              </div>
            </>
          </div>
          <div className='text-left bg-gray-660 rounded'>
            <>
              <div
                className='py-4 xl:px-8 px-4 md:px-2 lg:px-4 md:inline-flex md:flex-col lg:flex-row flex justify-between'
                onClick={subcategoryToggleTabs}>
                <div className='text-xl w-32 md:w-auto'>Sub-Category</div>
                <div
                  className='bg-white xl:ml-6 lg:ml-2 text-center h-9 w-9 text-lgx flex justify-center items-center '
                  style={{ borderRadius: '50%' }}>
                  {subCategoryData?.length}
                </div>
                <p className='text-xl md:hidden'>
                  {subcategoryArrow ? <strong>&#x2191;</strong> : <strong>&#x2193;</strong>}
                </p>
              </div>
              <div
                className={`max-h-80 lg:h-[calc(100vh_-_19.75rem)] md:h-[calc(100vh_-_21.5rem)] overflow-auto md:block ${subcategoryToggleState}`}>
                {subCategoryData?.map((item: SubCategoryData) => {
                  return (
                    <SubCategoryComponent
                      key={item.id}
                      itemlength={item.item.length}
                      name={item.name}
                      id={item.name}
                      num={item.id}
                      status={item.status}
                      parent_id={item.parent_id}
                      activeCategoryElement={activeCategoryElement}
                      active={activeSubCategoryElement}
                      itemSubmit={() => itemSubmit(item.item, item.status, item.name)}
                    />
                  );
                })}
              </div>
            </>
          </div>

          <div className='md:col-span-2 text-left bg-gray-660 rounded'>
            <>
              <div
                className='py-4 px-4 xl:px-8 md:px-2 lg:px-4 md:inline-flex md:flex-col lg:flex-row flex justify-between'
                onClick={itemToggleTabs}>
                <div className='text-xl w-32 md:w-auto'>Items</div>
                <div
                  className='bg-white text-center h-9 w-9 text-lgx lg:ml-6 flex justify-center items-center '
                  style={{ borderRadius: '50%' }}>
                  {itemData?.length}
                </div>
                <p className='text-xl md:hidden'>{itemArrow ? <strong>&#x2191;</strong> : <strong>&#x2193;</strong>}</p>
              </div>
              <div
                className={`max-h-80 lg:h-[calc(100vh_-_19.75rem)] md:h-[calc(100vh_-_21.5rem)] overflow-auto md:block ${itemToggleState}`}>
                {itemData?.map((item: ItemData) => {
                  return (
                    <ItemComponent
                      key={item.id}
                      img={item.img}
                      price={item.price}
                      desc={item.description}
                      name={item.name}
                      id={item.name}
                      num={item.id}
                      status={item.status}
                      activeCategoryElement={activeCategoryElement}
                      activeSubCategoryElement={activeSubCategoryElement}
                      SubCategory={item.category.name} 
                      active={activeItemElement}
                      buttonSubmit={() => buttonSubmit(item.name)}
                    />
                  );
                })}
              </div>
            </>
          </div>
        </div>
      </div>
    </>
  );
}
