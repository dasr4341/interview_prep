/* eslint-disable react-hooks/exhaustive-deps */
import { TrackingApi } from 'components/Analytics';
import { RootState } from 'lib/store/app-store';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { routes } from 'routes';

export function MainScreen(): JSX.Element {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);
  const adminUser = useSelector((state: RootState) => state.auth.admin);

  useEffect(() => {
    if (user) {
      navigate(routes.events.match);
    } else if (adminUser) {
      navigate(routes.controlPanelScreen.match);
    }
  }, [navigate]);

  useEffect(() => {
    TrackingApi.log({
      pageName: routes.home.name,
    });
  }, []);

  return <>Home</>;
}
