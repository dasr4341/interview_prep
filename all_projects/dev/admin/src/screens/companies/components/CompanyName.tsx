import { DisclosureIcon } from 'components/icons/DisclosureIcon';
import Star from 'components/icons/Star';
import { UserPermissionNames } from 'generatedTypes';
import companyApi from 'lib/api/company';
import usePermission from 'lib/use-permission';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { routes } from 'routes';

export default function CompanyName({
  id,
  name,
  starred,
  className,
  isLinked,
  isOnClickStar,
  testId
}: {
  id: string;
  name: string;
  starred: boolean;
  className?: string;
  isLinked?: boolean;
  isOnClickStar?: boolean;
  testId?: string;
}) {
  const route = routes.companyDetail.build(String(id));
  const [isStarred, setIsStarred] = useState(starred);
  isLinked = typeof isLinked === 'undefined' ? true : isLinked;
  isOnClickStar = typeof isOnClickStar === 'undefined' ? false : isOnClickStar;
  const companyPermission = usePermission(UserPermissionNames.COMPANIES);

  const onToggle = async () => {
    if (isOnClickStar && companyPermission?.capabilities.EDIT ) {
      const { companyToggleStar } = await companyApi().toggleStar(String(id));
      if (companyToggleStar === 'starred') {
        setIsStarred(true);
      } else if (companyToggleStar === 'deleted') {
        setIsStarred(false);
      }
    }
  };

  return (
    <div className={`flex items-center ${className}`} data-test-id={testId} data-test-name="company-id" data-test-company-id={id}>
      <Link
        data-test-id="company-list-link"
        to={route}
        className={`flex-1 font-bold text-primary
      ${isLinked ? 'cursor-pointer' : 'cursor-default'}`}>
        {name}
      </Link>
      <div className="flex flex-row items-center">
        {companyPermission?.capabilities.EDIT && (
        <button
          className={`mr-4  ${isOnClickStar && companyPermission?.capabilities.EDIT ? 'cursor-pointer' : 'cursor-default'}`}
          onClick={onToggle}>
          {isStarred ? (
            <Star filled={true} className="w-5 h-5 text-yellow" />
          ) : (
            <Star filled={false} className="w-5 h-5 text-gray-400" />
          )}
        </button>
        )}
        {isLinked && (
          <Link to={route} className="cursor-pointer">
            <DisclosureIcon />
          </Link>
        )}
      </div>
    </div>
  );
}
