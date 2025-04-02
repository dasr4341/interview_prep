/*  */
import React, { useEffect, useRef, useState } from 'react';
import { ContentHeader } from 'components/ContentHeader';
import SearchField from 'components/SearchField';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { routes } from 'routes';
import './_patient-survey.scoped.scss';
import queryString from 'query-string';

function buildUrl(route: string, searchedPhase?: any) {
  if (searchedPhase) {
    route = `${route}?${queryString.stringify({ searchedPhase })}`;
  }
  return route;
}

export function getSearchedPhaseQueryData(query: string) {
  if (query) {
    return queryString.parse(query).searchedPhase as string;
  }
  return '';
}

export default function SurveysList() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchedPhase, setSearchedPhase] = useState('');
  const noOfRerender = useRef<number>(0);

  useEffect(() => {
    setSearchedPhase('');

    noOfRerender.current = noOfRerender.current + 1;
  }, [location.pathname]);

  useEffect(() => {
    // page will be navigated if the user hits at -> routes.patientSurveyList.list.match
    // other wise it will not redirect
    // note: if the page always redirects then it will result to an error
    if (
      location.pathname.substring(0, location.pathname.length - 1) ===
      routes.patientSurveyList.list.match
    ) {
      navigate(routes.patientSurveyList.open.match);
    }
    if (noOfRerender.current) {
      navigate(`?${queryString.stringify({ searchedPhase })}`, {
        replace: true,
      });
    }
    noOfRerender.current = noOfRerender.current + 1;
  }, [searchedPhase]);

  return (
    <>
      <ContentHeader
        title="Assessments"
        disableGoBack={true}
        className="shadow-none">
        <div className="flex items-center space-x-4">
          <SearchField
            defaultValue={searchedPhase}
            onChange={(searchedText: string) => setSearchedPhase(searchedText)}
          />
        </div>
      </ContentHeader>
      <div className="flex pt-2 md:pt-0 space-x-6 px-6 lg:px-16 bg-white">
        <NavLink
          to={buildUrl(routes.patientSurveyList.open.match, searchedPhase)}
          className={({ isActive }) =>
            `text-base py-1 font-bold text-primary   ${isActive && 'active'}`
          }>
          Open
        </NavLink>
        <NavLink
          to={buildUrl(routes.patientSurveyList.completed.match, searchedPhase)}
          className={({ isActive }) =>
            `text-base py-1 text-primary  font-bold  ${isActive && 'active'}`
          }>
          Completed
        </NavLink>
      </div>
      <Outlet />
    </>
  );
}
