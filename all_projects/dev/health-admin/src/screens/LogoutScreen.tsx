/*  */
import { config } from 'config';
import { resetState } from 'lib/api/users';
import useQueryParams from 'lib/use-queryparams';
import { useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { client } from '../apiClient';
import { routes } from '../routes';
import { useSelector } from 'react-redux';
import { RootState } from 'lib/store/app-store';

export function LogoutScreen(): JSX.Element {
  const query: { userType?: string } = useQueryParams();
  const location = useLocation();
  const params = useParams();
  const impersonate = useSelector((state: RootState) => state.auth.impersonate);

  const redirectToLogin = (type: 'admin' | 'other') => {
    client.stop();
    client.resetStore().then(() => {
      resetState();
      if (type === 'admin') {
        history.pushState(null, '', routes.owner.login.match);
        window.location.href = routes.owner.login.match;
      } else {
        history.pushState(null, '', routes.login.match);
        window.location.href = routes.login.match;
      }
    });
  };

  useEffect(() => {
    if (
      query.userType === config.roles.owner ||
      location.pathname.includes(routes.adminPasswordReset.build(String(params.tokenId))) ||
      impersonate[0]?.selectedRole === 'pretaa-admin'
    ) {
      redirectToLogin('admin');
    } else {
      redirectToLogin('other');
    }
  }, [query]);

  return <div />;
}
