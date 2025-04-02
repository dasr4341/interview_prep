import React from 'react';
import { useNavigate } from 'react-router-dom';
import { routes } from 'routes';

import FitBitImage from '../../../assets/images/watches.png';
import FitBitText from '../../../assets/images/fitbit_border_text.png';
import './_fitbitJoinTheProgramme.scoped.scss';
import Button from 'components/ui/button/Button';
import FitbitOnboardingHeader from '../FitbitOnboarding/components/FitbitOnboardingHeader';
import { useAppSelector } from 'lib/store/app-store';
import { config } from 'config';
import { HealthConnectorType } from 'interface/health-data-connector.interface';
import { TabNames } from '../AppleOnboarding/lib/apple-onboarding-interface';

export default function FitbitJoinTheProgramme() {
  const navigate = useNavigate();
  const user = useAppSelector(state => state.auth.user);

  const redirectToRegister = (type: HealthConnectorType) => {
    if (user?.pretaaHealthCurrentUser.id && type ===  HealthConnectorType.apple) {
      navigate(routes.appleOnboarding.connect.build(TabNames.CONNECT));
    } else if (user?.pretaaHealthCurrentUser.id && type ===  HealthConnectorType.fitbit) {
      navigate(routes.linkWithFitbit.match);
    } else {
      sessionStorage.setItem(config.storage.health_data_type, type);
      navigate(routes.fhsOnboarding.match);
    }
  };

  return (
    <div className="h-screen bg-white">
      <FitbitOnboardingHeader>
        <div>Better Connections.</div>
        <div className="pt-3">Better Outcomes. </div>
      </FitbitOnboardingHeader>

      <section className="text-gray-700 border-t border-gray-200">
        <div className="container px-5 md:px-0 py-8 mx-auto text-center flex flex-col">
          <div className="md:w-96 mx-auto">
            <img src={FitBitImage} alt="fitbit_image" className='md:w-96' />
          </div>
          <div className="font-semibold text-gray-850 text-base tracking-widest pt-8 uppercase text-color">It takes commitment</div>
          <div className="w-56 fitbit-border-text mx-auto -mt-2">
            <img src={FitBitText} alt="Fitbit_text" />
          </div>
          <div className="lg:py-6 -mb-10 lg:w-1/2 text-center mx-auto">
            <div className=" mb-10">
              <div className="mx-auto text-width">
                <h2 className="text-gray-900 text-smd mb-3 font-light leading-relaxed text-size">
                  Click the button below to connect your <span className="font-bold">Watch</span>
                </h2>
              </div>
              <div className="mt-7 mx-auto flex flex-col justify-center md:w-80">
                <div
                  onClick={() => redirectToRegister(HealthConnectorType.fitbit)}
                  className='flex justify-center mb-4'>
                  <Button className="p-6 w-full" buttonStyle="green">Connect Fitbit</Button>
                </div>
                <div
                  onClick={() => redirectToRegister(HealthConnectorType.apple)}
                  className='flex justify-center'>
                  <Button className="p-6 w-full" buttonStyle="black">Connect Apple Watch</Button>
                </div>
                {user && (
                  <Button
                    onClick={() => navigate(routes.logout.match)}
                    text='Logout'
                    type="button"
                    buttonStyle="no-outline"
                    size="xs"
                    align="center"
                    classes="mt-6 text-more"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
