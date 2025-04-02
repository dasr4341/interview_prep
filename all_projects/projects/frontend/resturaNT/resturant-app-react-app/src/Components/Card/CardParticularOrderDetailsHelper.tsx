import Tag from '../Tag/Tag';
import IncrementDecrementButton from '../Button/IncrementDecrementButton';
import { IncrementDecrementButtonType } from '../../Lib/Helper/constants';
import { CardParticularOrderDetailsHelperInterface } from '../../Lib/Interface/CardComponent/CardParticularOrderDetailsHelperInterface';



function CardParticularOrderDetailsHelper(props: CardParticularOrderDetailsHelperInterface) {
  return (
    // <div className='flex flex-row justify-between items-center content-center'>
      <div className='grid grid-cols-6 justify-between items-center content-center'>
      <div className='col-span-3 flex flex-row justify-start mt-0.5 py-3 items-center'>
        <img src={props.imageSrc} alt='Food' className='w-10 h-10 rounded-md object-cover' />
        <div className='flex flex-col justify-items-start items-start ml-2'>
          <Tag bold='light' padding='md:py-1 md:px-2 p-0' textSize='lg'>
            <>{props.itemName} </>
          </Tag>
          <Tag textSize='xs' textColor='400' padding='md:py-1 md:px-2 p-0'>
            <>
              {props.categoryName} &gt; {props.itemName}
            </>
          </Tag>
        </div>
      </div>
      {/* showIncrementButton === true  , then we will show IncrementDecrementButton else we will show the tag  */}
      {/* 1. New Order -> Here we will show IncrementDecrementButton */}
      {/* 2. Preparation -> Here we will show the Tag */}
      <div className='col-span-2 justify-self-center'>
        {props.showIncrementButton ? (
          <IncrementDecrementButton
            type={IncrementDecrementButtonType.ORDER}
            itemId={props.itemId}
            quantity={props.noOfItem}
            orderItemId={props.orderItemId}
            orderId={props.orderId}
          />
        ) : (
          <Tag bg={true} textColor='400' textSize='sm' padding='md:py-1 md:px-2 py-0 px-0'>
            <>QTY : {props.noOfItem} </>
          </Tag>
        )}
      </div>

      <div className='col-span-1 justify-self-end text-center'> 
        <Tag textColor='slate-6' textSize='sm' padding='md:py-1 md:px-2 p-0'>
          <> ₹ {props.pricePerItem}</>
        </Tag>
     </div>
    </div>
  );
}

export default CardParticularOrderDetailsHelper;
