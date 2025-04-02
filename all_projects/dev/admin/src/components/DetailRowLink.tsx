import { Link } from 'react-router-dom';
import { DisclosureIcon } from './icons/DisclosureIcon';

export function DetailRowLink({
  label,
  link,
}: {
  label: string;
  link: string;
}): JSX.Element {
  return (
    <Link className="block border-b p-4 last:border-0" to={link}>
      <div className="flex items-center justify-between">
        <span className="text-primary">{label}</span>
        <DisclosureIcon />
      </div>
    </Link>
  );
}
