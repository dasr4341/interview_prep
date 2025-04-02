import React from 'react';
import LoginHeader from 'components/LoginHeader';
import { useNavigate } from 'react-router-dom';
import { routes } from 'routes';

export default function SupporterCancelPayment() {
  const navigate = useNavigate();
  const sessionId = new URL(window.location.toString()).searchParams.get('session_id');
  console.log('sessionId ->>', sessionId);
  return (
    <div className="h-custom ">
      <LoginHeader className=" h-1/2 md:h-1/2" title="Payment cancelled" />
      <div className="flex flex-col max-w-sm md:w-2/6 mx-auto py-12 w-4/5">
        <div className=" text-sm font-light text-justify">
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quae dignissimos voluptatum quod ducimus! Id doloremque omnis rem
          aliquam accusamus cupiditate, molestiae error voluptate sit, ex earum fuga neque ipsam. Eum beatae itaque neque, mollitia deleniti
          distinctio veniam at laudantium dolorem?
        </div>
        <button
          className=" bg-pt-yellow-500 py-2 px-4 w-full mt-8 text-sm md:text-base font-medium rounded-lg"
          onClick={() => navigate(routes.logout.match)}>
          Go to login
        </button>
      </div>
    </div>
  );
}
