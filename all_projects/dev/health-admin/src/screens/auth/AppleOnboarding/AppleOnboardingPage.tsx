import React from 'react';
import { useLocation } from 'react-router-dom';

import { TabNames } from './lib/apple-onboarding-interface';
import AppleWatchConnector from './AppleWatchConnector';
import AppleOnboardingConnectPage from './AppleOnboardingConnectPage';
import AppleOnboardingInstallPage from './AppleOnboardingInstallPage';
import AppleOnboardingOpenPage from './AppleOnboardingOpenPage';
import AppleOnboardingConfirmationPage from './AppleOnboardingConfirmationPage';

export default function AppleOnboardingPage() {
  const location = useLocation();
  
  return (
    <div className=" bg-white">
      {/* step 1 */}
      {location.pathname.includes(TabNames.CONNECT) && (
        <AppleOnboardingConnectPage />
      )}
      {/* step 1 end */}

      {/* step 2 */}
      {location.pathname.includes(TabNames.INSTALL) && (
        <AppleOnboardingInstallPage />
      )}

      {/* step 2 end */}

      {/* step 3 */}
      {location.pathname.includes(TabNames.OPEN) && (
        <AppleOnboardingOpenPage />
      )}

      {/* step 3 end */}

      {/* step 4 */}
      {location.pathname.includes(TabNames.ENTER_OTP) && (
        <AppleWatchConnector />
      )}

      {/* step 4 end */}

       {/* step 5 */}
       {location.pathname.includes(TabNames.CONFIRMATION) && (
        <AppleOnboardingConfirmationPage />
      )}

      {/* step 5 end */}
    </div>
  );
}
