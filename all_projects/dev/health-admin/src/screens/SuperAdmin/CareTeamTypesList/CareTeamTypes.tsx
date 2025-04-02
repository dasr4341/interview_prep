import { useMutation } from '@apollo/client';
import { ContentHeader } from 'components/ContentHeader';
import { ContentFooter } from 'components/content-footer/ContentFooter';
import { ContentFrame } from 'components/content-frame/ContentFrame';
import Button from 'components/ui/button/Button';
import {
  GetAllCareTeamType_pretaaHealthGetAllCareTeamType,
  UpdateCareTeamType,
  UpdateCareTeamTypeVariables,
} from 'health-generatedTypes';
import catchError from 'lib/catch-error';
import { useEffect, useState } from 'react';
import CareTeam from './components/CareTeam';
import { UpdateCareTeamTypeQuery } from 'graphql/updateCareTeamType.mutation';
import { toast } from 'react-toastify';
import CareTeamLoading from './components/CareTeamLoading';
import Exclamation from 'components/icons/Exclamation';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'lib/store/app-store';
import { appSliceActions } from 'lib/store/slice/app/app.slice';
import { formatCareTeamTypeArr } from 'lib/store/slice/app/app.saga';
import './_careTeamType.scoped.scss';

export default function CareTeamTypes() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [careTeamTypes, setCareTeamTypes] = useState<GetAllCareTeamType_pretaaHealthGetAllCareTeamType[]>(
    useAppSelector((state) => state.app.careTeamTypesLabel.remoteData),
  );
  const loading = Boolean(useAppSelector((state) => state.app.appEvents));

  const [updateCareTypesCallBack, { loading: updateCareTeamTypeLoading, data: updatedCareTeam }] = useMutation<
    UpdateCareTeamType,
    UpdateCareTeamTypeVariables
  >(UpdateCareTeamTypeQuery, {
    onCompleted: (d) => toast.success(d.pretaaHealthUpdateCareTeamType),
    onError: (e) => catchError(e, true),
  });

  // update the state when page will be changed
  useEffect(() => {
    dispatch(
      appSliceActions.setCareTeamTypeLabels({
        remoteData: careTeamTypes,
        formattedData: formatCareTeamTypeArr(careTeamTypes),
      }),
    );
  }, [updatedCareTeam]);

  return (
    <>
      <ContentHeader title="Care Team types " />
      <div className='bg-white'>
      <ContentFrame>
        <div className='pb-28'>
          <div className="border-solid border-2 rounded-xl px-4 care-team-header-box py-3 xl:w-5/12">
            <label className='text-base font-normal'>
              Pretaa provides default Care Team types. You may change the names of these types to better suit your
              organization.
            </label>
            <div className=" flex flex-row space-x-2 pt-4 pb-3 ">
              <Exclamation className='w-6 h-6' />
              <label className=" font-semibold text-base ">Changes made here will affect all of your Facilities</label>
            </div>
          </div>

          <div className=" flex flex-col w-full mt-5 space-y-4">
            {!loading &&
              careTeamTypes.map((type, i) => (
                <CareTeam
                  key={type.defaultValue}
                  setCareTeamTypes={setCareTeamTypes}
                  index={i}
                  {...type}
                />
              ))}
            {loading && <CareTeamLoading />}
          </div>
        </div>
      </ContentFrame>
      <ContentFooter className=" fixed bottom-0 w-full">
        <div className="flex space-x-4">
          <Button
            disabled={loading || updateCareTeamTypeLoading}
            loading={updateCareTeamTypeLoading}
            type="button"
            onClick={() => {
              const payload = {};
              careTeamTypes.forEach((e) => {
                payload[e.enumType] = e.updatedValue || e.defaultValue;
              });

              updateCareTypesCallBack({
                variables: payload,
              });
            }}>
            Save
          </Button>
          <Button
            onClick={() => navigate(-1)}
            disabled={updateCareTeamTypeLoading}
            type="button"
            buttonStyle="bg-none">
            Cancel
          </Button>
        </div>
      </ContentFooter>
      </div>
    </>
  );
}
