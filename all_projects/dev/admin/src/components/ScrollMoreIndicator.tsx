import { FaChevronRight } from 'react-icons/fa';

export function ScrollMoreIndicator(): JSX.Element {
  const classes = [
    '-translate-y-1/2',
    'absolute',
    'bg-primary-light',
    'flex',
    'p-3',
    'right-4',
    'rounded-full',
    'text-white',
    'top-1/2',
    'transform',
  ];

  return (
    <div className={classes.join(' ')}>
      <FaChevronRight />
    </div>
  );
}
