
import React, { useEffect, useRef } from 'react';
import OktaSignIn from '@okta/okta-signin-widget';
import '@okta/okta-signin-widget/dist/css/okta-sign-in.min.css';
import { Tokens } from '@okta/okta-auth-js';

export default function OktaLoginWidget({
  email,
  onSuccess,
  onError,
  settings,
}: {
  email: string;
  onSuccess: (tokens: Tokens) => void;
  onError: (error: string) => void;
  settings: any;
}): JSX.Element {
  const widgetRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!widgetRef.current) {
      return;
    }

    const widget = new OktaSignIn(settings);

    widget.showSignInToGetTokens({
      el: widgetRef.current,
    }).then(onSuccess).catch(onError);

    if (email) {
      setTimeout(() => {
        if (!widgetRef.current) {
          return;
        }

        console.log({ email });
        const input = widgetRef.current
          .querySelector<HTMLInputElement>('#okta-signin-username');
        
        console.log({ input });
        if (input) {
          console.log({ email });
          input.setAttribute('value', email);
          input.dispatchEvent(new KeyboardEvent('keydown'));
        }
      }, 100);

    }

    return () => widget.remove();
  }, [onSuccess, onError, email, settings]);

  return (
    <div className="bg-gray-50 text-center h-screen">
      <div
        className="bg-primary-light w-100 h-1/2 flex 
        justify-center items-end px-4 pb-8 md:pb-14 xl:pb-24">
        <img
          src="./pretaa-logo.png"
          alt="logo"
          width="346"
          height="105"
          className="inline-block object-contain"
        />
      </div>
      <div className="bg-gray-50 pt-6 md:pt-12 pb-4 ">
        <div ref={widgetRef} />
      </div>
    </div>
  );
}
