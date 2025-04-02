import { DisclosureIcon } from './icons/DisclosureIcon';
import { LabeledValue } from './LabeledValue';
import { Contact } from 'fakeData';

export function ContactRolesRow({ contact }:
  { contact: Contact }): JSX.Element {
  return (
    <div
      className={`bg-white 
      flex flex-col lg:flex-row gap-7 lg:items-center 
      items-start
      p-6 border-b last:border-b-0 last:rounded-b-xl
      first:rounded-t-xl`}
      key={contact.id}>

      <img
        alt="avatar"
        src={contact.avatarURL}
        className="w-16 h-16 border rounded-full border-border-dark"
      />
      <div className="flex-1">
        <label className="block font-bold text-primary">{contact.name}</label>
        <span className="text-gray-600 font-semibold uppercase text-xs">
          Direct Report
        </span>
      </div>
      <div className="w-1/4">
        <LabeledValue label="Email">
          {contact.email}
        </LabeledValue>
      </div>
      <div className="lg:w-1/4 w-full">
        <LabeledValue label="Mobile">
          {contact.telephone}
        </LabeledValue>
      </div>
      <span className="cursor-pointer hidden lg:block">
        <DisclosureIcon />
      </span>
    </div>
  );
}
