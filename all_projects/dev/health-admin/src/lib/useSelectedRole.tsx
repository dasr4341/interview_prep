import { UserTypeRole } from 'health-generatedTypes';
import { useAppSelector } from './store/app-store';
import { useEffect, useState } from 'react';

export default function useSelectedRole({ roles }: { roles: UserTypeRole[] }) {
  const selectedRole = useAppSelector(state => state.auth.selectedRole);
  const [isCurrentUser, setIsCurrentUser] = useState(false);


  

  useEffect(() => {
    if (selectedRole) {
      setIsCurrentUser(roles.includes(selectedRole as UserTypeRole));
    }
  }, [roles, selectedRole]);

  return isCurrentUser;
}
