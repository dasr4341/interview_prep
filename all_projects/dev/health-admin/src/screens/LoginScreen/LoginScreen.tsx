
/*  */
import React, { useEffect, useState } from 'react';
import './_login-screen.scoped.scss';
import LoginHeader from 'components/LoginHeader';
import { PretaaAdminLogin_pretaaHealthAdminLogin } from 'health-generatedTypes';
import LoginForm from './components/LoginForm';
import OtpVerificationForm from './components/OtpVerificationForm';
import Button from 'components/ui/button/Button';
import { useLocation, useNavigate } from 'react-router-dom';
import { routes } from 'routes';
import { LoginResponse } from 'interface/auth.interface';

interface CurrentStateInterface {
  data:  PretaaAdminLogin_pretaaHealthAdminLogin | LoginResponse | null;
}

export enum PretaaHealthUserTypes {
  FACILITY_USER = 'FACILITY_USER',
  PATIENT = 'PATIENT',
  SUPPORTER = 'SUPPORTER',
  PRETAA_ADMIN = 'PRETAA_ADMIN',
}

export function LoginScreen(): JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
  const [useType, setUserType] = useState<PretaaHealthUserTypes>(PretaaHealthUserTypes.PATIENT);
  
  const [currentState, setCurrentState] = useState<CurrentStateInterface>({ data: null });
  const [verifyOtpForm, setVerifyOtpForm] = useState(false);


  useEffect(() => {
    // Please read this before editing this page ***** ------------------

    // here mainly 3 user are present for them the login resolver is different so,
    // for diff user we have diff routes, but using the same component
    // we will differentiate the user by the url
    
    if (location.pathname.includes(routes.owner.login.match)) {
      setUserType(PretaaHealthUserTypes.PRETAA_ADMIN);
    }
  }, [location]);

  let routePath: string;
  if (location.pathname === routes.owner.login.match){
    routePath =  routes.adminForgetPassword.match;
  } else {
    routePath = routes.forgetPassword.match;
  }

  return (
    <div className="bg-gray-50 wrapper-container overflow-auto">
      <LoginHeader className="h-1/2" />
      <div className="pt-6 md:pt-12 pb-4">
        {!verifyOtpForm && (
          <LoginForm
            userType={useType}
            verifyOtpForm={() => setVerifyOtpForm(true)}
            setResponse={(loginResponse) => setCurrentState({ data: loginResponse })}
          />
        )}

        {verifyOtpForm && useType !== PretaaHealthUserTypes.PRETAA_ADMIN && (
          <OtpVerificationForm
            message={String(currentState.data?.message)}
            twoFactorAuthToken={String(currentState.data?.twoFactorAuthToken)}
          />
        )}
      </div>
      <React.Fragment>
        <hr />

        <div className="md:w-96 md:mx-auto px-5 max-w-sm pb-10">
          <div className="flex justify-between">
            <Button
              onClick={() => (verifyOtpForm ? setVerifyOtpForm(false) : navigate(routePath))}
              text={verifyOtpForm ? 'Change email?' : 'Forgot Password?'}
              type="button"
              buttonStyle="no-outline"
              size="xs"
              align="left"
              classes="my-3 text-more"
            />
            {location.pathname.includes('pretaa-admin') && (
              <Button
                onClick={() => navigate(routes.login.match)}
                text="Go to Dashboard Login"
                type="button"
                buttonStyle="no-outline"
                size="xs"
                align="left"
                classes="my-3 text-more"
              />
            )}
          </div>
        </div>
      </React.Fragment>
    </div>
  );
}
