/* eslint-disable react-hooks/exhaustive-deps */
import { useQuery } from '@apollo/client';
import { GetUseCaseDetails } from 'generatedTypes';
import { GetUseCaseDetailsQuery } from 'lib/query/usecase/get-usecase-details';

export default function UseCaseDetailsScreen({ useCaseId }: { useCaseId: number }) {
  // Hooks for getting one existing use case details
  const { data: useCase } = useQuery<GetUseCaseDetails>(GetUseCaseDetailsQuery, {
    variables: {
      where: {
        id: {
          equals: useCaseId,
        },
      },
    },
  });

  return (
    <div>
      <ul>
        {useCase?.pretaaGetUseCaseCollections[0]?.useCasesOnCollections?.map((item, index) => {
          return (
            <li key={item.id}>
              <div className="flex items-center border-b border-gray-500 opacity-50">
                <div className="px-6 lg:px-9 py-3 flex-1">
                  <label htmlFor={`id-${index}`}>
                    <input
                      type="checkbox"
                      id={`id-${index}`}
                      className={`appearance-none h-5 w-5 border mr-4
                    border-primary-light
                    checked:bg-primary- light checked:border-transparent
                    rounded-md form-tick`}
                      checked={item.status}
                      disabled
                    />
                    {item?.useCase?.displayName}
                  </label>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
