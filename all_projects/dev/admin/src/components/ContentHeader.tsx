import React, { ReactNode } from 'react';
import { NavigationHeader } from './NavigationHeader';
import leftIcon from 'assets/icons/icon_primary_left.svg';
import { useNavigate } from 'react-router-dom';

export function ContentHeader({
  children,
  link,
  title,
  count,
  disableGoBack,
  titleLoading,
  className,
}: {
  children?: ReactNode;
  link?: string;
  title?: string | null;
  breadcrumb?: boolean;
  count?: number;
  disableGoBack?: boolean;
  titleLoading?: boolean;
  className?: string;
}): JSX.Element {
  const navigate = useNavigate();
  const customLoaderStyle = {
    border: 'unset',
    marginBottom: 'unset',
    padding: '0px',
    minHeight: '40px',
  };

  function goBack() {
    navigate(-1);
  }

  function goToLink() {
    if (link) {
      navigate(link, { replace: true });
    }
  }

  const loader = () => {
    return (
      <div className="ph-item" style={customLoaderStyle}>
        <div className="ph-col-12 mb-5 mt-2 pl-0">
          <div className="ph-row">
            <div className="ph-col-4 big" />
          </div>
        </div>
      </div>
    );
  };

  return (
    <header className={`px-6 pt-8 pb-4 lg:px-16 lg:py-8 top-0 bg-white z-20 shadow-outer relative ${className}`}>
      
      {!disableGoBack && (
        <div
          className="breadcrumb flex cursor-pointer"
          onClick={() => (link ? goToLink() : goBack())}
          data-testid="page-back-button">
          <img src={leftIcon} alt="left-icon" />
          <span className="ml-2.5">Back</span>
        </div>
      )}

      {title ? (
        <NavigationHeader title={title} link={link} count={count} disableGoBack={true} testId="page-title" />
      ) : (
        titleLoading && loader()
      )}

      {children}
    </header>
  );
}
