import { ContentFrame } from 'components/content-frame/ContentFrame';
import { ContentHeader } from 'components/ContentHeader';
import Button from 'components/ui/button/Button';
import { getRedirectUrl } from 'lib/api/users';
import { useAppSelector } from 'lib/store/app-store';
import { useNavigate } from 'react-router-dom';

export default function UnreachableScreen() {
  const navigate = useNavigate();
  const user = useAppSelector(state => state.auth.user);
  
  function redirect() {
    if (user){
      navigate(getRedirectUrl(user));
    } else {
      navigate(-1);
    }
  }

  return (
    <div className='text-center vh-full'>
      <ContentHeader title="Unreachable" breadcrumb={false} disableGoBack={true}></ContentHeader>
      <ContentFrame className=''>
        <h1 className="text-2xl mb-10">Could not connect with Pretaa Health API. Please try again later.</h1>
        <Button className='m-auto' onClick={() => redirect()}>Retry</Button>
      </ContentFrame>
    </div>
  );
}
