/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Security, useOktaAuth } from '../../../../src/assets/js/okta-esm.js';
import { OktaAuth, toRelativeUrl } from '@okta/okta-auth-js';
import queryString from 'query-string';
import { routes } from 'routes';
import loader from 'assets/images/loading_icon.gif';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'lib/store/app-store.js';
import { config } from '../../../config';
import { authSliceActions } from 'lib/store/slice/auth/auth.slice';
import restApi from 'lib/rest-client';
import { ValidateTokenResponse } from 'interface/validate-token.interface.js';

function OktaLoginScreenTwo(): JSX.Element {
  const okta: any = useOktaAuth();

  useEffect(() => {
    if (!okta) {
      return;
    }

    okta.oktaAuth.token.getWithRedirect({
      responseType: ['id_token', 'token'],
      scopes: ['openid', 'profile', 'email'],
    });
  }, [okta]);

  return (
    <div className="flex flex-col h-screen items-center justify-center">
      <img src={loader} alt="loading..." width={30} height={30} />
      <span className="text-base text-primary">Redirecting...</span>
    </div>
  );
}

function OktaLoginScreenCallback(): JSX.Element {
  const okta: any = useOktaAuth();
  const location = useLocation();
  const user = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();
  const token = queryString.parse(location.search);
  const dispatch = useDispatch();
  console.log(token, location);

  useEffect(() => {
    sessionStorage.removeItem('state');
    if (!okta) {
      return;
    }

    if (token.code) {
      okta.oktaAuth.token
        .parseFromUrl()
        .then((tokens: any) => tokens.tokens.accessToken?.accessToken)
        .then((id_token: string) => {
          return restApi.validateToken({ token: id_token });
        })
        .then(({ data }: { data: ValidateTokenResponse }) => {
          console.log(data);
          if (data.loginToken) {
            localStorage.setItem(config.storage.token, data.loginToken);
            localStorage.setItem(config.storage.refreshToken, data.refreshToken);
            localStorage.setItem(config.storage.loginTime, JSON.stringify(moment().format('HH:mm')));
            dispatch(authSliceActions.getCurrentUser());
          } else {
            throw new Error('Unable to login');
          }
        })
        .catch((e: any) => console.log(e.message));
    }
  }, [okta, token, navigate]);

  useEffect(() => {
    if (user) {
      if (user.currentUser.customer.onboarded) {
        navigate(routes.events.match, { replace: true });
      } else {
        navigate(routes.sourceSystem.match, { replace: true });
      }
    }
  }, [user]);

  return (
    <div className="flex flex-col h-screen items-center justify-center">
      <img src={loader} alt="loading..." width={30} height={30} className="mb-5" />
      <span className="text-base text-primary">Loading...</span>
    </div>
  );
}

export default function OktaLoginScreen(): JSX.Element {
  const navigate = useNavigate();

  const [oktaAuth, setOktaAuth] = useState<OktaAuth>();
  const location = useLocation();

  useEffect(() => {
    const query = queryString.parse(location.search);
    let fromstorage;
    if (location && location.search && !query.state) {
      sessionStorage.setItem('state', JSON.stringify(queryString.parse(location.search)));
    } else if (location && location.search && query.state) {
      fromstorage = JSON.parse(sessionStorage.getItem('state') || '');
    }

    const oktaConfig: any = fromstorage ? fromstorage : queryString.parse(location.search);

    if (!config) {
      return;
    }

    const redirectUri = window.location.origin + '/okta/callback';

    const o = new OktaAuth({
      issuer: oktaConfig.domain,
      clientId: oktaConfig.clientId,
      redirectUri,
    });

    console.log(o);
    setOktaAuth(o);
  }, [location.search]);

  const restoreOriginalUri = async (_oktaAuth: OktaAuth, originalUri: string) => {
    navigate(toRelativeUrl(originalUri, window.location.origin));
  };

  const allowed = ['/login', '/okta', '/okta/callback'];

  const token = localStorage.getItem(config.storage.token);

  if (token === null) {
    if (!allowed.includes(location.pathname)) {
      console.log('should redirect');
      return <Navigate to="/login" />;
    }
  }

  const oktaRender = location.pathname.includes('callback') ? <OktaLoginScreenCallback /> : <OktaLoginScreenTwo />;

  return oktaAuth ? (
    <Security oktaAuth={oktaAuth} restoreOriginalUri={restoreOriginalUri}>
      {oktaRender}
    </Security>
  ) : (
    <></>
  );
}
