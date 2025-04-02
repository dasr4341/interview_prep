import { ContentFooter } from 'components/content-footer/ContentFooter';
import { ContentFrame } from 'components/content-frame/ContentFrame';
import Button from 'components/ui/button/Button';
import React, { useContext, useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { messagesData } from 'lib/messages';
import { useLocation, useNavigate } from 'react-router-dom';
import { ErrorMessage } from 'components/ui/error/ErrorMessage';
import { routes } from 'routes';
import useQueryParams from 'lib/use-queryparams';
import { PatientAddStep2RouteQuery } from './PatientRoutes';
import {
  Contacts,
  GetPatientDetails,
  GetPatientDetailsVariables,
  GetPatientDetails_pretaaHealthPatientDetails,
  PatientEHRContactType,
  RelationshipTypes,
} from 'health-generatedTypes';
import PatientContactDetailsFormSkeletonLoading from '../skeletonLoading/PatientContactDetailsFormSkeletonLoading';
import { AiOutlineUser } from 'react-icons/ai';
import { PatientDetailContext } from './AddPatientContext';
import TextInputFields from 'components/TextInputFields';
import Select from 'react-select';
import { DropdownIndicator } from 'components/ui/SelectBox';
import { SelectBox } from 'interface/SelectBox.interface';
import './_patient-form.scoped.scss';
import { useLazyQuery } from '@apollo/client';
import { getPatientDetails } from 'graphql/getPatientDetails.query';
import { FamilyRelationShipType, LegalRelationType, OtherRelationType } from './patient-form-enum';
import { buildUrl } from 'router/lib-router';
import usePatientFieldMetaData from './usePatientFieldMetaData';
import { customStyleSelectBoxEhr, fieldsSchema } from './helper/PatientFormHelper';


export default function PatientContactDetailsForm() {
  const query: PatientAddStep2RouteQuery = useQueryParams();

  const [patientDetailsState, setPatientDetailsState] = useState<GetPatientDetails_pretaaHealthPatientDetails>();

  const location = useLocation();
  const navigate = useNavigate();
  const { updatePatientContact, patientContact } = useContext(PatientDetailContext);
  const [relationshipType, setRelationshipType] = useState<SelectBox[]>([]);
  const [isContactType, setIsContactType] = useState('');

  const contactTypesList = Object.entries(PatientEHRContactType).map((e) => ({ value: e[0], label: e[0] }));
  const defaultFieldsValue = [{ contactType: '', relationship: '', name: '', phone: '', email: '', isEditable: false }];

  const { patientMetaData } = usePatientFieldMetaData();

  const {
    setValue,
    register,
    handleSubmit,
    control,
    trigger,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      contactFrom: defaultFieldsValue,
    },
    resolver: yupResolver(fieldsSchema),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'contactFrom',
  });

  function onSubmit(patientContactDetails: any) {
    navigate(
      buildUrl(routes.admin.addPatient.patientCareTeam.match, {
        patientId: query.patientId,
      })
    );

    updatePatientContact((prevData: Contacts) => ({
      ...prevData,
      ...patientContactDetails,
    }));
  }

  const [getPatientsDetailsData, { loading: patientsDetailsLoading }] = useLazyQuery<
    GetPatientDetails,
    GetPatientDetailsVariables
  >(getPatientDetails, {
    onCompleted: (data) => {
      if (data) {
        setPatientDetailsState(data.pretaaHealthPatientDetails);
      }
    },
  });

  useEffect(() => {
    if (query.patientId) {
      getPatientsDetailsData({
        variables: {
          patientId: query.patientId,
        },
      });
    }
  }, []);

  useEffect(() => {
    //setting the data to the form
    if (patientContact.contactFrom) {
      setValue('contactFrom', patientContact.contactFrom || []);
    } else if (patientDetailsState?.id && patientDetailsState.patientContactList?.patientContacts) {
      patientDetailsState.patientContactList?.patientContacts.forEach((e) => {
        append({
          relationship: e.relationship || '',
          name: e.fullName || '',
          phone: e.phone || '',
          email: e.email || '',
          contactType: e.contactType || '',
          isEditable: Boolean(patientMetaData?.patientContacts.some((metaId) => metaId === e.id)),
        });
      });
    } else {
      remove(0);
    }
  }, [patientDetailsState?.id, location.search]);

  // remove autoFocus from input field
  useEffect(() => {
    fields.forEach((_, index) => {
      const inputElement = document.querySelector(`input[name="contactFrom.${index}.name"]`) as any;
      if (inputElement) {
        inputElement.blur();
      }
    });
  }, [fields]);

  // categorized relation type based on contact type value
  useEffect(() => {
    fields.forEach((_, index) => {
      if (
        getValues(`contactFrom.${index}.contactType`) === PatientEHRContactType.FAMILY ||
        getValues(`contactFrom.${index}.contactType`) === PatientEHRContactType.EMERGENCY ||
        getValues(`contactFrom.${index}.contactType`) === PatientEHRContactType.MEDICAL
      ) {
        setRelationshipType(
          Object.entries(FamilyRelationShipType).map((e) => ({
            value: e[0],
            label: e[0]?.replaceAll('_', ' '),
          }))
        );
      } else if (getValues(`contactFrom.${index}.contactType`) === PatientEHRContactType.LEGAL) {
        setRelationshipType(
          Object.entries(LegalRelationType).map((e) => ({
            value: e[0],
            label: e[0]?.replaceAll('_', ' '),
          }))
        );
      } else if (getValues(`contactFrom.${index}.contactType`) === PatientEHRContactType.OTHER) {
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
    });
  }, [isContactType]);

  return (
    <div className="relative bg-white parent-frame">
      <ContentFrame>
        <React.Fragment>
          <form
            id="patient-form"
            onSubmit={handleSubmit(onSubmit)}
            className="w-full max-w-600 pb-52">
            {/* loader */}
            {patientsDetailsLoading && <PatientContactDetailsFormSkeletonLoading />}
            {/* ---------------------------------- */}

            {/* data not found  */}
            {!patientsDetailsLoading && !fields?.length && (
              <div className="flex flex-col justify-center items-center w-fit text-primary mx-auto">
                <AiOutlineUser className="md:w-20 md:h-20 w-10 h-10" />
                <div className="font-normal md:text-xmd text-center text-xs mt-2 pb-2.5">No contact added</div>
              </div>
            )}
            {/* ---------------------------------- */}

            {/* actual data */}
            {!patientsDetailsLoading && (
              <>
                {fields.map((f, i) => {
                  return (
                    <div key={f.id}>
                      <div
                        className={`flex relative flex-col space-y-6 py-8 ${
                          i !== fields.length - 1 && 'border-b border-gray-500'
                        }`}
                        >
                        <div
                          className="flex flex-col"
                          >
                          <React.Fragment>
                            <label className=" text-xsm font-normal text-gray-750 mb-2">Contact Type</label>
                            <Select
                              isDisabled={f.isEditable}
                              disabled={!contactTypesList?.length}
                              {...register(`contactFrom.${i}.contactType`)}
                              placeholder="Select contact type"
                              closeMenuOnSelect={true}
                              styles={customStyleSelectBoxEhr}
                              hideSelectedOptions={false}
                              className="app-react-select w-full rounded "
                              components={{
                                IndicatorSeparator: () => null,
                                DropdownIndicator,
                              }}
                              value={
                                getValues(`contactFrom.${i}.contactType`) && {
                                  label: getValues(`contactFrom.${i}.contactType`)?.replaceAll('_', ' '),
                                  value: getValues(`contactFrom.${i}.contactType`),
                                }
                              }
                              options={contactTypesList}
                              onChange={(data) => {
                                setIsContactType((data as SelectBox)?.value);
                                setValue(`contactFrom.${i}.relationship`, '');
                                setValue(`contactFrom.${i}.contactType`, (data as SelectBox)?.value || '');
                                trigger(`contactFrom.${i}.contactType`);
                              }}
                            />
                          </React.Fragment>

                          {!!errors?.contactFrom?.length && errors.contactFrom[i]?.contactType?.message && (
                            <ErrorMessage message={String(errors.contactFrom[i]?.contactType?.message)} />
                          )}
                        </div>
                        <div
                          className="flex flex-col "
                          key={f.id}>
                          <label className=" text-xsm font-normal text-gray-750 mb-2">Relationship Type</label>
                          <Select
                            isDisabled={f.isEditable}
                            {...register(`contactFrom.${i}.relationship`)}
                            placeholder="Select relationship type"
                            closeMenuOnSelect={true}
                            styles={customStyleSelectBoxEhr}
                            hideSelectedOptions={false}
                            className="app-react-select w-full rounded "
                            components={{
                              IndicatorSeparator: () => null,
                              DropdownIndicator,
                            }}
                            value={
                              getValues(`contactFrom.${i}.relationship`) && {
                                label: getValues(`contactFrom.${i}.relationship`)?.replaceAll('_', ' '),
                                value: getValues(`contactFrom.${i}.relationship`),
                              }
                            }
                            options={relationshipType}
                            onChange={(data) => {
                              setValue(`contactFrom.${i}.relationship`, (data as SelectBox)?.value || '');
                              trigger(`contactFrom.${i}.relationship`);
                            }}
                          />
                          {!!errors?.contactFrom?.length && errors.contactFrom[i]?.relationship?.message && (
                            <ErrorMessage message={String(errors.contactFrom[i]?.relationship?.message)} />
                          )}
                        </div>

                        <div
                          className="flex flex-col "
                          key={f.id}>
                          <label className=" text-xsm font-normal text-gray-750 mb-2"> Name</label>
                          <TextInputFields
                            type="text"
                            register={register(`contactFrom.${i}.name`)}
                            placeholder="Enter contact name"
                            backgroundColor={`${f.isEditable ? 'bg-gray-450' : 'bg-white'}`}
                            disable={f.isEditable}
                            className={`${
                              f.isEditable && 'cursor-not-allowed  placeholder-gray-500 opacity-50 select-auto'
                            }
                            rounded border-gray-350 py-3`}
                          />

                          {!!errors?.contactFrom?.length && errors.contactFrom[i]?.name?.message && (
                            <ErrorMessage message={String(errors.contactFrom[i]?.name?.message)} />
                          )}
                        </div>

                        <div
                          className="flex flex-col "
                          key={f.id}>
                          <label className=" text-xsm font-normal text-gray-750 mb-2"> Phone Number </label>
                          <TextInputFields
                            type="text"
                            register={register(`contactFrom.${i}.phone`)}
                            placeholder="Enter contact phone number"
                            backgroundColor={`${f.isEditable ? 'bg-gray-450' : 'bg-white'}`}
                            disable={f.isEditable}
                            className={`${
                              f.isEditable && 'cursor-not-allowed  placeholder-gray-500 opacity-50 select-auto'
                            }
                            rounded border-gray-350 py-3`}
                          />
                          {!!errors?.contactFrom?.length && errors.contactFrom[i]?.phone?.message && (
                            <ErrorMessage message={String(errors.contactFrom[i]?.phone?.message)} />
                          )}
                        </div>

                        <div
                          className="flex flex-col "
                          key={f.id}>
                          <label className=" text-xsm font-normal text-gray-750 mb-2"> Email</label>
                          <TextInputFields
                            type="email"
                            register={register(`contactFrom.${i}.email`)}
                            placeholder="Enter contact email"
                            backgroundColor={`${f.isEditable ? 'bg-gray-450' : 'bg-white'}`}
                            disable={f.isEditable}
                            className={`${
                              f.isEditable && 'cursor-not-allowed  placeholder-gray-500 opacity-50 select-auto'
                            }
                            rounded border-gray-350 py-3`}
                          />
                          {!!errors?.contactFrom?.length && errors.contactFrom[i]?.email?.message && (
                            <ErrorMessage message={String(messagesData.errorList.email)} />
                          )}
                        </div>

                        <button
                          className=" absolute -top-4 right-0 text-primary-light underline cursor-pointer"
                          onClick={() => remove(i)}>
                          Remove
                        </button>
                      </div>
                    </div>
                  );
                })}
                <button
                  type="button"
                  onClick={() => {
                    append({ contactType: '', relationship: '', name: '', phone: '', email: '', isEditable: false });
                  }}
                  className=" text-primary-light font-normal text-xsm mt-16 ">
                  Add contact +
                </button>
              </>
            )}
            {/* ---------------------------------- */}
          </form>
        </React.Fragment>
      </ContentFrame>
      <ContentFooter className=" fixed bottom-0 w-full">
        <div className="flex space-x-4">
          <Button
            disabled={patientsDetailsLoading}
            type="submit"
            form="patient-form">
            Next
          </Button>
          <Button
            buttonStyle="gray"
            onClick={() =>
              navigate(`${routes.admin.addPatient.patientDetails.match}${location.search}`, {
                replace: true,
              })
            }>
            Back
          </Button>
        </div>
      </ContentFooter>
    </div>
  );
}
