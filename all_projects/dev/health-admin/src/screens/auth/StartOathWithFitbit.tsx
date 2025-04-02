import React from 'react';

import FitBitImage from '../../assets/images/fitbit.png';
import FitBitText from '../../assets/images/fitbit_border_text.png';
import './FitbitJoinTheProgramme/_fitbitJoinTheProgramme.scoped.scss';
import Button from 'components/ui/button/Button';
import FitbitOnboardingHeader from './FitbitOnboarding/components/FitbitOnboardingHeader';
import { authorizeFitbit } from 'lib/fitbit-authorize';
import { Link } from 'react-router-dom';
import { routes } from 'routes';
import { useAppSelector } from 'lib/store/app-store';

export default function FitbitJoinTheProgramme() {
  const user = useAppSelector((u) => u.auth.user);

  return (
    <div className="h-screen bg-white">
      <FitbitOnboardingHeader>
        <div>Better Connections.</div>
        <div className="pt-3">Better Outcomes. </div>
      </FitbitOnboardingHeader>

      <section className="text-gray-700 border-t border-gray-200">
        <div className="container px-5 md:px-0 py-8 mx-auto text-center">
          <div className="w-52 mx-auto">
            <img src={FitBitImage} alt="fitbit_image" />
          </div>
          <div className="font-semibold text-gray-850 text-base tracking-widest pt-8  text-color mb-2">
            Seems like fitbit and pretaa health connections is completed or expired. <br/> Please link your Fitbit account with Pretaa health  
          </div>
          <div className="w-56 fitbit-border-text mx-auto -mt-2">
            <img src={FitBitText} alt="Fitbit_text" />
          </div>
          <div className="lg:py-6 -mb-10 lg:w-1/2 text-center mx-auto">
            <div className=" mb-10">
              <div className="mx-auto text-width">
                <h2 className="text-gray-900 text-smd mb-3 font-light leading-relaxed text-size">
                  Click the button below to connect your <span className="font-bold">Fitbit Account</span>
                </h2>
              </div>
              <div className="mt-5 flex justify-center">
                <Button className="lg:px-28" onClick={() => authorizeFitbit()}>Connect Fitbit</Button>
              </div>
              {user?.pretaaHealthCurrentUser.fitbitTokenInvalid && (
              <div className='mt-5 flex justify-center'>
                <Link to={routes.logout.match}>
                  Logout
                </Link>
              </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
