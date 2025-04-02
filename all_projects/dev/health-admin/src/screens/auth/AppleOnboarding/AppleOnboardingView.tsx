/*  */
import React, { useEffect, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

import FitbitOnboardingHeader from '../FitbitOnboarding/components/FitbitOnboardingHeader';
import { Tab, TabNames } from './lib/apple-onboarding-interface';
import { DisclosureIcon } from 'components/icons/DisclosureIcon';
import { routes } from 'routes';
import './_apple-onboarding-connect.scoped.scss';

export default function AppleOnboardingView() {
  const location = useLocation();
  const [visitedTabs, setVisitedTabs] = useState<string[]>([]);

  const [tabs] = useState<Tab[]>([
    { label: TabNames.CONNECT, count: 1, routes: routes.appleOnboarding.connect.build(TabNames.CONNECT) },
    { label: TabNames.INSTALL, count: 2, routes: routes.appleOnboarding.connect.build(TabNames.INSTALL) },
    { label: TabNames.OPEN, count: 3, routes: routes.appleOnboarding.connect.build(TabNames.OPEN) },
    { label: 'Enter OTP', count: 4, routes: routes.appleOnboarding.connect.build(TabNames.ENTER_OTP) },
    { label: TabNames.CONFIRMATION, count: 5, routes: routes.appleOnboarding.connect.build(TabNames.CONFIRMATION) },
  ]);

  useEffect(() => {
    if (location.pathname.includes(routes.appleOnboarding.connect.build(TabNames.CONNECT))) {
      setVisitedTabs([TabNames.CONNECT]);
    } else if (location.pathname.includes(routes.appleOnboarding.connect.build(TabNames.INSTALL))) {
      setVisitedTabs([TabNames.CONNECT, TabNames.INSTALL]);
    } else if (location.pathname.includes(routes.appleOnboarding.connect.build(TabNames.OPEN))) {
      setVisitedTabs([TabNames.CONNECT, TabNames.INSTALL, TabNames.OPEN]);
    } else if (location.pathname.includes(routes.appleOnboarding.connect.build(TabNames.ENTER_OTP))) {
      setVisitedTabs([TabNames.CONNECT, TabNames.INSTALL, TabNames.OPEN, TabNames.ENTER_OTP]);
    } else if (location.pathname.includes(routes.appleOnboarding.connect.build(TabNames.CONFIRMATION))) {
      setVisitedTabs([TabNames.CONNECT, TabNames.INSTALL, TabNames.OPEN, TabNames.ENTER_OTP, TabNames.CONFIRMATION]);
    }
  }, [location.pathname]);

  return (
    <div className="h-screen bg-white">
      <FitbitOnboardingHeader>
        <div>Better Connections.</div>
        <div className="pt-3">Better Outcomes. </div>
      </FitbitOnboardingHeader>
      <div className="overflow-auto flex mx-4 flex-row header-content whitespace-nowrap ">
        <div className=" mt-6 lg:mt-14 text-center items-center space-x-2 md:space-x-3 lg:space-x-7 flex justify-center">
          {tabs.map((el, index) => {
            return (
              <>
                <div className={`flex items-center space-x-2 py-4  ${visitedTabs && ' border-primary-light'} `}>
                  <div
                    className={`rounded-full h-4 md:h-7 w-4  md:w-7 md:text-xsm text-xss  flex justify-center items-center
                  ${visitedTabs[index] ? ' bg-primary-light text-white' : 'bg-gray-200 text-black'} `}>
                    {el.count}
                  </div>
                  <Link
                    to={el.routes}>
                    <div
                      className={` md:text-xsm text-xss     ${
                        visitedTabs[index] ? 'text-pt-primary' : 'text-gray-700'
                      }  `}>
                      {el.label}
                    </div>
                  </Link>
                </div>
                <div className=''>
                  <DisclosureIcon
                    className={` ${index === 4 && 'hidden'} ${visitedTabs[index] ? 'text-pt-primary' : 'text-gray-400'} h-3 w-3 md:h-4 md:w-4`}
                  />
                </div>
              </>
            );
          })}
        </div>
      </div>
      <Outlet />
    </div>
  );
}
