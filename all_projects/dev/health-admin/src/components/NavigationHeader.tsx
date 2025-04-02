import { Link, useNavigate } from 'react-router-dom';
import { ReactNode } from 'react';


export default function Count({ count }: { count: number }) {
  return (
    <>
      {count > 0 && (
        <span className="text-orange"> ({ count }) </span>
      )}
    </>
  );
}


export function NavigationHeader({
  title,
  link,
  count,
  disableGoBack,
  children,
  testId,
}: {
  title?: ReactNode | string;
  link?: string;
  count?: number;
  disableGoBack?: boolean;
  children?: ReactNode;
  testId?: string
}): JSX.Element {
  const navigate = useNavigate();
  if (!children && title) {
    if (link) {
      return (
        <Link className="block relative text-primary mb-5 mt-2" to={link}>
          <h1 className="h1 leading-none text-primary font-bold 
            text-md lg:text-lg" data-test-id={testId}>{title}
              <Count count={count as unknown as number} />
          </h1>
        </Link>
      );
    } else if (!disableGoBack) {
      return (
        <div className="block flex-1 
        relative text-primary mb-5 mt-2 cursor-pointer" 
          onClick={() => navigate(-1)} data-testid="page-back-button">
          <h1
            className="h1 leading-none text-primary font-bold 
            text-md lg:text-lg" data-test-id={testId}>
            {title}
          </h1>
        </div>
      );
    } else {
      return <h1 className="h1 leading-none text-primary font-bold 
      text-md lg:text-lg mb-5 mt-2" data-test-id={testId}>{title}
        <Count count={count as unknown as number} />
      </h1>;
    }
  } else {
    return <h1 className="h1 leading-none text-primary font-bold 
    text-md lg:text-lg mb-5 mt-2" data-test-id={testId}>{children}</h1>;
    }
  
}
