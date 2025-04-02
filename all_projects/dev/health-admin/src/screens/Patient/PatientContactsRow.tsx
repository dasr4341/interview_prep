import { Avatar } from '@mantine/core';
import React, { useContext } from 'react';
import { stringFullNameAvatar } from '../../lib/get-name-intials';
import { fullNameController } from 'components/fullName';
import Popover, { PopOverItem } from 'components/Popover';
import { BsThreeDots } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import { routes } from 'routes';
import { ContactTypesForContact, CustomContactListDataFace } from 'interface/contact.interface';
import { PretaaContactContext } from 'screens/PretaaContacts/PretaaContactContext';
import { GetAllCareTeamType_pretaaHealthGetAllCareTeamType, UserPermissionNames, UserTypeRole } from 'health-generatedTypes';
import useSelectedRole from 'lib/useSelectedRole';
import useGetPrivilege, { CapabilitiesType } from 'lib/getPrivilege';

export function PatientContactsRow({ contact, customCareTypeLabels }: { contact: CustomContactListDataFace, customCareTypeLabels?: { [key:string]: GetAllCareTeamType_pretaaHealthGetAllCareTeamType} }) {
  const isPatient = useSelectedRole({ roles: [UserTypeRole.PATIENT] });
  const canEdit = useGetPrivilege(UserPermissionNames.CONTACTS, CapabilitiesType.EDIT);


  const navigate = useNavigate();
  const { setDeleteContactId, setContactType } = useContext(PretaaContactContext);

  function contactNameHelper(type?: 'avatar') {
    if (contact.firstName) {
      return fullNameController(contact.firstName, contact.lastName);
    }

    if (contact.fullName) {
      return contact.fullName;
    }

    if (type === 'avatar') {
      return null;
    }

    return contact.email || 'NA';
  }

  function redirectToContactDetails() {
    if (location.pathname.includes('patient')) {
      navigate(
        routes.patientContact.details.build(
          'na',
          contact.contactType,
          contact.id
        )
      );
    } else if (location.pathname.includes('events')) {
      navigate(
        routes.eventContactDetails.build(
          'na',
          contact.contactType,
          contact.id
        )
      );
    } else {
      navigate(
        routes.profileContactDetails.build(
          contact.contactType,
          contact.id
        )
      );
    }
  }

  const customStyles = {
    placeholder: {
      backgroundColor: '#D8D8D8',
      color: '#515151',
      fontSize: '18px',
      fontWeight: 400,
      letterSpacing: '1px',
    }
  };

  return (
    <React.Fragment>
      <div
        className="flex flex-row bg-white w-full px-4 py-6 text-base justify-between items-center first:rounded-t-xl
        last:rounded-b-xl border-gray-100 border-b last:border-b-0"
        key={contact.id}>
        <div className="flex flex-row w-full items-center">
            {contactNameHelper('avatar') && (
              <div className="flex-none w-20">
                <Avatar radius="xl" {...stringFullNameAvatar(contactNameHelper())} 
                styles={customStyles} />
              </div>
            )}
        
            <div className="flex flex-col md:gap-0 gap-1">
              <span className="text-pt-primary font-bold flex">
                <div className="grow">
                  <h2 className="text-base">{contactNameHelper()}</h2>
                  {contact?.relationship && (
                    <span className="text-sm font-semibold text-gray-650">
                      {contact.relationship.replaceAll('_', ' ')}
                    </span>
                  )}
                </div>
              </span>
            </div>
            {customCareTypeLabels && contact.contactType === ContactTypesForContact.CARE_TEAM && contact.careTeamTypes && (
            <div className="rounded-full bg-primary-light ml-2 px-2 py-1 text-xss text-white capitalize">
              {customCareTypeLabels[contact.careTeamTypes]?.updatedValue || customCareTypeLabels[contact.careTeamTypes]?.defaultValue}
            </div>
          )}
        </div>

        <div className="pl-4 border-l border-gray-500 h-5">
          <Popover
            trigger={
              <button
                data-test-id="share-or-assign"
                className="text-gray-600">
                <BsThreeDots />
              </button>
            }>
            <React.Fragment>
              <PopOverItem
                onClick={redirectToContactDetails}>
                View
              </PopOverItem>
              {(canEdit && contact.contactType !== ContactTypesForContact.CARE_TEAM) && (
                <PopOverItem
                  onClick={() =>
                    navigate(
                      routes.profileContactFormEdit.build(String(contact.id))
                    )
                  }>
                  Edit
                </PopOverItem>
              )}
              {isPatient && (contact.canDelete || contact.canDeleteSupporter) && (
                  <PopOverItem
                    onClick={() => {
                      setDeleteContactId(contact.id);
                      setContactType(contact.contactType as string);
                    }}>
                    Delete
                  </PopOverItem>
                )}
            </React.Fragment>
          </Popover>
        </div>
      </div>
    </React.Fragment>
  );
}
