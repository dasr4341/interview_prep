import { ContentFrame } from 'components/content-frame/ContentFrame';
import Button from 'components/ui/button/Button';
import { UserPermissionNames } from 'health-generatedTypes';
import useGetPrivilege, { CapabilitiesType } from 'lib/getPrivilege';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { routes } from 'routes';
import { useElementSize } from '@mantine/hooks';
import { HeaderContext } from 'components/ContentHeaderContext';
import CustomSearchField from 'components/CustomSearchField';
import queryString from 'query-string';

export default function StandardTemplateScreenLayout() {
  const location = useLocation();
  const noOfRerender = useRef<number>(0);
  const [searchedPhase, setSearchedPhase] = useState(''
  );
  const [clearSearchField, setClearSearchField] = useState<boolean>(false);
  const navigate = useNavigate();
  const surveyCreatePrivilege = useGetPrivilege(UserPermissionNames.SURVEY_TEMPLATES, CapabilitiesType.CREATE);

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
          <div className="my-2 md:my-0">
            {surveyCreatePrivilege && location.pathname.includes('custom') && (
              <Button
                className="w-fit mt-3 sm:mt-0"
                onClick={() => navigate(routes.templateForm.match)}
                text="Create"
              />
            )}
          </div>
        </div>
        <div className="flex items-center space-x-4 md:mt-3">
          <CustomSearchField
            defaultValue={searchedPhase}
            onChange={setSearchedPhase}
            clear={clearSearchField}
          />
        </div>

        {/* Accordion link */}
        <div className="flex mt-6 pt-2 md:pt-0 space-x-6 bg-white">
          <NavLink
            to={routes.standardTemplate.match}
            onClick={() => setSearchedPhase('')}
            className={({ isActive }) =>
              `py-1 px-4 text-primary mr-2 font-bold  ${isActive ? 'activeTabClasses' : ''}`
            }>
            Clinical
          </NavLink>
          <NavLink
           onClick={() => setSearchedPhase('')}
            to={routes.customTemplate.match}
            className={({ isActive }) =>
              `py-1 px-4 text-primary mr-2 font-bold  ${isActive ? 'activeTabClasses' : ''}`
            }>
            Custom
          </NavLink>
        </div>
      </header>
      <ContentFrame className="h-full relative pt-5">
        {!!searchedPhase.length && (
          <div className="flex flex-row justify-end items-center pb-4 px-5 lg:px-16 sm:px-15 absolute right-6 top-2">
            <div
              className="text-sm font-medium underline text-gray-150 cursor-pointer"
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
