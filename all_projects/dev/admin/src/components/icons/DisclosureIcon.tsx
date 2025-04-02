import { FaChevronRight } from 'react-icons/fa';

export function DisclosureIcon({ className }: 
  { className? : string }): JSX.Element {
  return <FaChevronRight className={`text-sm text-gray-400 ${className}`} />;
}
