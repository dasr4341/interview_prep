import classNames from 'classnames';
import { Link, matchPath, useLocation } from 'react-router-dom';

export function NavLink({
  route,
  label
}: {
  route: string;
  label: string;
}): JSX.Element {
  const location = useLocation();
  const match = matchPath(location.pathname, route);
  console.log({ match, route, path: location.pathname });
  return (
    <Link
      to={route}
      className={classNames('font-bold', {
        'bg-white': match,
        'text-black': match,
      })}>
      {label}
    </Link>
  );
}
