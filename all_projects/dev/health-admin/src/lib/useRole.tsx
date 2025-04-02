import { UserTypeRole } from 'health-generatedTypes';
import { useAppSelector } from './store/app-store';
import { useEffect, useState } from 'react';


export default function useRole({ roles }: { roles: UserTypeRole[] }) {
  const user = useAppSelector(state => state.auth.user);
  

  const [isMatched, setIsMatched] = useState(false);

  useEffect(() => {
    if (user?.pretaaHealthCurrentUser.id) {
      const rolesSlug = user?.pretaaHealthCurrentUser.userRoles?.map(e => e.roleSlug);
      let isMatch = false;

      roles.forEach(e => {
        if (!isMatch) {
          isMatch = rolesSlug?.includes(e) || false;
        }
      });

      setIsMatched(isMatch);
    }
  // 
  }, [roles, user?.pretaaHealthCurrentUser.id]);

  return isMatched;
}
