import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import FitbitOpen from '../../../assets/images/fitbit-open.png';
import './_apple-onboarding-connect.scoped.scss';
import ConfirmationDialog from 'components/ConfirmationDialog';
import CloseIcon from 'components/icons/CloseIcon';
import { routes } from 'routes';
import { TabNames } from './lib/apple-onboarding-interface';
import AppleOnboardingLogoutButton from './component/AppleOnboardingLogoutButton';

export default function AppleOnboardingOpenPage() {
  const navigate = useNavigate();
  const [needHelpModal, setNeedHelpModal] = useState(false);

  return (
    <div>
      <section className="text-gray-700 mt-4 lg:mt-16">
        <div className="md:flex justify-center gap-10 2xl:gap-24">
          <div className="w-32 md:w-28 lg:w-56 mx-auto lg:mx-0 md:pb-6">
            <img
              src={FitbitOpen}
              alt="fitbit_open"
            />
          </div>

          <div className="border-r border-gray-200"></div>
          <div className="lg:mt-6">
            <div className="md:py-5 lg:w-1/2 ">
              <div className=" mb-10">
                <div className=" text-width lg:pl-4 lg:pb-8 text-center md:text-left mt-5 md:mt-0 px-5 md:px-2 lg:px-0">
                  <h2 className="text-gray-900 text-smd mb-3 font-light leading-relaxed text-size">
                    Open
                    <span className="font-bold"> Pretaa Health </span>App in
                    your watch
                  </h2>
                </div>
                <div className="flex justify-center md:block pb-3 md:pl-2">
                  <button
                    className="font-medium text-xss text-black pb-5 mt-4 underline lg:pl-4 lg:mb-8 hidden"
                    onClick={() => setNeedHelpModal(true)}>
                    Need Help?
                  </button>

                  <button
                    onClick={() =>
                      navigate(
                        routes.appleOnboarding.connect.build(
                          TabNames.ENTER_OTP
                        )
                      )
                    }
                    className="btn hover:border-yellow-800 ml-4
    hover:bg-yellow-800 hover:text-black  px-6 md:px-20 lg:px-28 h-11">
                    Continue{' '}
                  </button>
                </div>
                <AppleOnboardingLogoutButton className='ml-2 px-16'/>
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
          There are many variations of passages of Lorem Ipsum available, but
          the majority have suffered alteration in some form, by injected
          humour, or randomised words which don't look even slightly believable.
          If you are going to use a passage of Lorem Ipsum, you need to be sure
          there isn't anything embarrassing hidden in the middle of text. All
          the Lorem Ipsum generators on the Internet tend to repeat predefined
          chunks as necessary, making this the first true generator on the
          Internet.
        </div>
      </ConfirmationDialog>
    </div>
  );
}
