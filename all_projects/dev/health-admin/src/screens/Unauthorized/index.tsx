import { ContentFrame } from 'components/content-frame/ContentFrame';
import { ContentHeader } from 'components/ContentHeader';
import Button from 'components/ui/button/Button';
import { getRedirectUrl } from 'lib/api/users';
import { useAppSelector } from 'lib/store/app-store';
import { Link } from 'react-router-dom';
import { routes } from 'routes';

export default function UnAuthorizedScreen() {
  const user = useAppSelector(state => state.auth.user);

  function redirect() {
    const url = getRedirectUrl(user);
    location.href = url;
  }


  return (
    <div>
      <ContentHeader title="Unauthorized"></ContentHeader>
      <ContentFrame className='bg-white'>
        <h1 className="text-5xl text-center" style={{ fontSize: '30px' }}>Unauthorized</h1>
        
        <div className='flex justify-center mt-10'>
          <Button onClick={redirect}>
            View Dashboard
          </Button>  
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
