import React, { useContext, useEffect, useRef, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import queryString from 'query-string';

import { routes } from 'routes';
import { ContentFrame } from 'components/content-frame/ContentFrame';
import { SurveyTemplateTypes } from 'health-generatedTypes';
import { useElementSize } from '@mantine/hooks';
import { HeaderContext } from 'components/ContentHeaderContext';
import CustomSearchField from 'components/CustomSearchField';

export default function AssessmentTemplateLayout() {
  const navigate = useNavigate();
  const noOfRerender = useRef<number>(0);
  const [searchedPhase, setSearchedPhase] = useState('');
  const [clearSearchField, setClearSearchField] = useState<boolean>(false);

  const clearAll = () => {
    setClearSearchField(!clearSearchField);
    setSearchedPhase('');
  };

  const { ref, height } = useElementSize();
  const { setHeaderHeight } = useContext(HeaderContext);

  useEffect(() => {
    if (height) {
      setHeaderHeight(height);
    }
  }, [height]);

  useEffect(() => {
    if (noOfRerender.current) {
      navigate(`?${queryString.stringify({ searchedPhase })}`, { replace: true });
    }
    noOfRerender.current = noOfRerender.current + 1;
  }, [searchedPhase, location.pathname]);

  return (
    <>
      <header
        ref={ref}
        className="
        px-6 pt-8 lg:px-16 lg:pt-8 top-0 bg-white z-20 relative
        ">
        <div>
        </div>
        <div className="flex flex-col md:flex-row text-primary mb-5 mt-2">
          <h1
            className="h1 leading-none text-primary font-bold flex-1
              text-md lg:text-lg">
            Assessment Templates
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          <CustomSearchField
            defaultValue={searchedPhase}
            onChange={setSearchedPhase}
            clear={clearSearchField}
          />
        </div>

        <div className="flex mt-6 pt-2 md:pt-0 space-x-6 bg-white">
          <NavLink
           onClick={() => setSearchedPhase('')}
            to={routes.counsellorAssessmentTemplateList.build(SurveyTemplateTypes.STANDARD)}
            className={({ isActive }) =>
              `py-1 px-4 text-primary mr-2 font-bold  ${isActive ? 'activeTabClasses' : ''}`
            }>
            Clinical
          </NavLink>
          <NavLink
           onClick={() => setSearchedPhase('')}
            to={routes.counsellorAssessmentTemplateList.build(SurveyTemplateTypes.CUSTOM)}
            className={({ isActive }) => `py-1 px-4 text-primary font-bold ${isActive ? 'activeTabClasses' : ''}`}>
            Custom
          </NavLink>
        </div>
      </header>
      <ContentFrame className="h-full relative pt-5">
        {!!searchedPhase.length && (
          <div className="flex flex-row justify-end items-center pb-4 px-5 lg:px-16 sm:px-15">
            <div className="text-sm font-medium underline text-gray-150 cursor-pointer"
              onClick={clearAll}>
              Clear all
            </div>
          </div>
        )}
        <Outlet />
      </ContentFrame>
    </>
  );
}
