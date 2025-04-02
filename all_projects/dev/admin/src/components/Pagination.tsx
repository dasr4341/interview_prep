import React, { FC } from 'react';
import NextIcon from './icons/NextIcon';
import PrevIcon from './icons/PrevIcon';

interface Props {
  skip: number;
  setSkip: React.Dispatch<React.SetStateAction<number>>;
  isPrevDisabled: boolean;
  isNextDisabled: boolean;
  pageSize: number;
}

const Pagination: FC<Props> = ({ skip, setSkip, isPrevDisabled, isNextDisabled, pageSize }) => {
  const onNext = () => setSkip(pageSize + skip);

  const onPrev = () => {
    if (skip >= pageSize) {
      setSkip(skip - pageSize);
    } else {
      setSkip(skip);
    }
  };

  return (
    <div className="flex items-center justify-center space-x-10">
      <button disabled={isPrevDisabled} onClick={onPrev}>
        <PrevIcon className={isPrevDisabled ? 'cursor-not-allowed' : 'cursor-pointer'} />
      </button>
      <button disabled={isNextDisabled} onClick={onNext}>
        <NextIcon className={isNextDisabled ? 'cursor-not-allowed' : 'cursor-pointer'} />
      </button>
    </div>
  );
};

export default Pagination;
