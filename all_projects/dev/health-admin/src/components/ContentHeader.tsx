import { ReactNode } from 'react';
import { NavigationHeader } from './NavigationHeader';
import leftIcon from 'assets/icons/icon_primary_left.svg';
import { useLocation, useNavigate } from 'react-router-dom';
import { clearLastViewUrl, getLastViewUrl, getRedirectUrl } from 'lib/api/users';
import { useAppSelector } from 'lib/store/app-store';
import { routes } from 'routes';

export function ContentHeader({
  children,
  link,
  title,
  count,
  disableGoBack,
  titleLoading = false,
  className
}: {
  children?: ReactNode;
  link?: string;
  title?: string | null | ReactNode;
  breadcrumb?: boolean;
  count?: number;
  disableGoBack?: boolean;
  titleLoading?: boolean;
  className?: string;
}): JSX.Element {
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);
  const pretaaAdmin = useAppSelector((state) => state.auth.pretaaAdmin);
  const customLoaderStyle = {
    border: 'unset',
    marginBottom: 'unset',
    padding: '0px',
    minHeight: '40px',
  };
  const { key } = useLocation();

  function redirectAfterDeepLinkVisit() {
    if (user) {
      clearLastViewUrl();
      const url = getRedirectUrl(user);
      navigate(url);
    } else if (pretaaAdmin) {
      navigate(routes.owner.clientManagement.match);
    }
  }

  function goBack() {
    const lastKnownUrl = getLastViewUrl();
    if (lastKnownUrl || key === 'default') {
      redirectAfterDeepLinkVisit();
    } else {
      navigate(-1);
    }
  }

  function goToLink() {
    const lastKnownUrl = getLastViewUrl();
    if (lastKnownUrl) {
      redirectAfterDeepLinkVisit();
    } else if (link) {
      navigate(link, { replace: true });
    }
  }

  function redirect() {
    if (link) {
      goToLink();
    } else {
      goBack();
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
    <header className={`px-6 pt-8 pb-4 lg:px-16 lg:py-8 top-0 bg-white z-20 relative ${className}`}>
      {!disableGoBack && (
        <div className="breadcrumb flex cursor-pointer w-fit" onClick={redirect} data-testid="page-back-button">
          <img src={leftIcon} alt="left-icon" />
          <span className="ml-2.5">Back</span>
        </div>
      )}

      {titleLoading ? loader() : title && <NavigationHeader title={title} link={link} count={count} disableGoBack={true} testId="page-title" />}

      {children}
    </header>
  );
}
