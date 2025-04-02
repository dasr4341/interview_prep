import { customStyleSelectBox, OptionItem } from 'components/ui/SelectBox';
import {
  CompaniesFilter,
  GetCompanies,
  GetCompaniesVariables,
  GetReferenceSearchCompanies,
  GetReferenceSearchCompaniesVariables,
  OrderType,
} from 'generatedTypes';
import { GetCompaniesQuery } from 'lib/query/company/get-companies';
import { GetReferenceSearchCompaniesQuery } from 'lib/query/company/get-reference-search-companies';
import AsyncSelect from 'react-select/async';
import { useLazyQuery } from '@apollo/client';
import { useState, useEffect } from 'react';
import _ from 'lodash';
import { client } from 'apiClient';

interface SelectOptions {
  value: any;
  label: string;
  type?: string;
}

export default function CompanySearch({
  className,
  onchange,
  selectedValue,
  companyId,
  componentId,
  componentName,
  classNamePrefix,
  isDashboardScreen,
  placeholder,
  isReference,
}: {
  className: string;
  companyId?: string;
  componentId: string;
  componentName: string;
  selectedValue: SelectOptions | null;
  isSearchable?: boolean;
  isLoading?: boolean;
  classNamePrefix?: string;
  isDashboardScreen?: boolean;
  placeholder?: string;
  isReference?: boolean;

  onchange: (company: SelectOptions) => void;
}) {
  // Hooks for getting all companies
  const [getCompanies, { loading: isCompaniesLoading, data: companyData }] = useLazyQuery<
    GetCompanies,
    GetCompaniesVariables
  >(GetCompaniesQuery);

  const [getReferenceCompanies, { loading: isReferenceCompaniesLoading, data: referenceCompanyData }] = useLazyQuery<
    GetReferenceSearchCompanies,
    GetReferenceSearchCompaniesVariables
  >(GetReferenceSearchCompaniesQuery);

  const [companyList, setCompanyList] = useState<SelectOptions[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<SelectOptions | null>(null);

  useEffect(() => {
    setSelectedCompany(selectedValue);
  }, [selectedValue]);

  // Fething all the companies for the first time
  useEffect(() => {
    if (!isReference) {
      getCompanies({
        variables: {
          getFilteredCompaniesFilterList: [],
          getFilteredCompaniesSearchPhrase: '',
          getFilteredCompaniesSkip: 0,
          getFilteredCompaniesOrder: 'name',
          getFilteredCompaniesOrderBy: OrderType.ASC,
          excludeId: String(companyId),
          filterObj: {},
        },
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getCompanies]);

  // Fething all the companies for the first time
  useEffect(() => {
    if (isReference) {
      getReferenceCompanies({
        variables: {
          excludeId: String(companyId),
          searchPhrase: '',
          skip: 0,
        },
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getReferenceCompanies]);

  // Mapping the companyData to integrate with `Select` component
  useEffect(() => {
    if (companyData) {
      const mapperCompanies = companyData?.pretaaGetFilteredCompanies?.map((company) => ({
        label: company.name,
        value: company.id,
        type: company.companyType,
      }));

      setCompanyList(() => {
        if (isDashboardScreen) {
          return [{ label: 'All Companies', value: CompaniesFilter.ALL_COMPANIES }, ...mapperCompanies];
        } else return mapperCompanies;
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyData]);

  // Mapping the companyData to integrate with `Select` component
  useEffect(() => {
    if (referenceCompanyData) {
      const mapperCompanies = referenceCompanyData?.pretaaSearchCompanies?.map((company) => ({
        label: company.name,
        value: company.id,
      }));

      setCompanyList(() => {
        if (isDashboardScreen) {
          return [{ label: 'All Companies', value: CompaniesFilter.ALL_COMPANIES }, ...mapperCompanies];
        } else return mapperCompanies;
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [referenceCompanyData]);

  const loadOptions = async (phrase: string, callback: any) => {
    if (isReference) {
      const result = await client.query<GetReferenceSearchCompanies, GetReferenceSearchCompaniesVariables>({
        query: GetReferenceSearchCompaniesQuery,
        variables: {
          excludeId: String(companyId),
          searchPhrase: phrase,
          skip: 0,
        },
      });
      if (result.data.pretaaSearchCompanies) {
        const mapperCompanies = result.data.pretaaSearchCompanies.map((company) => ({
          label: company.name,
          value: company.id,
        }));

        callback(mapperCompanies);
      }
    } else {
      const result = await client.query<GetCompanies, GetCompaniesVariables>({
        query: GetCompaniesQuery,
        variables: {
          getFilteredCompaniesFilterList: [],
          getFilteredCompaniesSearchPhrase: phrase,
          getFilteredCompaniesSkip: 0,
          getFilteredCompaniesOrder: 'name',
          getFilteredCompaniesOrderBy: OrderType.ASC,
          excludeId: String(companyId),
          filterObj: {},
        },
      });

      if (result.data.pretaaGetFilteredCompanies) {
        const mapperCompanies = result.data.pretaaGetFilteredCompanies.map((company) => ({
          label: company.name,
          value: company.id,
          type: company.companyType,
        }));

        callback(mapperCompanies);
      }
    }
  };

  // Debounced search
  const delayedCallback = _.debounce(loadOptions, 1000);

  const handleInputChange = (phrase: string, callback: any) => {
    delayedCallback(phrase, callback);
  };

  return (
    <AsyncSelect
      name={componentName}
      id={componentId}
      classNamePrefix={classNamePrefix}
      className={className}
      styles={customStyleSelectBox}
      defaultOptions={companyList}
      loadOptions={handleInputChange}
      value={selectedCompany}
      isLoading={isReference ? isReferenceCompaniesLoading : isCompaniesLoading}
      placeholder={placeholder || 'Select...'}
      components={{
        Option: OptionItem,
      }}
      onChange={(company) => {
        if (company) {
          setSelectedCompany(company);
          onchange(company);
        }
      }}
      options={[]}
    />
  );
}
