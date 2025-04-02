import { useParams } from 'react-router-dom';
import React, { useMemo, useState } from 'react';

import { ContentHeader } from 'components/ContentHeader';
import { ContentFrame } from 'components/content-frame/ContentFrame';
import NoDataFound from 'components/NoDataFound';
import { useLazyQuery } from '@apollo/client';
import {
  PatientDetails,
  PatientDetailsVariables,
  PatientDetails_pretaaHealthPatientDetails,
} from 'health-generatedTypes';
import { patientDetailsQuery } from 'graphql/patientDetails.query';
import PatientContactSkeletonLoading from './skeletonLoading/PatientContactSkeletonLoading';
import { fullNameController } from 'components/fullName';
import SearchField from 'components/SearchField';
import { PatientContactsRow } from './PatientContactsRow';
import { ContactTypesForContact, CustomContactListDataFace } from 'interface/contact.interface';
import { useAppSelector } from 'lib/store/app-store';

export default function PatientContactList() {
  const { id } = useParams();
  const [patientDetailsState, setPatientDetailsState] = useState<PatientDetails_pretaaHealthPatientDetails | null>(
    null,
  );
  const [copyOfPatientDetails, setCopyOfPatientDetails] = useState<CustomContactListDataFace[]>();
  const [patientContactListsData, setPatientContactListsData] = useState<CustomContactListDataFace[]>();
  const careTeamTypesLabel = useAppSelector((state) => state.app.careTeamTypesLabel).formattedData;

  // get patient detail
  const [getPatientDetail, { loading: patientDetailLoading, data: listData }] = useLazyQuery<
    PatientDetails,
    PatientDetailsVariables
  >(patientDetailsQuery, {
    onCompleted: (data) => {
      if (data.pretaaHealthPatientDetails) {
        setPatientDetailsState(data.pretaaHealthPatientDetails);
      }

      const contactList = data?.pretaaHealthPatientDetails?.patientContactList ?? ({} as any);
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
      setCopyOfPatientDetails(list);
    },
  });

  const onSearchPatientContact = (value: string) => {
    const searchList = patientContactListsData?.filter((item) => {
      const name = (item.fullName ? item.fullName : `${item.firstName} ${item.lastName}`).toLowerCase();
      return name.includes(value?.toLowerCase());
    });

    setCopyOfPatientDetails(searchList);
  };

  // useEffect(() => {
  //   getPatientDetail({
  //     variables: {
  //       patientId: String(id),
  //     },
  //   });
  // }, [copyOfPatientDetails]);

  useMemo(() => {
    getPatientDetail({
      variables: {
        patientId: String(id),
      },
    });
  }, [id]);

  return (
    <>
      <ContentHeader
        titleLoading={patientDetailLoading}
        title={
          patientDetailsState &&
          `${fullNameController(patientDetailsState?.firstName, patientDetailsState?.lastName)}'s Contacts`
        }
        className="lg:sticky">
        <div className="flex">
          <SearchField
            defaultValue=""
            onChange={onSearchPatientContact}
          />
        </div>
      </ContentHeader>
      <ContentFrame>
        {patientDetailLoading &&
          new Array(4).fill(<PatientContactSkeletonLoading />).map((el) => <div key={el}>{el}</div>)}

        {!patientDetailLoading &&
          !(
            listData?.pretaaHealthPatientDetails.patientContactList?.careTeams?.length ||
            listData?.pretaaHealthPatientDetails.patientContactList?.patientContacts?.length ||
            listData?.pretaaHealthPatientDetails.patientContactList?.suppoters?.length
          ) && (
            <div className={'flex justify-center items-center min-h-80 '}>
              <NoDataFound
                type="NODATA"
                heading="No Data Found!"
              />
            </div>
          )}
        {!patientDetailLoading && !copyOfPatientDetails?.length && (
          <div className={'flex justify-center items-center min-h-80 '}>
            <NoDataFound
              type="SEARCH"
              heading="No results"
              content="Refine your search and try again"
            />
          </div>
        )}

        {!!copyOfPatientDetails?.length && (
          <>
            {copyOfPatientDetails.some((e) => e.contactType === ContactTypesForContact.SUPPORTER) ? (
              <div className="section-heading text-base text-pt-primary py-4">Friends & Family</div>
            ) : (
              ''
            )}

            {copyOfPatientDetails
              .filter((data) => data.contactType === ContactTypesForContact.SUPPORTER)
              .map((data) => {
                return (
                  <PatientContactsRow
                    key={data.id}
                    contact={data}
                  />
                );
              })}

            {copyOfPatientDetails.some((e) => e.contactType === ContactTypesForContact.PATIENT_CONTACT) ? (
              <div className="section-heading text-base text-pt-primary py-4">Personal Contact</div>
            ) : (
              ''
            )}

            {copyOfPatientDetails
              .filter((data) => data.contactType === ContactTypesForContact.PATIENT_CONTACT)
              .map((data) => {
                return (
                  <PatientContactsRow
                    key={data.id}
                    contact={data}
                  />
                );
              })}

            {copyOfPatientDetails.some((e) => e.contactType === ContactTypesForContact.CARE_TEAM) ? (
              <div className="section-heading text-base text-pt-primary py-4">Care Team</div>
            ) : (
              ''
            )}

            {copyOfPatientDetails
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
      </ContentFrame>
    </>
  );
}
