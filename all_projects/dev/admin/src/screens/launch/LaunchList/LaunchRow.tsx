import { Link, useLocation } from 'react-router-dom';
import DateFormat from 'components/DateFormat';
import { routes } from 'routes';
import SanitizeContent from 'components/SanitizeContent';

export default function LaunchRow({ launch }: { launch: any }): JSX.Element {
  const { pathname } = useLocation();

  return (
    <div
      className="bg-white flex gap-4 items-center
       px-5 py-7 border-b border-gray-100">
      <div className="flex-1">
        <Link
          to={`${
            pathname.includes('events')
              ? routes.launchedEventDetail.build(String(launch?.id))
              : routes.launchedDetail.build(String(launch?.id))
          }`}>
          <h3 className="capitalize text-base text-primary font-bold mb-1">{launch.subject}</h3>
          <div className="text-gray-600 line-clamp-3" >
            <SanitizeContent html={launch.text} />
          </div>
        </Link>
      </div>
      <span className="text-sm text-gray-600">
        <DateFormat date={launch.createdAt} />
      </span>
    </div>
  );
}
