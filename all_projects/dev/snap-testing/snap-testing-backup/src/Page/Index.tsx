import React from 'react';
import LoadingOverLay from '../Components/Loading/LoadingOverLay';

/**
 * It checks if the user is logged in, if so, it sets the redirect url to the user's profile page, if not, it sets the
 * redirect url to the login page
 * This page is only for redirect purposes
 */

export default function Index() {
  return (
    <>
      <LoadingOverLay />
    </>
  );
}
