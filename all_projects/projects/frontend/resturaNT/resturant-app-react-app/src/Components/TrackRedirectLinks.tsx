import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Toast from '../Lib/Helper/toast';
import { helperSliceActions } from '../Lib/Store/Helper/Helper.Slice';
import { useAppSelector } from '../Lib/Store/hooks';
export default function TrackRedirectLinks() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const redirectLink = useAppSelector((state) => state.helper.redirectUrl);
  const toastMessage = useAppSelector((state) => state.helper.toastMessage);

  useEffect(() => {
    if (redirectLink) {
      navigate(redirectLink);
      dispatch(helperSliceActions.setRedirectUrl(null));
    }

    if (toastMessage.message !== null) {
      Toast(toastMessage.message, toastMessage.success);
      dispatch(helperSliceActions.setToastMessage({ message: null, success: false }));
    }
  }, [redirectLink, toastMessage, navigate, dispatch]);

  return (
    <>
    </>
  );
}

