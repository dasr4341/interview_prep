import { ContentHeader } from 'components/ContentHeader';
import { DisclosureIcon } from 'components/icons/DisclosureIcon';
import useQueryParams from 'lib/use-queryparams';
import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { routes } from 'routes';
import PatientDetailsContext from './AddPatientContext';

enum TabNames {
  DETAILS = 'details',
  CONTACT = 'contact',
  CARE = 'care',
}

export default function PatientFormView() {
  const location = useLocation();
  const { patientId } = useQueryParams();
  
  const [tabStatus, setTabStatus] = useState<TabNames>(TabNames.DETAILS);

  useEffect(() => {
    if (location.pathname.includes(routes.admin.addPatient.patientDetails.match)) {
      setTabStatus(TabNames.DETAILS);
    } else if (location.pathname.includes(routes.admin.addPatient.patientContactDetails.match)) {
      setTabStatus(TabNames.CONTACT);
    } else {
      setTabStatus(TabNames.CARE);
    }
  }, [location.pathname]);

  return (
    <>
      <ContentHeader link={ patientId ? routes.admin.patientDetails.userDetails.build(String(patientId)) : routes.admin.patientList.match} className="shadow-none lg:py-0.5">
        <div className=" font-bold text-lg">{patientId ? 'Edit Patient' : 'Add Patient'}</div>
        <div className=" overflow-auto">
          <div className=" flex items-center mt-10 space-x-4 border-b w-custom md:w-full ">
            <div
              className={`flex items-center space-x-2 py-4  ${
                tabStatus === TabNames.DETAILS && ' border-b-2 border-primary-light'
              } `}>
              <div
                className={`rounded-full h-4 md:h-5 w-4  md:w-5 md:text-xss text-xxs font-bold  flex justify-center items-center
                ${tabStatus === TabNames.DETAILS ? ' bg-primary-light' : 'bg-primary'} text-white`}>
                1
              </div>
              <div
                className={` md:text-base text-sm  font-bold  ${tabStatus === TabNames.DETAILS ? 'text-primary-light' : 'text-primary'}  `}>
                Patient Details
              </div>
            </div>

            <DisclosureIcon className=" text-gray-400 " />
            <div
              className={`flex items-center space-x-2 py-4  ${
                tabStatus === TabNames.CONTACT && ' border-b-2 border-primary-light'
              } `}>
              <div
                className={`rounded-full h-4 md:h-5 w-4  md:w-5 md:text-xss text-xxs font-bold  flex justify-center items-center
                ${tabStatus === TabNames.CONTACT ? ' bg-primary-light' : 'bg-primary'} text-white`}>
                2
              </div>
              <div
                className={` md:text-base text-sm  font-bold  ${tabStatus === TabNames.CONTACT ? 'text-primary-light' : 'text-primary'}  `}>
                Contacts
              </div>
            </div>

            <DisclosureIcon className=" text-gray-400" />
            <div
              className={`flex items-center space-x-2 py-4  ${
                tabStatus === TabNames.CARE && ' border-b-2 border-primary-light'
              } `}>
              <div
                className={`rounded-full h-4 md:h-5 w-4  md:w-5 md:text-xss text-xxs font-bold  flex justify-center items-center
                ${tabStatus === TabNames.CARE ? ' bg-primary-light' : 'bg-primary'} text-white`}>
                3
              </div>
              <div className={` md:text-base text-sm  font-bold  ${tabStatus === TabNames.CARE ? 'text-primary-light' : 'text-primary'}  `}>
                Care Team
              </div>
            </div>
          </div>
        </div>
      </ContentHeader>
      <PatientDetailsContext>
      <Outlet />
      </PatientDetailsContext>
    </>
  );
}
