import { useIdleTimer } from 'react-idle-timer';
import { routes } from 'routes';
import { useNavigate } from 'react-router-dom';
import { config } from '../config';
import { useAppSelector } from './store/app-store';
import { useEffect } from 'react';

export default function ReactIdleTimer() {
  
  const navigate = useNavigate();
  const userId = useAppSelector(state => state.auth.user?.pretaaHealthCurrentUser.id);

  const onIdle = () => {
    console.log('Idle fired', new Date().toString());
    if (userId) {
      navigate(routes.logout.match);
    }   
  };

  useIdleTimer({
    onIdle,
    timeout: config.idleTimeLimit.timeout,
  });

  useEffect(() => {
    console.log('Idle detection added at', new Date().toString());
  }, []);

  return (
    <>
      
    </>
  );
}
