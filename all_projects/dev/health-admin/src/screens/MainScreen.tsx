/*  */
import { getRedirectUrl } from 'lib/api/users';
import { RootState, useAppSelector } from 'lib/store/app-store';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { routes } from 'routes';

export function MainScreen(): JSX.Element {
  const navigate = useNavigate();
  const user = useAppSelector((state: RootState) => state.auth.user);
  const pretaaAdmin = useAppSelector((state: RootState) => state.auth.pretaaAdmin);
  const loadingState = useAppSelector(state => state.app.loading);

  useEffect(() => {
    if (!loadingState) {
      if (user) {
        const url = getRedirectUrl(user);
        navigate(url);
      } else if (pretaaAdmin?.id) {
        navigate(routes.owner.clientManagement.match, { replace: true });
      } else  {
        navigate(routes.login.match, { replace: true });
      }
    }
  }, [navigate, loadingState]);

  return <></>;
}
