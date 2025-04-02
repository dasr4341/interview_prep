/*  */
import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { routes } from 'routes';
import queryString from 'query-string';

import { ContentHeader } from 'components/ContentHeader';
import Button from 'components/ui/button/Button';
import SurveyListTemplate from './components/SurveyListTemplate';
import { Virtuoso } from 'react-virtuoso';
import { useLazyQuery } from '@apollo/client';
import { ownerGetTemplatesQuery } from 'graphql/ownerGetTemplates.query';
import { OwnerGetTemplates, OwnerGetTemplatesVariables, OwnerGetTemplates_pretaaHealthAdminGetTemplates } from 'health-generatedTypes';
import { config } from 'config';
import catchError from 'lib/catch-error';
import NoDataFound from 'components/NoDataFound';
import SearchField from 'components/SearchField';
import { useElementSize } from '@mantine/hooks';
import SurveyListSkeletonLoading from './skeletonLoading/SurveyListSkeletonLoading';

export interface OwnerTemplateListStateInterface {
  data: OwnerGetTemplates_pretaaHealthAdminGetTemplates[];
  moreData: boolean;
}

export default function SurveyList() {
  const [searchedPhase, setSearchedPhase] = useState<string>('');
  const noOfRerender = useRef<number>(-1);
  const navigate = useNavigate();
  const [templateListState, setTemplateListState] = useState<OwnerTemplateListStateInterface>({
    moreData: true,
    data: [],
  });

  function changeSearchedPhase(searchData: string) {
    noOfRerender.current = noOfRerender.current + 1;
    setSearchedPhase(searchData);
  }

  useEffect(() => {
    if (noOfRerender.current) {
      navigate(`?${queryString.stringify({ searchedPhase })}`, { replace: true });
    }
  }, [searchedPhase]);

  const [getTemplatesCallBack, { loading: getTemplateLoading }] = useLazyQuery<
    OwnerGetTemplates,
    OwnerGetTemplatesVariables
    >(ownerGetTemplatesQuery, {
      variables: {
        take: config.pagination.defaultTake,
        skip: 0,
        searchPhrase: searchedPhase
      },
    onCompleted: (d) => {
      if (d.pretaaHealthAdminGetTemplates) {
        const prevData = templateListState.data;
        setTemplateListState({
          data: prevData.concat(d.pretaaHealthAdminGetTemplates),
          moreData: d.pretaaHealthAdminGetTemplates.length === config.pagination.defaultTake,
        });
      }
    },
    onError: (e) => catchError(e, true),
  });

  function handleEndReach() {
    if (templateListState.moreData) {
      getTemplatesCallBack({
        variables: {
          skip: templateListState.data.length,
        },
      });
    }
  }

  function rowRendererVirtue(i: number, e: OwnerGetTemplates_pretaaHealthAdminGetTemplates) {
    return <SurveyListTemplate templateData={e} updateListHandler={setTemplateListState} />;
  }

  function footerComponent() {
    if (templateListState.moreData) {
      return <SurveyListSkeletonLoading />;
    }
    else 
    return <div className="p-4 text-center text-gray-150 text-sm bg-gray-100">No more data</div>;
  }

  useEffect(() => {
    setTemplateListState({
      data: [],
      moreData: true,
    });
    getTemplatesCallBack();

    // 
  }, [searchedPhase]);

  const { ref, height } = useElementSize();
  const gridHeight = { height: window.innerHeight - height };

  return (
    <>
      <div className='flex flex-col flex-1'>
        <div ref={ref}>
          <ContentHeader disableGoBack={true}>
            <div className="flex items-center justify-between pt-3 mb-5">
              <div>
                <h1 className="h1 leading-none text-primary font-bold text-md lg:text-lg pr-1 sm:pr-0">Standard Templates</h1>
              </div>
              {/* hiding for now because of backend feature limitation */}
              <div className='hidden'>
                <Link to={routes.owner.addSurvey.match}>
                  <Button className='whitespace-nowrap'>Add</Button>
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
          <SearchField  defaultValue={searchedPhase}
              onChange={changeSearchedPhase} />
          </div>
          </ContentHeader>
        </div>

        <div className="px-6 py-5 md:py-10 lg:px-16 flex flex-col flex-1" style={gridHeight}>
          {getTemplateLoading && !templateListState.data.length && (
            new Array(10).fill(<SurveyListSkeletonLoading />).map((el) => <div key={el}>{el}</div>)
          )}
          {!getTemplateLoading && templateListState.data.length === 0 && 
            <div className='flex flex-auto justify-center'>
              <NoDataFound type={'NODATA'} heading='No templates yet' content='Please wait for next template' />
            </div>
          }

          {!!templateListState.data.length && (
            <Virtuoso
              data={templateListState.data}
              endReached={handleEndReach}
              itemContent={rowRendererVirtue}
              components={{ Footer: footerComponent }}
            />
          )}
        </div>
      </div>
    
    </>
  );
}
