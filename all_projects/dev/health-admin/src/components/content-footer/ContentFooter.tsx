import { ReactNode } from 'react';

export function ContentFooter({
  className = '',
  children,
  block
}: {
  className?: string;
  children: ReactNode;
  block?: boolean
}): JSX.Element {
  return (
    <footer
      className={`bg-white  px-5 py-5 lg:px-16 lg:py-8 border-2
       sm:px-15 sm:py-10  ${className}`} data-testid="content-footer">
      <div className={block ? '' : 'block md:flex lg:flex'}>
        {children}
      </div>
    </footer>
  );
}
