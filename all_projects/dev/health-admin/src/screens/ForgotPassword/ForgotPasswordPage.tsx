
/*  */
import { useState } from 'react';
import './_forget-passwordPage.scoped.scss';
import ForgetPasswordHeader from './components/ForgetPasswordHeader';
import ForgetPasswordForm from './components/ForgetPasswordForm';
import EmailSent from './components/EmailSent';

export function ForgetPasswordPage() {
  const [forgetPasswordProcessState, setForgetPasswordProcessState] = useState(true);

  return (
    <div className="bg-gray-50 h-screen">
      <ForgetPasswordHeader className=" h-1/2 md:h-2/5" />
      {forgetPasswordProcessState && <ForgetPasswordForm onSuccessFormSubmit={() => setForgetPasswordProcessState(false)} />}
      {!forgetPasswordProcessState && <EmailSent showForgetPasswordForm={() => setForgetPasswordProcessState(true) } />}
    </div>
  );
}
