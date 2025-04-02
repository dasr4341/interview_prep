import React, { useState } from 'react';

import FitbitConnect from '../../../assets/images/fitbit-connect.png';
import FitbitInstall from '../../../assets/images/fitbit-install.png';
import { useNavigate } from 'react-router-dom';
import { routes } from 'routes';
import ConfirmationDialog from 'components/ConfirmationDialog';
import CloseIcon from 'components/icons/CloseIcon';
import { TabNames } from './lib/apple-onboarding-interface';
import './_apple-onboarding-connect.scoped.scss';
import AppleOnboardingLogoutButton from './component/AppleOnboardingLogoutButton';

export default function AppleOnboardingInstallPage() {
  const navigate = useNavigate();
  const [needHelpModal, setNeedHelpModal] = useState(false);

  return (
    <div>
      <section className="text-gray-700 mt-3 lg:mt-16">
        <div className="sm:flex justify-center gap-3 2xl:gap-24">
          <div className="flex gap-4 md:px-10 px-4 items-center container-width">
            <div className=" w-32 md:w-28 lg:w-56 mx-auto lg:mx-0 md:pb-6">
              <img
                src={FitbitConnect}
                alt="fitbit_connect"
              />
            </div>
            <div className="fitbit-install pt-6 sm:pt-0">
              <img
                src={FitbitInstall}
                alt="fitbit_install"
              />
            </div>
          </div>

          <div className="border-r border-gray-200"></div>
          <div className="md:mt-6">
            <div className="lg:py-5 lg:w-1/2 ">
              <div className=" mb-10">
                <div className=" text-width lg:pl-4 lg:pb-8 text-center md:text-left mt-5 md:mt-0 px-5 md:px-0">
                  <h2 className="text-gray-900 text-xmd mb-3 font-light leading-relaxed text-size">
                    Install
                    <span className="font-bold"> Pretaa Health </span>App in
                    your watch
                  </h2>
                </div>
                <div className='flex justify-center gap-5 md:block pb-3'>
                  <button
                    className="font-medium text-xss text-black mt-4 pb-5 underline lg:pl-4 lg:mb-8 hidden"
                    onClick={() => setNeedHelpModal(true)}>
                    Need Help?
                  </button>

                  <button
                    onClick={() =>
                      navigate(
                        routes.appleOnboarding.connect.build(TabNames.OPEN)
                      )
                    }
                    className="btn hover:border-yellow-800 md:ml-4
    hover:bg-yellow-800 hover:text-black  px-6 md:px-20 lg:px-28 h-11">
                    Continue{' '}
                  </button>

                </div>
                <AppleOnboardingLogoutButton className='px-16'/>
              </div>
            </div>
          </div>
        </div>
      </section>
      <ConfirmationDialog
        hideBtns={true}
        modalState={needHelpModal}
        onCancel={() => setNeedHelpModal(false)}
        className="max-w-sm rounded-xl pb-10">
        <div className="pb-5">
          <div className="flex justify-between">
            <div></div>

            <button
              onClick={() => setNeedHelpModal(false)}
              className="pb-4">
              <CloseIcon className="  w-6 h-6 bg-gray-200 p-1 rounded-full cursor-pointer" />
            </button>
          </div>
          What is Lorem Ipsum? Lorem Ipsum is simply dummy text of the printing
          and typesetting industry. Lorem Ipsum has been the industry's standard
          dummy text ever since the 1500s, when an unknown printer took a galley
          of type and scrambled it to make a type specimen book. It has survived
          not only five centuries, but also the leap into electronic
          typesetting, remaining essentially unchanged. It was popularised in
          the 1960s with the release of Letraset sheets containing Lorem Ipsum
          passages, and more recently with desktop publishing software like
          Aldus PageMaker including versions of Lorem Ipsum.
        </div>
      </ConfirmationDialog>
    </div>
  );
}
