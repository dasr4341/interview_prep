import { routes } from 'routes';
import { Link } from 'react-router-dom';

import { ContentHeader } from 'components/ContentHeader';
import { ContentFrame } from 'components/content-frame/ContentFrame';
import React, { useContext, useEffect, useState } from 'react';
import ConfirmationDialog from 'components/ConfirmationDialog';
import NoDataFound from 'components/NoDataFound';
import PatientContactSkeletonLoading from 'screens/Patient/skeletonLoading/PatientContactSkeletonLoading';
import Button from 'components/ui/button/Button';
import { useLazyQuery, useMutation } from '@apollo/client';
import { userContacts } from 'graphql/current-user-contacts.query';
import {
  EHRDeletePatientContact,
  EHRDeletePatientContactVariables,
  GetUserContacts,
  PatientSupporterDelete,
  PatientSupporterDeleteVariables,
} from 'health-generatedTypes';
import { ehrDeletePatientContactMutation } from 'graphql/ehrDeletePatientContact.mutation';
import catchError from 'lib/catch-error';
import { toast } from 'react-toastify';
import SearchField from 'components/SearchField';
import { PatientContactsRow } from 'screens/Patient/PatientContactsRow';
import { PretaaContactContext } from './PretaaContactContext';
import { patientSupporterContactDelete } from 'graphql/patientSupporterDelete.mutation';
import { ContactTypesForContact, CustomContactListDataFace } from 'interface/contact.interface';
import { useAppSelector } from 'lib/store/app-store';

export function stringFullNameAvatar(name: string | null) {
  let initials = 'N/A';
  if (name) {
    const nameSplit = name.split(' ').filter((i) => i.length > 0);
    if (nameSplit.length > 1) {
      initials = `${nameSplit[0]?.charAt(0).toUpperCase()}${nameSplit[1]?.charAt(0).toUpperCase()}`;
    } else if (nameSplit.length > 0) {
      initials = `${nameSplit[0]?.charAt(0).toUpperCase()}`;
    }
  }

  return {
    sx: {
      bgcolor: '#D8D8D8',
      color: '#515151',
      fontSize: '18px',
    },
    children: initials,
  };
}

export default function PretaaContacts() {
  // Only update once if Api returns data
  const [patientContactListsData, setPatientContactListsData] = useState<CustomContactListDataFace[]>([]);
  const careTeamTypesLabel = useAppSelector((state) => state.app.careTeamTypesLabel).formattedData;
  // Modify on search and update this state
  const [contactListsData, setContactListsData] = useState<CustomContactListDataFace[]>([]);

  const { deleteContactId, setDeleteContactId, contactType } = useContext(PretaaContactContext);

  const [patientContactListData, { loading }] = useLazyQuery<GetUserContacts>(userContacts, {
    onCompleted: (data) => {
      const contactList = data?.pretaaHealthCurrentUser?.patientContactList ?? ({} as any);
      let list = [];

      list =
        contactList?.suppoters?.map((e) => {
          return {
            ...e,
            contactType: ContactTypesForContact.SUPPORTER,
          };
        }) || [];

      list = list.concat(
        contactList?.careTeams?.map((e) => {
          return {
            ...e,
            contactType: ContactTypesForContact.CARE_TEAM,
          };
        }) || [],
      );

      list = list.concat(
        contactList?.patientContacts?.map((e) => {
          return {
            ...e,
            contactType: ContactTypesForContact.PATIENT_CONTACT,
          };
        }) || [],
      );

      setPatientContactListsData(list);
      setContactListsData(list);
    },
  });

  // to delete patient contact
  const [deletePatientContactCallBack, { loading: deletePatientContactLoading }] = useMutation<
    EHRDeletePatientContact,
    EHRDeletePatientContactVariables
  >(ehrDeletePatientContactMutation, {
    onCompleted: (d) => {
      if (d.pretaaHealthEHRDeletePatientContact) {
        toast.success(d.pretaaHealthEHRDeletePatientContact);
        patientContactListData();
        setPatientContactListsData([]);
      }
      setDeleteContactId('');
    },
    onError: (e) => catchError(e, true),
  });

  // to delete supporter contact
  const [deleteSupporterContactCallBack, { loading: deleteSupporterContactLoading }] = useMutation<
    PatientSupporterDelete,
    PatientSupporterDeleteVariables
  >(patientSupporterContactDelete, {
    onCompleted: (d) => {
      if (d.pretaaHealthPatientSupporterDelete) {
        toast.success(d.pretaaHealthPatientSupporterDelete);

        patientContactListData();
      }
      setDeleteContactId('');
    },
    onError: (e) => catchError(e, true),
  });

  useEffect(() => {
    patientContactListData();
  }, [patientContactListData, setDeleteContactId]);

  const searchPatientContact = (value: string) => {
    const searchList = patientContactListsData.filter((item) => {
      const name = (item.fullName ? item.fullName : `${item.firstName} ${item.lastName}`).toLowerCase();
      return name.includes(value?.toLowerCase());
    });

    setContactListsData(searchList);
  };

  return (
    <React.Fragment>
      <ContentHeader className="lg:sticky">
        <div className="flex justify-between">
          <div>
            <h1 className="h1 text-primary font-bold text-md lg:text-lg mb-5">Pretaa Contacts</h1>
            <SearchField onChange={searchPatientContact} />
          </div>

          <Link to={routes.profileContactFormCreate.match}>
            <Button className="mt-4 md:mt-0">Add personal contact</Button>
          </Link>
        </div>
      </ContentHeader>

      {!loading && !contactListsData?.length && (
        <div className={'flex justify-center items-center min-h-80 '}>
          <NoDataFound
            type="SEARCH"
            heading="No results"
            content="Refine your search and try again"
          />
        </div>
      )}

      <ContentFrame>
        {loading && new Array(4).fill(<PatientContactSkeletonLoading />).map((el, i) => <div key={el}>{el}</div>)}

        {!!contactListsData?.length && !loading && (
          <>
            {contactListsData.some((e) => e.contactType === ContactTypesForContact.SUPPORTER) ? (
              <div className="section-heading text-base text-pt-primary py-4">Friends & Family</div>
            ) : (
              ''
            )}

            {contactListsData
              .filter((data) => data.contactType === ContactTypesForContact.SUPPORTER)
              .map((data) => {
                return (
                  <PatientContactsRow
                    key={data.id}
                    contact={data}
                  />
                );
              })}

            {contactListsData.some((e) => e.contactType === ContactTypesForContact.PATIENT_CONTACT) ? (
              <div className="section-heading text-base text-pt-primary py-4">Personal Contact</div>
            ) : (
              ''
            )}

            {contactListsData
              .filter((data) => data.contactType === ContactTypesForContact.PATIENT_CONTACT)
              .map((data) => {
                return (
                  <PatientContactsRow
                    key={data.id}
                    contact={data}
                  />
                );
              })}

            {contactListsData.some((e) => e.contactType === ContactTypesForContact.CARE_TEAM) ? (
              <div className="section-heading text-base text-pt-primary py-4">Care Team</div>
            ) : (
              ''
            )}

            {contactListsData
              .filter((data) => data.contactType === ContactTypesForContact.CARE_TEAM)
              .map((data) => {
                return (
                  <PatientContactsRow
                    customCareTypeLabels={careTeamTypesLabel}
                    key={`${data.id}${data.careTeamTypes}`}
                    contact={data}
                  />
                );
              })}
          </>
        )}

        <ConfirmationDialog
          loading={deletePatientContactLoading || deleteSupporterContactLoading}
          modalState={Boolean(deleteContactId)}
          disabledBtn={false}
          onConfirm={() => {
            if (contactType === ContactTypesForContact.PATIENT_CONTACT) {
              deletePatientContactCallBack({
                variables: { patientContactId: String(deleteContactId) },
              });
            } else if (contactType === ContactTypesForContact.SUPPORTER) {
              deleteSupporterContactCallBack({
                variables: {
                  supporterId: deleteContactId,
                },
              });
            }
          }}
          onCancel={() => setDeleteContactId('')}
          className="max-w-sm rounded-xl">
          Are you sure you want to delete this contact?
        </ConfirmationDialog>
      </ContentFrame>
    </React.Fragment>
  );
}
