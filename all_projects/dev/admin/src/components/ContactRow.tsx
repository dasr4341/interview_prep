import { DisclosureIcon } from './icons/DisclosureIcon';
import { Link } from 'react-router-dom';
import { routes } from 'routes';
import { GetContacts_pretaaFindManyContacts } from 'generatedTypes';
import NameInitials from './ui/nameInitials/NameInitials';
import useQueryParams from '../lib/use-queryparams';

export function ContactRow({ contact }:
  { contact: GetContacts_pretaaFindManyContacts }): JSX.Element {
  const query = useQueryParams();

  return (
    <div className={`bg-white border-gray-300 border-1.5 p-4 border-b last:border-b-0 last:rounded-b-xl
    first:rounded-t-xl`}
      key={contact.id}>
      <Link to={routes.companyContact.build(String(contact.id), {
              opportunityId: query?.opportunityId
            })
      } >
        <div
          className='flex space-x-7 items-center'
          key={contact.id}>

          <NameInitials name={(contact?.firstName + ' ' + contact?.lastName)}
            className="w-16 h-16 border rounded-full border-border-dark" />
          <div className="flex-1">
            <label className="block font-bold text-primary">
              {contact?.firstName + ' ' + contact?.lastName}
            </label>
            {contact?.primary && (
              <span className="text-gray-600 font-semibold uppercase text-xs" data-test-id="primary_contact">
                Primary Contact
              </span>
            )}

          </div>

          <button className="cursor-pointer">
            <DisclosureIcon />
          </button>
        </div>


      </Link>
    </div>
  );
}