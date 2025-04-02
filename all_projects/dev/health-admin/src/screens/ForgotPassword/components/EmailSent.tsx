import React from 'react';
import CircledEmail from 'assets/images/email-icon-circle.svg';
import Button from 'components/ui/button/Button';
import { useLocation, useNavigate } from 'react-router-dom';
import { routes } from 'routes';
import '../_forget-passwordPage.scoped.scss';
import Footer from './Footer';

export default function EmailSent({ showForgetPasswordForm }: { showForgetPasswordForm: () => void }) {
  const location = useLocation();
  const navigate = useNavigate();

  const routePath = () => {
    if (location.pathname.includes(routes.adminForgetPassword.match)) {
      navigate(routes.owner.login.match);
    } else {
      navigate(routes.login.match);
    }
  };

  return (
    <>
      <div className="bg-gray-50 py-20 flex justify-center items-center ">
        <div className="flex flex-col items-center">
          <img src={CircledEmail} alt="email" width="152" height="152" />
          <h3
            className="email-sent-header font-medium text-gray-150
                mb-3 mt-6 xxl:mt-12 xxl:mb-20 text-center">
            Email has been sent!
          </h3>
          <p className="email-sent-sub-header font-normal text-gray-150 mb-5 text-center">
            You will receive an email in your inbox <br /> if the email id exists in our records.
          </p>
          <Button classes={['w-full mt-6']} onClick={() => routePath()}>
            Sign In
          </Button>
        </div>
      </div>
      <Footer>
        <div className="flex flex-col px-8 items-center md:items-start">
          <div className="email-sent-sub-header font-normal text-gray-150 ">Didn’t receive the link?</div>
          <div className="email-resend-button mt-2 cursor-pointer" onClick={() => showForgetPasswordForm()}>
            Resend
          </div>
        </div>
      </Footer>
    </>
  );
}
