import { ReactNode } from 'react';

export function ContentFrame({
  classes = [],
  className = '',
  children,
  type,
}: {
  classes?: string[];
  className?: string;
  children: ReactNode;
  type?: 'with-footer' | 'footer-with-noscroll';
}): JSX.Element {
  const defaultPadding = classes.join().includes('pb-')
    ? []
    : ['px-5', 'py-5', 'lg:px-16', 'lg:py-8', 'sm:px-15', 'sm:py-10'];

  function getTypes() {
    let classNameForType = '';

    switch (type) {
      case 'with-footer':
        classNameForType = 'flex-grow h-full overflow-auto';
        break;

      case 'footer-with-noscroll':
        classNameForType = 'flex-grow';
        break;
    }
    
    return classNameForType;
  }
  return (
    <div
      data-testid="content-frame"
      className={`${[...classes, 'bg-gray-50', ...defaultPadding, getTypes()].join(' ')} ${className}`}>
      {children}
    </div>
  );
}
