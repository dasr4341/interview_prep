import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { helperSliceActions } from '../Lib/Store/Helper/Helper.Slice';
import { useAppSelector } from '../Lib/Store/hooks';

export default function TrackRedirectLinks() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const redirectLink = useAppSelector((state) => state.helper.redirectUrl);

  useEffect(() => {
    if (redirectLink) {
      navigate(redirectLink);
      dispatch(helperSliceActions.setRedirectUrl(null));
    }
  }, [redirectLink, navigate, dispatch]);

  return (
    <div></div>
  );
}
