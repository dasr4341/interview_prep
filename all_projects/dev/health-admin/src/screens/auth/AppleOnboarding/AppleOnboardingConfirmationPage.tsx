import React from 'react';
import { useNavigate } from 'react-router-dom';

import AppleWatchConfirmation from '../../../assets/images/apple_watch_confirmation.png';
import './_apple-onboarding-connect.scoped.scss';
import { routes } from 'routes';
import AppleOnboardingLogoutButton from './component/AppleOnboardingLogoutButton';

export default function AppleOnboardingConfirmationPage() {
  const navigate = useNavigate();
  return (
    <div>
      <section className="text-gray-700 mt-4 lg:mt-16">
        <div className="md:flex justify-center gap-10 2xl:gap-20">
          <div className="w-32 md:w-28 lg:w-80 h-full mx-auto mt-8 lg:mt-0 lg:mx-0 md:pb-6">
            <img
              src={AppleWatchConfirmation}
              alt="fitbit_confirmation"
            />
          </div>

          <div className="border-r border-gray-200"></div>
          <div className="lg:mt-20">
            <div className="md:py-5 lg:w-1/2 ">
              <div className=" mb-10">
                <div className=" text-width lg:pl-4 lg:pb-8 text-center md:text-left mt-5 md:mt-0 px-5 md:px-2 lg:px-0">
                  <h2 className="text-gray-900 text-smd mb-3 font-medium leading-relaxed text-size">
                    Verify Permission from iPhone
                  </h2>
                </div>
                <div className="flex justify-center md:block pb-3 md:pl-2">
                  <button
                    onClick={() => navigate(routes.events.default.match)}
                    className="btn hover:border-yellow-800 ml-4
  hover:bg-yellow-800 hover:text-black  px-6 md:px-20 lg:px-28 h-11">
                    Continue{' '}
                  </button>
                </div>
                <AppleOnboardingLogoutButton className="ml-2 px-16" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
