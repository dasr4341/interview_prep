import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import ButtonComponent from '../../../Components/Button/ButtonComponent';
import { useAppDispatch } from '../../../Lib/Store/hooks';
import { SearchUserYupSchema } from './SearchUserSchema';
import { cartSliceActions } from '../../../Lib/Store/Cart/Cart.slice';
import { useState } from 'react';
import AsyncSelect from 'react-select/async';
import SearchUserApi from '../../../Lib/Api/Cart/SearchUser';
import Message from '../../../Components/Message/Message';
import { CartOverLayContentType } from '../../../Lib/Helper/constants';
import { SearchUserApiResponse } from '../../../Lib/Interface/User/UserInterface';

export interface SearchUserInterface {
  phone: string;
}
export interface FieldValueInterface {
  value: string | null;
  label: string | null;
}

function SearchUser({
  CartOverLayContentTypeHandler,
}: {
  CartOverLayContentTypeHandler: (ContentType: CartOverLayContentType) => void;
}) {
  const dispatch = useAppDispatch();
  const [searchData, setSearchData] = useState<SearchUserApiResponse[]>([]);
  const [selectedData, setSelectedData] = useState('');
  const [inputValue, setInputValue] = useState<FieldValueInterface>();

  const {
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<SearchUserInterface>({
    mode: 'onChange',
    resolver: yupResolver(SearchUserYupSchema),
  });


  const onSubmit = (searchedData: SearchUserInterface) => {
    const selectedUserData = searchData.find((element) => element.phone == Number(searchedData.phone));
    if (!!selectedUserData) {
      dispatch(cartSliceActions.setUser(selectedUserData));
      CartOverLayContentTypeHandler(CartOverLayContentType.PLACE);
    } else {
      setSelectedData('User not Found');
    }
  };

  
  const onInputChange = (phone: string) => {
    setSelectedData('');
    if (phone) {
      setValue('phone', phone);
      setInputValue({ value: phone, label: phone });
    }
  };

  // if the user selects from the drop down then it will call
  const selectUser = (selectUserData: any) => {
    setValue('phone', selectUserData.value);
    setInputValue(selectUserData);
    setSelectedData('');
  };


  const loadOptions = (phone: string) => {
    return SearchUserApi(parseInt(phone)).then((response) => {
      if (response.data.length > 0) {
        setSearchData(response.data);
      }
      return response.data.map((element: SearchUserApiResponse) => {
        return { value: element.phone, label: element.phone };
      });
    });
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='flex flex-col mb-6'>
          <span className='text-white text-3xl tracking-wide'>Search User </span>
          <span className='text-slate-300 text-xs mt-1 tracking-widest '>To Continue</span>
          <span className='text-green-400 text-xs mt-2 tracking-widest '>
            NOTE : Order will be placed under this user
          </span>
        </div>

        <AsyncSelect
          loadOptions={loadOptions}
          defaultOptions
          onInputChange={onInputChange}
          onChange={selectUser}
          value={inputValue}
        />
        {errors.phone && <Message color='red'>{errors.phone?.message}</Message>}
        <Message bgNone={true}>{selectedData}</Message>

        <div className='pb-4'>
          <ButtonComponent
            isFullWidth={false}
            type='submit'
            color='black'
            textStyle='uppercase tracking-widest text-sm font-normal'>
            Search
          </ButtonComponent>
        </div>
        <div
          className='text-white px-2 py-1 bg-slate-400 inline w-fit rounded text-sm cursor-pointer hover:underline'
          onClick={() => CartOverLayContentTypeHandler(CartOverLayContentType.CREATE)}>
          Create New User ?
        </div>
      </form>
    </>
  );
}

export default SearchUser;
