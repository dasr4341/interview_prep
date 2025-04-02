import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { routes } from 'routes';

import './_fitbitOnboarding.scoped.scss';

import FitbitOnboardingHeader from './components/FitbitOnboardingHeader';
import Button from 'components/ui/button/Button';
import FitbitImage from 'assets/images/authenticate.png';
import useQueryParams from 'lib/use-queryparams';
import { config } from 'config';
import { useAppSelector } from 'lib/store/app-store';
import { toast } from 'react-toastify';

export default function FitbitOnboarding() {
  const queryParams: { facility?: string } = useQueryParams();
  const user = useAppSelector(state => state.auth.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (queryParams.facility) {
      sessionStorage.setItem(config.storage.facilityId, queryParams.facility);
    } else {
      toast.error('Invalid facility id! Please contact with Facility', { toastId: 'invalid-facility-ID', autoClose: false  });
    }
  }, [queryParams]);

  return (
    <div className="h-screen bg-white">
      <FitbitOnboardingHeader>
        <div>Better Connections.</div>
        <div className="pt-3">Better Outcomes. </div>
      </FitbitOnboardingHeader>
      <div className="container block md:grid md:grid-cols-2 items-center mx-auto md:pb-16 lg:pb-32">
        <div className="pt-20 md:pt-28 flex justify-center">
          <img src={FitbitImage} alt="Green-City" width={400} height={373} />
        </div>
        <div className="md:pt-32 text-center ">
          <div>
            <div className="width">
              <h2 className="text-gray-900 font-medium heading-text-size leading-10 mt-6">
                Welcome to the <br /> <span className="font-bold"> Pretaa Health Program </span>
              </h2>
              <p className="mt-2 font-light mx-auto px-6 text-xsmd mx:px-0">
                Our mission is to improve outcomes for the millions of Americans and their friends and families that are being affected by substance abuse.
              </p>
              <div className="pt-4 md:pt-10 text-xmd leading-tight font-semibold text-color">Better Connections. Better Outcome. </div>
            </div>
            <div className="flex flex-col mb-10 items-center mt-7 justify-center">
              <Link to={routes.fhsJoinTheProgramme.match}>
                <Button className="md:px-24">Join the program</Button>
              </Link>
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
      <>
        <hr />
        <div className="px-5 pt-5 max-w-sm pb-10 font-normal text-more flex justify-center text-gray-150">
          <div className="text-left">
            <p>By choosing “Join” you agree to our </p>
            <Link to="">
              <p className="underline font-medium">Terms & Conditions</p>
            </Link>
          </div>
        </div>
      </>
    </div>
  );
}
