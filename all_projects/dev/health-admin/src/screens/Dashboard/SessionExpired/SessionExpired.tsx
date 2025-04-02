import { client } from 'apiClient';
import LoginHeader from 'components/LoginHeader';
import useQueryParams from 'lib/use-queryparams';
import React, { useEffect } from 'react';
import { routes } from 'routes';

export default function SessionExpired() {
  const { type }: { type?: string } = useQueryParams();
  useEffect(() => {
    client.stop();
    client.resetStore();
    // 
  }, []);

  return (
    <div className="bg-gray-50 h-screen ">
      <LoginHeader className=" h-1/2 md:h-1/2" />

      <p className="text-center mt-5">
        Your session has expired. Please{' '}
        <a href={`${type ? routes.owner.login.match : routes.login.match}`} className="link">
          Login
        </a>{' '}
        again
      </p>
    </div>
  );
}
