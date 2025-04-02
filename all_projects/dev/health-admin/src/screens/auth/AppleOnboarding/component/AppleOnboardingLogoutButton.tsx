import { Link } from 'react-router-dom';

import { routes } from 'routes';
import Button from 'components/ui/button/Button';
import { config } from 'config';
import { useAppSelector } from 'lib/store/app-store';

export default function AppleOnboardingLogoutButton({
  className
}: {
  className?: string
}) {
  const pretaaAdmin = useAppSelector((state) => state.auth.pretaaAdmin);
  const currentUser = useAppSelector((state) => state.auth.user);
  return (
    <div>
      {currentUser?.pretaaHealthCurrentUser && (
        <div className="flex md:block justify-center md:justify-start pb-5">
          <Link
            to={routes.logout.buildUrl({
              userType: pretaaAdmin ? config.roles.owner : '',
            })}>
            <Button
              className="ml-2 md:ml-4 text-xsmd"
              buttonStyle="no-outline">
              <span className={`${className ? className : 'px-20'}`}>Logout </span>
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
