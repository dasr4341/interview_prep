import { ContentFrame } from 'components/content-frame/ContentFrame';
import Button from 'components/ui/button/Button';
import { getRedirectUrl } from 'lib/api/users';
import { useAppSelector } from 'lib/store/app-store';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { routes } from 'routes';

export default function NotFoundScreen() {
  const [currentUrl, setCurrentUrl] = useState<string>('');
  const user = useAppSelector(state => state.auth.user);


  useEffect(() => {
    console.log({ user });
    if (user?.pretaaHealthCurrentUser.id) {
      const url = getRedirectUrl(user);
      setCurrentUrl(url);
    }
  }, [user?.pretaaHealthCurrentUser.id]);

  return (
    <div>
      <ContentFrame className='bg-white'>
        <h1 className="text-5xl text-center" style={{ fontSize: '30px' }}>Not Found</h1>
        
        <div className='flex justify-center mt-10'>
          {user?.pretaaHealthCurrentUser.id && (
            <Link to={currentUrl}>
              <Button>
                View Dashboard
              </Button>  
            </Link>
          )}
          {!user && (
            <Link to={routes.login.match}>
              <Button>
                View Dashboard
              </Button>  
            </Link>
          )}
        </div>
      </ContentFrame>
    </div>
  );
}
