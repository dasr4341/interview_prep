/*  */
import { patientSetUp } from 'graphql/setup.query';
import catchError from 'lib/catch-error';
import { useEffect, useState } from 'react';
import { client } from 'apiClient';
import { LoadingIndicator } from 'components/LoadingIndicator';
import Alert from 'components/ui/alert/Alert';
import { Link, useNavigate } from 'react-router-dom';
import { routes } from 'routes';
import {
  SetupFitbit,
  SetupFitbitVariables,
  SetupFitbit_pretaaHealthSetupFitbit_FitbitAccountExistsResponse,
  RemoveExistingFitbit,
  RemoveExistingFitbitVariables,
  GetUser,
} from 'health-generatedTypes';
import Button from 'components/ui/button/Button';
import { useLazyQuery } from '@apollo/client';
import { removeExistingFitbit } from 'graphql/remove-existing-fitbit-account';
import { toast } from 'react-toastify';
import { getRedirectUrl } from 'lib/api/users';
import { getUserQuery } from 'graphql/user.query';
import { authSliceActions } from 'lib/store/slice/auth/auth.slice';
import { delay } from 'lodash';
import { useAppDispatch } from 'lib/store/app-store';
import { config } from 'config';
import FitbitOnboardingHeader from '../FitbitOnboarding/components/FitbitOnboardingHeader';

export default function FitbitConfirm() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  async function redirect() {
    const { data }: { data: GetUser } = await client.query<GetUser>({
      query: getUserQuery,
    });
    dispatch(authSliceActions.setUser(data));

    // Update user not synchronous, So run actions later after 1sec
    delay(() => {
      const url = getRedirectUrl(data);
      navigate(url);
    }, 1000);
  }

  const [linkFitbit, { loading: fitbitLoading }] = useLazyQuery<RemoveExistingFitbit, RemoveExistingFitbitVariables>(removeExistingFitbit, {
    onCompleted: (d) => {
      if (d.pretaaHealthSetupDuplicateFitbit) {
        toast.success('Successfully linked with fitbit');
        if (localStorage.getItem(config.storage.user_store)) {
          redirect();
        } else {
          navigate(routes.fhsInvitation.match);
        }
      }
    },
    onError: (e) => catchError(e, true),
  });

  const [currentState, setCurrentState] = useState<{
    loading: boolean;
    error: string | null;
    data: SetupFitbit_pretaaHealthSetupFitbit_FitbitAccountExistsResponse | null;
  }>({
    loading: true,
    error: '',
    data: null,
  });

  async function setup() {
    try {
      const response = await client.query<SetupFitbit, SetupFitbitVariables>({
        query: patientSetUp,
        variables: {
          authorizationCode: new URL(window.location.toString()).searchParams.get('code') as string,
        },
      });
      setCurrentState({ loading: false, data: response.data.pretaaHealthSetupFitbit as any, error: null });
      console.log({ data: response });
      const data: SetupFitbit_pretaaHealthSetupFitbit_FitbitAccountExistsResponse = response.data.pretaaHealthSetupFitbit as any;

      if (localStorage.getItem(config.storage.user_store) && data?.accessToken && !data?.accountExists) {
        redirect();
      } else if (data?.accessToken && !data?.accountExists) {
        navigate(routes.fhsInvitation.match);
      }
    } catch (e) {
      console.log(e);
      setCurrentState({ loading: false, data: null, error: catchError(e) });
    }
  }

  function handleConfirmClick() {
    if (currentState.data) {
      linkFitbit({
        variables: {
          accessToken: currentState.data.accessToken,
          refreshToken: currentState.data.refreshToken,
          fitbitUserId: currentState.data.fitbitUserId,
        },
      });
    }
  }

  useEffect(() => {
    if (!localStorage.getItem('fhs_get_code')) {
      setup();
    }
  }, []);

  return (
    <>
      <div className="h-screen bg-white">
        <FitbitOnboardingHeader>
          <div>Confirm</div>
        </FitbitOnboardingHeader>

        <section className="text-gray-700 border-t border-gray-200">
          <div className="container px-5 md:px-0 py-8 mx-auto text-center">
            {currentState.loading && <LoadingIndicator />}
            {currentState.data?.accountExists && (
              <div className="font-semibold text-gray-850 text-base tracking-widest pt-8  text-color mb-2">
                <div className="">
                  <div className="max-w-1/2 mx-auto my-8">
                    <p>
                      This Fitbit account is already linked with another Pretaa Health account. One Fitbit account can be connected with
                      only one Pretaa Health account.
                    </p>
                    <p className='mt-4'>Your Fitbit account will be connected to this new account. Do you want to continue?</p>
                    <div className="mt-4 flex justify-center">
                      <Button onClick={handleConfirmClick} loading={fitbitLoading} disabled={fitbitLoading}>
                        Confirm
                      </Button>
                      <Link to={routes.login.match}>
                        <Button className="ml-2" buttonStyle="bg-none">
                          Cancel
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>

      {currentState.error && (
        <Alert>
          <>{currentState.error}</>
        </Alert>
      )}
    </>
  );
}
