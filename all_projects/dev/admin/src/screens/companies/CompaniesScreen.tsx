/* eslint-disable react-hooks/exhaustive-deps */
import { ContentFrame } from 'components/content-frame/ContentFrame';
import { ContentHeader } from 'components/ContentHeader';
import CompanyFilter from './components/company-filter/CompanyFilter';
import { SearchField } from 'components/SearchField';
import { GetCompanies_pretaaGetFilteredCompanies } from 'generatedTypes';
import _, { range } from 'lodash';
import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { QueryVariables } from 'interface/url-query.interface';
import { ErrorMessage } from '../../components/ui/error/ErrorMessage';
import companyApi from 'lib/api/company';
import catchError from 'lib/catch-error';
import useOnScreen from 'lib/use-onscreen';
import createQueryVariables, { buildQueryURL, parseQueryURL } from 'lib/url-query';
import { CompanyTagLozenge } from 'components/CompanyTagLozenge';
import { FadeOverlay } from 'components/FadeOverlay';
import CompanyName from 'screens/companies/components/CompanyName';
import { routes } from 'routes';
import { DefaultFiltersVariable, DefaultIndustriesVariable, DefaultProductsVariable } from '../../interface/company-interface';
import EmptyFilter from 'components/EmptyFilter';
import { TrackingApi } from 'components/Analytics';

export function Loading() {

  return (
    <>
      {range(0, 5).map((i) => (
        <div className="ph-item" key={i}>
          <div className="ph-col-12">
            <div className="ph-row">
              <div className="ph-col-6"></div>
              <div className="ph-col-4 empty"></div>
              <div className="ph-col-2"></div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

function CompanyRow({ company, testId }: { company: GetCompanies_pretaaGetFilteredCompanies, testId?: string }) {
  return (
    <CompanyName
      name={company?.name || ''}
      starred={Boolean(company?.starredByUser)}
      id={company?.id}
      className={'border-b flex items-center px-6 py-7 last:border-0'}
      isOnClickStar={true}
      testId={testId}
    />
  );
}

export default function CompaniesScreen(): JSX.Element {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = useLocation().search;
  const [filterOptions, setFilterOptions] = useState<any>({});
  const [queryJson, setQueryJson] = useState<any>({});
  const [filteredCompanies, setFilteredCompanies] = useState<GetCompanies_pretaaGetFilteredCompanies[]>();
  const [error, setError] = useState<string | null>(null);
  const [hideLoadMore, setHideLoadMore] = useState(true);
  const loadMoreButton = useRef<any>();
  const loadMoreVisible = useOnScreen(loadMoreButton);
  const [defaultFilters, setDefaultFilters] = useState<DefaultFiltersVariable[]>([]);
  const [defaultProducts, setDefaultProducts] = useState<DefaultProductsVariable[]>([]);
  const [defaultIndustries, setDefaultIndustries] = useState<DefaultIndustriesVariable[]>([]);
  const [isQueryUpdate, setIsQueryUpdate] = useState(false);
  const [searchParamsUpdate, setSearchParamsUpdate] = useState(false);
  const [companiesQueryVar, setCompaniesQueryVar] = useState<any>({
    selectedOptions: {},
    phrase: '',
    skip: 0,
    order: 'name',
    orderBy: 'ASC',
  });

  async function getCompanies(query: QueryVariables) {
    try {
      const companyData = await companyApi().getCompanies(query);
      // Hiding load more if the data length is less than 20
      setHideLoadMore(companyData.length < 20);
      setFilteredCompanies(companyData);
    } catch (e) {
      catchError(e, true);
    }
  }

  const companies = _(filteredCompanies ?? [])
    .sortBy((a) => a.name)
    .groupBy((a) => a.name[0])
    .map((comps, k) => {
      return (
        <div key={k} className="bg-white" data-test-id="company_header">
          <header className="bg-gray-200 font-bold px-3 py-px">{k}</header>
          {comps.map((c) => (
            <CompanyRow company={c} key={c.id} testId="company-row" />
          ))}
        </div>
      );
    })
    .value();

  useEffect(() => {
    TrackingApi.log({
      pageName: routes.companies.name,
    });
  }, []);

  function filterCompanies({ phrase, options }: any) {
    const filterDataObj: any = {};

    if (options && !Array.isArray(options)) {
      Object?.keys(options)?.forEach((key) => {
        if (Array.isArray(options[key])) {
          if (options[key].length > 0) {
            filterDataObj[key] = options[key];
          }
        } else if (options[key] && Object.keys(options[key])?.length > 0) {
          Object.keys(options[key])?.map((key1) => {
            if (!!options[key][key1] || options[key][key1] === 0) {
              if (key === 'npsScore') {
                filterDataObj[key] = { ...filterDataObj[key], [key1]: Number(options[key][key1]) };
              } else {
                filterDataObj[key] = { ...filterDataObj[key], [key1]: options[key][key1] };
              }
            }
          });
        }
      });
    }

    if (options === undefined) {
      options = filterOptions;
    } else if (Object.keys(filterDataObj)?.length > 0) {
      options = filterDataObj;
    } else {
      options = [];
    }

    const urlQuery = buildQueryURL({
      phrase,
      options,
      orderBy: companiesQueryVar.orderBy,
      order: companiesQueryVar.order,
      prevQuery: parseQueryURL(queryParams),
    });

    navigate(`${routes.companies.match}?${urlQuery}`);
    const q = parseQueryURL(urlQuery);
    setFilterOptions(q.options);
    setCompaniesQueryVar({
      ...companiesQueryVar,
      ...createQueryVariables(q),
    });
  }

  async function loadMore() {
    setError(null);
    try {
      const prevEvents = filteredCompanies ? filteredCompanies : [];

      const query = {
        ...companiesQueryVar,
        skip: prevEvents.length,
      };
      const newCompanies = await companyApi().getCompanies(query);
      const allData = prevEvents.concat(newCompanies) as unknown as GetCompanies_pretaaGetFilteredCompanies[];
      setFilteredCompanies(allData);

      // Hiding load more if the data length is less than 20
      setHideLoadMore(newCompanies.length < 20);
    } catch (e: any) {
      console.log(e);
      setError(e.message);
    }
  }

  useEffect(() => {
    const companyData: any = companiesQueryVar;
    companyData.selectedOptions = filterOptions;
    if (searchParamsUpdate) {
      getCompanies(companyData);
    }
  }, [companiesQueryVar, filterOptions]);

  // Calling loadMore() if the data length is more than 20
  useEffect(() => {
    if (loadMoreVisible && !hideLoadMore) {
      loadMore();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadMoreVisible]);

  useEffect(() => {
    // * Info: Get query from URL and create GQL query
    const q = parseQueryURL(queryParams);
    setFilterOptions(q.options);
    setQueryJson(q);

    if (Object.keys(q).length && q?.options?.length) {
      setCompaniesQueryVar({
        ...companiesQueryVar,
        ...createQueryVariables(q),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const clearAll = () => {
    return (
      <div
        className="py-1 sm:px-15 px-5 text-right bg-gray-50 w-full
      lg:left-0 lg:-mt-8 lg:z-10">
        <button className="underline font-medium text-sm cursor-pointer text-gray-150" onClick={() => filterCompanies({ phrase: '', options: [] })}>
          Clear All
        </button>
      </div>
    );
  };

  useEffect(() => {
    const prevQuery = parseQueryURL(location.search);
    setQueryJson(prevQuery);
    if (prevQuery?.options) {
      setFilterOptions(prevQuery?.options);
      setSearchParamsUpdate(true);
    }
    if (prevQuery?.options || prevQuery?.phrase) {
      filterCompanies(prevQuery);
      setIsQueryUpdate(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  return (
    <>
      <ContentHeader title="Companies" disableGoBack={true} breadcrumb={false} className="lg:sticky">
        <div className="flex items-center space-x-4 my-3">
          <SearchField
            defaultValue={queryJson?.phrase as string}
            onSearch={(phrase) => {
              filterCompanies({ phrase });
            }}
          />
          <CompanyFilter
            selectedOptions={filterOptions}
            onChange={(options) => {
              filterCompanies({ options });
            }}
            defaultFilters={defaultFilters}
            setDefaultFilters={setDefaultFilters}
            defaultProducts={defaultProducts}
            setDefaultProducts={setDefaultProducts}
            defaultIndustries={defaultIndustries}
            setDefaultIndustries={setDefaultIndustries}
            isQueryUpdate={isQueryUpdate}
          />
        </div>
        {!filterOptions.length && (
          <div
            className="flex flex-shrink-0 flex-row flex-wrap w-full pr-4
           select-none -mr-16 no-scrollbar pb-4">
            <CompanyTagLozenge
              onChange={(options) => {
                filterCompanies({ options });
              }}
              tags={filterOptions}
              defaultProducts={defaultProducts}
              defaultIndustries={defaultIndustries}
            />
          </div>
        )}
        <FadeOverlay />
      </ContentHeader>
      <ContentFrame className="flex flex-col flex-1">
        {(Object.keys(filterOptions).length > 0 || queryJson?.phrase) && clearAll()}
        {error && <ErrorMessage message={error} />}
        {filteredCompanies?.length === 0 && <EmptyFilter />}
        {companies.length === 0 && filteredCompanies?.length !== 0 && <Loading />}
        {companies}
        <div className="text-center invisible" ref={loadMoreButton}>
          <button className="btn btn-primary mt-4" onClick={() => loadMore()}>
            Load More
          </button>
        </div>
        {!hideLoadMore && <Loading />}
      </ContentFrame>
    </>
  );
}
