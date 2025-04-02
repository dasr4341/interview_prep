/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { ColDef, GridApi, GridReadyEvent } from '@ag-grid-enterprise/all-modules';
import '@ag-grid-enterprise/all-modules/dist/styles/ag-grid.css';
import '@ag-grid-enterprise/all-modules/dist/styles/ag-theme-alpine.min.css';
import { GetDynamicCompanyFields_pretaaDynamicCompanyFields, GetCompanyMngtList_getFilteredCompaniesAdmin } from 'generatedTypes';
import companyMngtApi from 'lib/api/companyManagement';
import catchError from 'lib/catch-error';
import AgGrid from 'components/ui/ag-grid/AgGrid';
import queryString from 'query-string';
import CompanyNameCell from './components/CompanyNameCell';
import { useParams } from 'react-router-dom';
import { TrackingApi } from 'components/Analytics';
import { routes } from 'routes';

export default function UserCompanyListScreen() {
  let api: GridApi | null = null;
  const params = useParams() as { id: string };
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([]);
  const [companyList, setCompanyList] = useState<GetCompanyMngtList_getFilteredCompaniesAdmin[]>([]);
  const [companyFields, setCompanyFields] = useState<GetDynamicCompanyFields_pretaaDynamicCompanyFields[]>([]);

  let hideLoadMore = false;
  const pageLimit = 50;
  const query: { companyId?: string } = queryString.parse(location.search);

  // Add selected users to Ag grid UI
  function setSelectedCompany() {
    const companies = localStorage.getItem('existingCompanies');
    const existingCompanies = companies ? JSON.parse(companies) : null;

    api?.forEachNodeAfterFilter((node) => {
      const company: GetCompanyMngtList_getFilteredCompaniesAdmin = node.data;
      if (existingCompanies.includes(company.id)) {
        node.setSelected(true);
      }
    });
  }

  useEffect(() => {
    if (!query.companyId) {
      localStorage.removeItem('existingCompanies');
    }
  }, [query.companyId]);

  async function initData() {
    try {
      api?.showLoadingOverlay();
      const fields = await companyMngtApi.getDynamicFields();
      const companies = await companyMngtApi.getUserCompanies({
        query: {
          take: pageLimit,
          userId: params.id,
        },
        fields,
      });
      setCompanyFields(fields);
      const colDefs: ColDef[] = fields.map((f) => {
        const colDef: ColDef = {
          colId: String(f.id),
          headerName: f.fieldLabel,
          field: f.fieldName,
          hide: f.display ? false : true,
          filter: true,
          filterParams: {
            newRowsAction: 'keep',
            filterOptions: null,
            suppressAndOrCondition: true,
          },
        };

        if (f.fieldName === 'name') {
          colDef.cellRenderer = 'nameCell';
        }

        return colDef;
      });
      console.log(colDefs);
      setColumnDefs(colDefs);
      setCompanyList(companies);
      api?.setRowData(companies);
      hideLoadMore = companies.length < pageLimit;
      api?.hideOverlay();
      if (query?.companyId) setSelectedCompany();
    } catch (error) {
      api?.hideOverlay();
      console.log(error);
    }
  }

  async function loadMore() {
    if (hideLoadMore) {
      return;
    }

    api?.showLoadingOverlay();
    const companies = await companyMngtApi.getUserCompanies({
      query: {
        userId: params.id,
        take: pageLimit,
        skip: companyList.length,
      },
      fields: companyFields,
    });
    hideLoadMore = companies.length < pageLimit;
    api?.setRowData(companyList.concat(companies));
    setCompanyList(companyList.concat(companies));
    api?.hideOverlay();
  }

  const handleGridReady = (e: GridReadyEvent) => {
    api = e.api;
    initData();
  };

  async function changeVisibility(id: number, display: boolean) {
    try {
      await companyMngtApi.changeFieldVisibility(id, display);
    } catch (e) {
      catchError(e, true);
    }
  }

  async function updateColumnOrder(cols: number[]) {
    try {
      await companyMngtApi.changeFieldOrder(cols);
    } catch (e) {
      catchError(e, true);
    }
  }

  async function searchUser() {
    const companies = await companyMngtApi.getUserCompanies({
      query: {
        take: pageLimit,
        userId: params.id,
      },
      fields: companyFields,
    });
    hideLoadMore = companies.length < pageLimit;
    api?.setRowData(companies);
    setCompanyList(companies);
    console.log(`total user length: ${companyList.concat(companies).length}`);
  }

  function handleSelectedRow(data: GetCompanyMngtList_getFilteredCompaniesAdmin, isSelected: boolean | undefined) {
    console.log(data, isSelected);
  }

  useEffect(() => {
    TrackingApi.log({
      pageName: routes.userCompanyAccess.name,
    });
  }, []);

  return (
    <div className="ag-theme-alpine" style={{ height: '100vh', width: '100%' }}>
      <AgGrid
        frameworkComponents={{
          nameCell: CompanyNameCell,
        }}
        rowData={companyList}
        columnDefs={columnDefs}
        handleGridReady={(e) => handleGridReady(e)}
        changeVisibility={changeVisibility}
        updateColumnOrder={updateColumnOrder}
        rowSearch={searchUser}
        handleRowSelection={({ data, isSelected }) => handleSelectedRow(data, isSelected)}
      />
    </div>
  );
}
