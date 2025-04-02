import { Dispatch, SetStateAction } from 'react';
import { useRouter } from 'next/navigation';
import { client } from '@/lib/apolloClient';
import { appSliceActions } from '@/store/app/app.slice';
import { useAppDispatch } from '@/store/hooks';
import { resetCookie } from '../account/helper/cookie';
import { resetState } from '@/lib/appData';
import { messageGenerators } from '@/config/messages';
import { routes } from '@/config/routes';

const useLogout = (setState?: Dispatch<SetStateAction<boolean>>) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const handleLogout = () => {
    resetState();
    resetCookie();
    dispatch(appSliceActions.setUser(null));
    client.stop();
    setState && setState(false);
    console.log(messageGenerators.successMessage('Logged out'));
    router.replace(routes.home.path);
  };
  return handleLogout;
};

export default useLogout;
