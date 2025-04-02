import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { ContentFrame } from 'components/content-frame/ContentFrame';
import { ContentHeader } from 'components/ContentHeader';
import { AdminSourceSystems } from 'health-generatedTypes';
import Button from 'components/ui/button/Button';
import { useNavigate, useParams } from 'react-router-dom';
import { routes } from 'routes';
import { useLazyQuery } from '@apollo/client';
import SourceSystemListSkeletonLoading from '../skeletonLoader/SourceSystemListSkeletonLoading';
import './_facility-form.scoped.scss';
import { adminSourceSystemQuery } from 'graphql/adminSourceSystem.query';
import catchError from 'lib/catch-error';
import { CustomSourceSystemData } from './lib/FacilityFormHelper';

interface SourceItemImageOrTextHelper {
  listName: string;
  logo: string | null
}

export default function SourceSystemList() {
  const { register, handleSubmit, setValue } = useForm();
  const [showButton, setShowButton] = useState(false);
  const [sourceList, setSourceList] = useState<CustomSourceSystemData[]>();
  const navigate = useNavigate();
  const { clientId } = useParams();

  const [getAdminSourceLists, { loading: adminSourceListLoading }] = useLazyQuery<AdminSourceSystems>(adminSourceSystemQuery, {
      onCompleted: (data) => {
        setSourceList(data.pretaaHealthAdminSourceSystems);
      },
      onError: (e) => {
        catchError(e, true);
      }
  });
console.log({sourceList});

  const clickOnSystem = (id: string, name: string, slug: string) => {
    setValue('id', id);
    setValue('name', name);
    setValue('slug', slug);
    setShowButton(true);
  };

  const onContinue = (systemData: any) => {
    navigate(
      routes.owner.addFacility.build(String(clientId), { systemId: systemData.id, systemName: systemData.name, systemSlug: systemData.slug }),
    );
  };

  useEffect(() => {
    getAdminSourceLists();
  }, []);


  function getSourceItemImageOrText(data: SourceItemImageOrTextHelper) {
    console.log({data});

    if (data.logo) {
      return (
        <div className="w-full h-36 bg-white flex justify-center items-center text-center font-bold italic text-primary text-lg">
         <img src={data.logo} alt={data.listName} width={120} />
       </div>
      );
    }
    return (
      <div className="w-full h-36 bg-white flex justify-center items-center text-center font-bold italic text-primary text-lg">
        {data.listName}
      </div>
    );
  }

  return (
    <>
      <ContentHeader title="Source System" />
      <ContentFrame className="flex flex-col h-custom">
        {(adminSourceListLoading) && <SourceSystemListSkeletonLoading />}

        {!(adminSourceListLoading) && sourceList && sourceList?.length > 0 && (
          <form
            className="flex flex-col flex-1"
            onSubmit={handleSubmit(onContinue)}>
            <div className="flex flex-col flex-1">
              <div className="block sm:flex">
                {sourceList?.map((list: CustomSourceSystemData, i: number) => (
                  <div
                    className="flex flex-col w-24 md:w-48 mr-1 md:mr-4 text-center"
                    key={list?.id}>
                    <div className="text-center mb-3">
                      <input
                        type="radio"
                        id={list.id}
                        {...register('radio')}
                        onChange={() => clickOnSystem(list?.id, list?.name, list?.slug)}
                        className="source-radio-button mb-2"
                        tabIndex={i + 1}
                      />
                      <label 
                        className="cursor-pointer hover:drop-shadow-md transition duration-300" 
                        htmlFor={list.id}
                      >
                        {getSourceItemImageOrText({ listName: list?.name, logo: list?.logo })}
                      </label>
                    </div>

                    <p className="text-base text-primary font-bold text-center mt-3">{list?.name}</p>
                  </div>
                ))}
              </div>
            </div>
            {showButton && (
              <div className='relative mb-6 sm:mb-0 sm:absolute sm:bottom-5'>
                <Button text="Continue" tabIndex={3} />
              </div>
            )}


          </form>
        )}
      </ContentFrame>
    </>
  );
}
