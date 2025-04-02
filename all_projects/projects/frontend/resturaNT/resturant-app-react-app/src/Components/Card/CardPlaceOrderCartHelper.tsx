import Tag from '../Tag/Tag';
import IncrementDecrementButton from '../Button/IncrementDecrementButton';
import DeleteIcon from '../../Icons/Delete-icon';
import { useAppDispatch } from '../../Lib/Store/hooks';
import { cartSliceActions } from '../../Lib/Store/Cart/Cart.slice';
import { IncrementDecrementButtonType } from '../../Lib/Helper/constants';
import { CardPlaceOrderCartHelperInterface } from '../../Lib/Interface/CardComponent/CardPlaceOrderCartHelperInterface';

function CardPlaceOrderCartHelper(props: CardPlaceOrderCartHelperInterface) {
  const dispatch = useAppDispatch();
  return (
    <div className='bg-white grid grid-cols-6 justify-start p-2 rounded shadow items-center md:items-start shadow-slate-200 mb-4'>
      <div className='flex flex-col col-span-2 '>
        <img src={props.imageSrc} alt='Food' className='rounded object-cover max-h-32' />
      </div>
      <div className='flex flex-col col-span-4 justify-start  ml-4'>
        <div className='flex flex-col justify-items-start items-start pb-2 border-b border-dashed border-slate-400 '>
          <div className='flex flex-row justify-between w-full mb-2  md:mb-1  '>
            <Tag padding='p-0' textSize='lg'>
              <>{props.itemName} </>
            </Tag>
            <IncrementDecrementButton type={IncrementDecrementButtonType.CART} quantity={props.noOfItem} itemId={props.itemId} />
          </div>
          <Tag padding='p-0' textColor='slate-4' textSize='xs'>
            <>
              {props.categoryName} &gt; {props.itemName}
            </>
          </Tag>
          <Tag padding='p-0 md:hidden block' textColor='slate-4' textSize='xs'>
            <>{props.itemDescription?.substring(1, 30).concat('...')} </>
          </Tag>
          <Tag padding='p-0 hidden md:block' textColor='slate-4' textSize='xs'>
            <>{props.itemDescription?.substring(1, 100).concat(' ...')} </>
          </Tag>
        </div>

        <div className='flex fex-row mt-2 justify-between align-center items-center'>
          <Tag textColor='400' padding='md:py-1 md:px-0 p-0'>
            <>
              Price: <span> ₹ {props.pricePerItem * props.noOfItem}</span>
            </>
          </Tag>
          <div
            className='p-2 hover:bg-red-100 rounded'
            onClick={() => dispatch(cartSliceActions.deleteItems({ itemId : props.itemId }))}>
            <DeleteIcon style='w-4 md:w-5 hover:cursor-pointer hover:scale-105  ' />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CardPlaceOrderCartHelper;
