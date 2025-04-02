import { Link } from 'react-router-dom';
import { routes } from 'routes';

export default function OpportunityHeader({
  id,
  name,
  companyId,
  className,
}: {
  id: string;
  name: string;
  companyId: string;
  className?: string;
}) {
  const route = routes.companyOpportunityDetail.build(companyId, String(id));

  return (
    <div className={`flex items-center ${className}`}>
      <Link to={route} className="flex-1 font-bold text-primary cursor-default">
        {name}
      </Link>
    </div>
  );
}
