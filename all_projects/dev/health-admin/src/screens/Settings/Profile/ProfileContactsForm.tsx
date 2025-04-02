import React, { useEffect, useState } from 'react';
import 'reactjs-popup/dist/index.css';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import Select from 'react-select';
import { toast } from 'react-toastify';
import { useLazyQuery, useMutation } from '@apollo/client';
import { useNavigate, useParams } from 'react-router-dom';

import { ContentFooter } from 'components/content-footer/ContentFooter';
import { ContentHeader } from 'components/ContentHeader';
import TextInputFields from 'components/TextInputFields';
import TextArea from 'components/TextArea';
import Button from 'components/ui/button/Button';
import './_profileContactsForm.scoped.scss';
import messagesData from 'lib/messages';
import {
  EHRAddPatientContact,
  EHRAddPatientContactVariables,
  EHRUpdatePatientContact,
  EHRUpdatePatientContactVariables,
  PatientEHRContactType,
  RelationshipTypes,
  ViewPatientContact,
  ViewPatientContactVariables,
} from 'health-generatedTypes';
import { ErrorMessage } from 'components/ui/error/ErrorMessage';
import { addPatientContact } from 'graphql/addPatientContact.mutation';
import catchError from 'lib/catch-error';
import { updatePatientContact } from 'graphql/updatePatientContact.mutation';
import { viewPatientContactQuery } from 'graphql/viewPatientContact.query';
import ProfileContactsFormSkeletonLoading from '../Admin/PatientForm/SkeletonLoading/ProfileContactsFormSkeletonLoading';
import { phoneNoValidation } from 'lib/validation/phone-no-validation';
import { yupEmailValidation } from 'lib/validation/yup-email-validation';
import { parsePhoneNumber } from 'libphonenumber-js';
import { FamilyRelationShipType, LegalRelationType, OtherRelationType } from '../Admin/PatientForm/patient-form-enum';
import { SelectBox } from 'interface/SelectBox.interface';
import { customStylesSelectBoxOne } from 'components/ui/SelectBox';
import { ProfileContactsFormFields } from '../interface/ProfileContactsForm.interface';

const profileContactFormSchema = yup.object().shape({
  name: yup.string().trim().required(messagesData.errorList.required),
  phone: phoneNoValidation.required(messagesData.errorList.required),
  relationship: yup.string().nullable().required(messagesData.errorList.required),
  address: yup.string().trim(),
  company: yup.string().trim(),
  notes: yup.string().trim(),
  url: yup.string().trim(),
  email: yupEmailValidation.notRequired(),
  patientEhrContactType: yup.string().required(messagesData.errorList.required),
  alternativePhone: phoneNoValidation.nullable(),
});

interface ContactTypeList {
  value: string;
  label: string;
}

export default function ProfileContactsForm() {
  const navigate = useNavigate();
  const { id: patientContactId } = useParams();
  const [selectedGuardian, setSelectedGuardian] = useState<any>(null);
  const [contactTypeList, setContactTypeList] = useState<ContactTypeList>();
  const [isContactType, setIsContactType] = useState('');
  const [relationshipType, setRelationshipType] = useState<SelectBox[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    getValues,
    formState: { errors },
  } = useForm<ProfileContactsFormFields>({
    resolver: yupResolver(profileContactFormSchema),
  });

  // create contact
  const [createPatientContact, { loading: createFormLoading }] = useMutation<
    EHRAddPatientContact,
    EHRAddPatientContactVariables
  >(addPatientContact);

  // edit contact team
  const [editPatientContact, { loading: updateFormLoading }] = useMutation<
    EHRUpdatePatientContact,
    EHRUpdatePatientContactVariables
  >(updatePatientContact);

  // getting the data
  const [getPatientContact, { loading: getPatientContactLoading, data: getPatientContactData }] = useLazyQuery<
    ViewPatientContact,
    ViewPatientContactVariables
  >(viewPatientContactQuery, {
    onCompleted: (d) => {
      if (d.pretaaHealthViewPatientContact) {
        setValue('alternativePhone', d.pretaaHealthViewPatientContact.alternativePhone || '');
        setValue('address', d.pretaaHealthViewPatientContact.address || '');
        setValue('company', d.pretaaHealthViewPatientContact.company || '');
        setValue('email', d.pretaaHealthViewPatientContact.email || '');
        setValue('name', d.pretaaHealthViewPatientContact.fullName || '');
        setValue('notes', d.pretaaHealthViewPatientContact.notes || '');
        setValue('phone', d.pretaaHealthViewPatientContact.phone || '');
        setValue('relationship', d.pretaaHealthViewPatientContact.relationship as RelationshipTypes);
        setValue('url', d.pretaaHealthViewPatientContact.url || '');
        setValue('patientEhrContactType', d.pretaaHealthViewPatientContact.contactType);
      }
    },
    onError: (e) => catchError(e, true),
  });

  function onSubmit(data: ProfileContactsFormFields) {
    
    const formattedData = {
      ...data,
      phone: parsePhoneNumber(data.phone, 'US').formatInternational(),
      alternativePhone: data?.alternativePhone
        ? parsePhoneNumber(data.alternativePhone, 'US').formatInternational()
        : '',
        patientEhrContactType: data.patientEhrContactType as unknown as PatientEHRContactType
    };

    // ---------- UPDATE OLD ----------
    if (patientContactId) {
      editPatientContact({
        variables: {
          patientContactId,
          ...formattedData,
        },
        onCompleted: () => {
          toast.success(messagesData.successList.patientContactUpdated, {delay: 100});
          navigate(-1);
        },
        onError: (e) => catchError(e, true),
      });
      return;
    }

    // --------- CREATE NEW -------------
    createPatientContact({
      variables: formattedData,
      onCompleted: () => {
        toast.success(messagesData.successList.patientContactAdded, {delay: 100});
        navigate(-1);
      },
      onError: (e) => catchError(e, true),
    });
  }

  useEffect(() => {
    if (patientContactId) {
      getPatientContact({ variables: { patientContactId } });
    }
  }, [patientContactId]);

  // categorized relation type based on contact type value
  useEffect(() => {
    if (
      getValues('patientEhrContactType') === PatientEHRContactType.FAMILY ||
      getValues('patientEhrContactType') === PatientEHRContactType.EMERGENCY ||
      getValues('patientEhrContactType') === PatientEHRContactType.MEDICAL
    ) {
      setRelationshipType(
        Object.entries(FamilyRelationShipType).map((e) => ({
          value: e[0],
          label: e[0]?.replaceAll('_', ' '),
        }))
      );
    } else if (
      getValues('patientEhrContactType') === PatientEHRContactType.LEGAL
    ) {
      setRelationshipType(
        Object.entries(LegalRelationType).map((e) => ({
          value: e[0],
          label: e[0]?.replaceAll('_', ' '),
        }))
      );
    } else if (
      getValues('patientEhrContactType') === PatientEHRContactType.OTHER
    ) {
      setRelationshipType(
        Object.entries(OtherRelationType).map((e) => ({
          value: e[0],
          label: e[0]?.replaceAll('_', ' '),
        }))
      );
    } else {
      setRelationshipType(
        Object.entries(RelationshipTypes).map((e) => ({
          value: e[0],
          label: e[0]?.replaceAll('_', ' '),
        }))
      );
    }
  }, [isContactType]);

  return (
    <React.Fragment>
      <ContentHeader
        title={patientContactId ? 'Update Contact' : 'New Contact'}
        className="lg:sticky"></ContentHeader>

      <div>
        {getPatientContactLoading && <ProfileContactsFormSkeletonLoading />}
        {!getPatientContactLoading && (
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="px-6 lg:px-16 mt-10 pb-32">
              <div className="fieldWidth">
                <label className="block text-xsm font-normal text-gray-750 mb-2">
                  Name
                </label>

                <TextInputFields
                  placeholder="Name"
                  type="text"
                  register={register('name')}
                />

                {errors.name?.message && (
                  <ErrorMessage message={errors.name?.message} />
                )}
              </div>
              <div className="pt-6 fieldWidth">
                <label className="block text-xsm font-normal text-gray-750 mb-2">
                  Email
                </label>
                <TextInputFields
                  placeholder="Email"
                  type="email"
                  register={register('email')}
                />
                {errors.email?.message && (
                  <ErrorMessage message={errors.email?.message} />
                )}
              </div>
              <div className="pt-6 fieldWidth">
                <label className="block text-xsm font-normal text-gray-750 mb-2">
                  Phone Number
                </label>
                <TextInputFields
                  placeholder="Phone number"
                  type="text"
                  register={register('phone')}
                />
                {errors.phone?.message && (
                  <ErrorMessage message={errors.phone?.message} />
                )}
              </div>
              <div className="pt-6 fieldWidth">
                <label className="block text-xsm font-normal text-gray-750 mb-2">
                  Alternative Phone Number
                </label>
                <TextInputFields
                  placeholder="Alternative phone number"
                  type="text"
                  register={register('alternativePhone')}
                />
                {errors.alternativePhone?.message && (
                  <ErrorMessage message={errors.alternativePhone?.message} />
                )}
              </div>
              <div className="pt-6 fieldWidth">
                <label className=" text-xsm font-normal text-gray-750 mb-2">
                  Contact Type
                </label>
                <Select
                  className="app-react-select"
                  name="patientEhrContactType"
                  id="patientEhrContactType"
                  value={
                    contactTypeList
                      ? contactTypeList
                      : {
                          value:
                            getPatientContactData
                              ?.pretaaHealthViewPatientContact?.contactType ||
                            '',
                          label:
                            getPatientContactData
                              ?.pretaaHealthViewPatientContact?.contactType ||
                            'Select Contact Type',
                        }
                  }
                  onChange={(val) => {
                    if (val) {
                      setValue(
                        'patientEhrContactType',
                        val.value as PatientEHRContactType
                      );
                      setSelectedGuardian(null);
                      setContactTypeList(val);
                      trigger('patientEhrContactType');
                      setIsContactType(val.value);
                      
                    }
                  }}
                  options={Object.entries(PatientEHRContactType).map((val) => ({
                    value: val[0],
                    label: val[0],
                  }))}
                  styles={customStylesSelectBoxOne}
                />

                {errors.patientEhrContactType?.message && (
                  <ErrorMessage
                    message={errors.patientEhrContactType?.message}
                  />
                )}
              </div>
              <div className="pt-6 fieldWidth">
                <label className="block text-xsm font-normal text-gray-750 mb-2">
                  Relationship
                </label>
                <Select
                  className="app-react-select"
                  value={
                    selectedGuardian
                      ? selectedGuardian
                      : {
                          value:
                            getPatientContactData
                              ?.pretaaHealthViewPatientContact?.relationship ||
                            '',
                          label:
                            getPatientContactData
                              ?.pretaaHealthViewPatientContact?.relationship ||
                            ' Select Relationship ',
                        }
                  }
                  name="relationship"
                  id="relationship"
                  onChange={(val) => {
                    if (val) {
                      setValue('relationship', val.value);
                      setSelectedGuardian(val);
                      trigger('relationship');
                    }
                  }}
                  options={relationshipType}
                  styles={customStylesSelectBoxOne}
                />

                {errors.relationship?.message && (
                  <ErrorMessage message={errors.relationship?.message} />
                )}
              </div>
              <div className="pt-6 fieldWidth">
                <label className="block text-xsm font-normal text-gray-750 mb-2">
                  Address
                </label>
                <TextInputFields
                  placeholder="Address"
                  type="text"
                  register={register('address')}
                />
                {errors.address?.message && (
                  <ErrorMessage message={errors.address?.message} />
                )}
              </div>
              <div className="pt-6 fieldWidth">
                <label className="block text-xsm font-normal text-gray-750 mb-2">
                  Company
                </label>
                <TextInputFields
                  placeholder="Company"
                  type="text"
                  register={register('company')}
                />
                {errors.company?.message && (
                  <ErrorMessage message={errors.company?.message} />
                )}
              </div>

              <div className="pt-6 fieldWidth">
                <label className="block text-xsm font-normal text-gray-750 mb-2">
                  Note
                </label>
                <TextArea
                  placeholder="Notes"
                  register={register('notes')}
                />
                {errors.notes?.message && (
                  <ErrorMessage message={errors.notes?.message} />
                )}
              </div>
              <div className="pt-6 fieldWidth">
                <label className="block text-xsm font-normal text-gray-750 mb-2">
                  URL
                </label>
                <TextInputFields
                  placeholder="URL"
                  type="text"
                  register={register('url')}
                />
                {errors.url?.message && (
                  <ErrorMessage message={errors.url?.message} />
                )}
              </div>
            </div>

            <div className="fixed bottom-0 w-full">
              <ContentFooter>
                <div className="flex flex-wrap justify-between w-full">
                  <div className="flex">
                    <Button
                      disabled={createFormLoading || updateFormLoading}
                      loading={createFormLoading || updateFormLoading}
                      type="submit">
                      Save
                    </Button>
                    <Button
                      buttonStyle="bg-none"
                      type="button"
                      onClick={() => {
                        navigate(-1);
                      }}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </ContentFooter>
            </div>
          </form>
        )}
      </div>
    </React.Fragment>
  );
}
