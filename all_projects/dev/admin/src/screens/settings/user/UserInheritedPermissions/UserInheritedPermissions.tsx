import { ContentFrame } from 'components/content-frame/ContentFrame';
import { ContentHeader } from 'components/ContentHeader';
import UseCasePermissions from './UseCasePermissions';
import DataObjectPermissions from './DataObjectPermissions';
import { useEffect, useState } from 'react';
import useQueryParams from '../../../../lib/use-queryparams';
import { TrackingApi } from 'components/Analytics';
import { routes } from 'routes';

export default function UserInheritedPermission(): JSX.Element {
  const query = useQueryParams();
  const [selectedOption, setSelectedOption] = useState<string>('dataObject');

  useEffect(() => {
    TrackingApi.log({
      pageName: routes.userInheritedPermission.name,
    });
  }, []);

  return (
    <>
      <ContentHeader title={'Inherited Permissions'}>
        {/* Accordion link */}
        <div className="flex bg-white border-b pb-2">
          <div className={`p-2 ${selectedOption === 'dataObject' && 'text-pt-blue-300'} cursor-pointer`} onClick={() => setSelectedOption('dataObject')}>
            Data Objects
          </div>
          <div className={`p-2 ${selectedOption === 'useCase' && 'text-pt-blue-300'} cursor-pointer`} onClick={() => setSelectedOption('useCase')}>
            Use Case
          </div>
        </div>
      </ContentHeader>
      <ContentFrame>
        {selectedOption === 'dataObject' && <DataObjectPermissions dataObjectId={String(query.dataObjectId)} />}
        {selectedOption === 'useCase' && <UseCasePermissions useCaseId={query.useCaseId} />}
      </ContentFrame>
    </>
  );
}
