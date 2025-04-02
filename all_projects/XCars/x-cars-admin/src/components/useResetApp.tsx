import { routes } from '@/config/routes';
import { client } from '@/lib/apolloClient';
import { appSliceActions } from '@/store/app/app.slice';
import { useAppDispatch } from '@/store/hooks';
import { resetCookie } from './Forms/login/setCookie';
import { config } from '@/config/config';
import { useRouter } from 'next/navigation';
import { message } from '@/config/message';
import { toast } from 'react-toastify';

export default function useResetApp() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const logout = () => {
    client.stop();
    console.log('resetState app !!!!');
    resetCookie('authToken__admin');
    localStorage.removeItem(config.storage.app_data);
    console.log(message.loggedOut);
    toast.success(message.loggedOut);
    dispatch(appSliceActions.setUser(null));
    router.replace(routes.login.path);
  };

  return {
    logout,
  };
}
