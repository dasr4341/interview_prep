import { ContentHeader } from 'components/ContentHeader';
import { ContentFrame } from 'components/content-frame/ContentFrame';
import { Avatar, Skeleton } from '@mantine/core';
import { BsEnvelope, BsPencil, BsTelephone } from 'react-icons/bs';
import { useLazyQuery } from '@apollo/client';
import { supporterContactDetailsQuery } from 'graphql/supporterContactDetails.query';
import {
  CareTeamMemberContactDetails,
  CareTeamMemberContactDetailsVariables,
  PatientContactDetails,
  PatientContactDetailsVariables,
  SupporterContactDetails,
  SupporterContactDetailsVariables,
  UserPermissionNames,
} from 'health-generatedTypes';
import { careTeamMemberContactDetailsQuery } from 'graphql/careTeamMemberContactDetails.query';
import { patientContactDetailsQuery } from 'graphql/patientContactDetails.query';
import { useNavigate, useParams } from 'react-router-dom';
import React, { useCallback, useEffect, useState } from 'react';
import catchError from 'lib/catch-error';
import { fullNameController } from 'components/fullName';
import PretaaContactsDetailsSkeletonLoading from './skeletonLoading/PretaaContactsDetailsSkeletonLoading';
import { stringFullNameAvatar } from '../../lib/get-name-intials';
import { routes } from 'routes';
import useGetPrivilege, { CapabilitiesType } from 'lib/getPrivilege';
import { ContactTypesForContact } from 'interface/contact.interface';

interface ContactDetailsInterface {
  name: string;
  email: string | null;
  phone: string | null;
  relationship?: string | null;
}

export default function PretaaContactsDetails() {
  const { contactId, contactType } = useParams();
  const [contactDetails, setContactDetails] = useState<ContactDetailsInterface>();
  const navigate = useNavigate();
  const canEdit = useGetPrivilege(UserPermissionNames.CONTACTS, CapabilitiesType.EDIT);

  const [getFacilityMedicalContactsCallBack, { loading: facilityMedicalContactsDetailsLoading }] = useLazyQuery<
    CareTeamMemberContactDetails,
    CareTeamMemberContactDetailsVariables
  >(careTeamMemberContactDetailsQuery, {
    onCompleted: (d) => {
      const u = d.pretaaHealthEHRGetCareTeamMemberDetails.user;
      if (d.pretaaHealthEHRGetCareTeamMemberDetails.user) {
        setContactDetails({
          name: fullNameController(u?.firstName as string, u?.lastName as string),
          phone: u?.mobilePhone || 'N/A',
          email: u?.email || 'N/A',
        });
      }
    },
    onError: (e) => catchError(e, true),
  });

  const [getPersonalDetailsCallBack, { loading: personalDetailsLoading }] = useLazyQuery<
    PatientContactDetails,
    PatientContactDetailsVariables
  >(patientContactDetailsQuery, {
    onCompleted: (d) => {
      const personalDetails = d.pretaaHealthViewPatientContact;
      if (personalDetails) {
        setContactDetails({
          name: (personalDetails?.fullName as string) || 'N/A',
          phone: personalDetails?.phone || 'N/A',
          email: personalDetails?.email || 'N/A',
          relationship: personalDetails?.relationship || 'N/A',
        });
      }
    },
    onError: (e) => catchError(e, true),
  });

  const [getFriendsFamilyDetailsCallBack, { loading: friendsFamilyDetailsLoading }] = useLazyQuery<
    SupporterContactDetails,
    SupporterContactDetailsVariables
  >(supporterContactDetailsQuery, {
    onCompleted: (d) => {
      const u = d.pretaaHealthSupporterDetails;
      if (d.pretaaHealthSupporterDetails) {
        setContactDetails({
          name: fullNameController(u?.firstName as string, u?.lastName as string),
          phone: u?.mobilePhone || 'N/A',
          email: u?.email || 'N/A',
        });
      }
    },
    onError: (e) => catchError(e, true),
  });

  const callGetContactDetailsFunction = useCallback(
    (type: ContactTypesForContact) => {
      if (type === ContactTypesForContact.CARE_TEAM) {
        getFacilityMedicalContactsCallBack({
          variables: {
            careTeamId: String(contactId),
          },
        });
      } else if (type === ContactTypesForContact.SUPPORTER) {
        getFriendsFamilyDetailsCallBack({
          variables: {
            supporterId: String(contactId),
          },
        });
      } else if (type === ContactTypesForContact.PATIENT_CONTACT) {
        getPersonalDetailsCallBack({
          variables: {
            patientContactId: String(contactId),
          },
        });
      }
    },
    [contactId, getFacilityMedicalContactsCallBack, getFriendsFamilyDetailsCallBack, getPersonalDetailsCallBack]
  );

  useEffect(() => {
    if (contactType) {
      callGetContactDetailsFunction(contactType as ContactTypesForContact);
    }
  }, [callGetContactDetailsFunction, contactType, contactId]);

  const customStyles = {
    placeholder: {
      color: '#515151',
      fontSize: '18px',
      fontWeight: 400,
      letterSpacing: '1px',
      backgroundColor: '#D8D8D8',
    }
  };

  return (
    <React.Fragment>
      <ContentHeader className="lg:sticky">
        {!(friendsFamilyDetailsLoading || personalDetailsLoading || facilityMedicalContactsDetailsLoading) && (
          <div className=" flex justify-start items-center mt-2">
            <h1 className="h1 leading-none text-primary font-bold  text-md lg:text-lg ">
              {contactDetails?.name || contactDetails?.email}
            </h1>

            {contactType === ContactTypesForContact.PATIENT_CONTACT && canEdit && (
              <div className="w-15 ml-4 ">
                <BsPencil
                  size={22}
                  className=" text-primary-light cursor-pointer"
                  onClick={() => navigate(routes.profileContactFormEdit.build(String(contactId)))}
                />
              </div>
            )}
          </div>
        )}

        {(friendsFamilyDetailsLoading || personalDetailsLoading || facilityMedicalContactsDetailsLoading) && (
          <Skeleton height={20} width={'40%'} />
        )}
      </ContentHeader>
      <ContentFrame>
        {(friendsFamilyDetailsLoading || personalDetailsLoading || facilityMedicalContactsDetailsLoading) && (
          <PretaaContactsDetailsSkeletonLoading />
        )}

        {!!contactDetails &&
          !(friendsFamilyDetailsLoading || personalDetailsLoading || facilityMedicalContactsDetailsLoading) && (
            <React.Fragment>
              <div
                className="flex flex-row bg-white w-full 
           px-4 py-6 text-base justify-between items-center first:rounded-t-xl
           last:rounded-b-xl border-gray-100 border-b
           last:border-b-0">
                <div className="flex flex-row w-full items-center">
                  <div className="flex-none w-20">
                    <Avatar
                      {...stringFullNameAvatar(contactDetails.name)}
                      radius="xl"
                      styles={customStyles}
                    />
                  </div>
                  <div className="flex flex-col md:gap-0 gap-1">
                    <span className="text-pt-primary font-bold flex">
                      <div className="grow">
                        <h2>{contactDetails?.name}</h2>
                        <p className="text-xs font-semibold text-gray-600 uppercase">{contactDetails.relationship}</p>
                      </div>
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white w-full px-4 py-8 text-base justify-between items-center rounded-xl mt-10">
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {!!contactDetails?.phone?.length && (
                    <div className="flex-1">
                      <div className="flex flex-row items-start">
                        <div className="pt-2">
                          <BsTelephone size={20} />
                        </div>
                        <div className="pl-4">
                          <h2 className="text-sm font-normal text-gray-600">Work Phone</h2>
                          <span className=" text-sm font-medium text-gray-700 pt-1 block">{contactDetails.phone}</span>
                        </div>
                      </div>
                    </div>
                  )}
                  {!!contactDetails?.email?.length && (
                    <div className="flex-1">
                      <div className="flex flex-row items-start">
                        <div className="pt-0.5">
                          <BsEnvelope size={20} />
                        </div>
                        <div className="pl-4">
                          <h2 className="text-sm font-normal text-gray-600">Email</h2>
                          <span className=" text-sm font-medium text-gray-700 pt-1 block">{contactDetails.email}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </React.Fragment>
          )}
      </ContentFrame>
    </React.Fragment>
  );
}
