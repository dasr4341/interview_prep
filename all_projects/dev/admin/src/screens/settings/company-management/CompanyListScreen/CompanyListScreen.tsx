/* eslint-disable react-hooks/exhaustive-deps */
import { ContentHeader } from 'components/ContentHeader';
import { SearchField } from 'components/SearchField';
import React, { useEffect, useState } from 'react';
import { ContentFrame } from 'components/content-frame/ContentFrame';
import { ColDef, GridApi, GridReadyEvent } from '@ag-grid-enterprise/all-modules';
import '@ag-grid-enterprise/all-modules/dist/styles/ag-grid.css';
import '@ag-grid-enterprise/all-modules/dist/styles/ag-theme-alpine.min.css';
import { GetDynamicCompanyFields_pretaaDynamicCompanyFields, GetCompanyMngtList_getFilteredCompaniesAdmin, UserPermissionNames } from 'generatedTypes';
import companyMngtApi from 'lib/api/companyManagement';
import catchError from 'lib/catch-error';
import AgGrid, { isFirstColumn } from 'components/ui/ag-grid/AgGrid';
import { useDispatch } from 'react-redux';
import { companyManagementActions } from 'lib/store/slice/company-management';
import { ContentFooter } from 'components/content-footer/ContentFooter';
import Button from 'components/ui/button/Button';
import { routes } from 'routes';
import { useLocation, useNavigate } from 'react-router-dom';
import queryString from 'query-string';
import CompanyNameCell from './components/CompanyNameCell';
import usePermission from 'lib/use-permission';
import './CompanyListScreen.scss';
import { config } from 'config';
import { TrackingApi } from 'components/Analytics';

let gridApi: GridApi | null = null;

export default function CompanyListScreen() {
  const locationData = useLocation();
  const pageLimit = config.pagination.limit;
  const query: { companyId?: string; selectedCompany?: string } = queryString.parse(locationData.search);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([]);
  const [searchText, setSearchText] = useState<string>('');
  const [columnName, setColumnName] = useState<string>('');
  const [columnSearch, setColumnSearch] = useState<string>('');
  const [companyList, setCompanyList] = useState<GetCompanyMngtList_getFilteredCompaniesAdmin[]>([]);
  const [companyFields, setCompanyFields] = useState<GetDynamicCompanyFields_pretaaDynamicCompanyFields[]>([]);
  const [hideLoadMore, setHideLoadMore] = useState(false);
  const permissions = usePermission(UserPermissionNames.LISTS);

  useEffect(() => {
    return () => {
      gridApi = null;
    };
  }, []);

  const [page, setPage] = useState(1);

  let deletedCompaniesID: Array<string> = [];
  let selectedCompaniesID: Array<string> = [];

  /**
   * This updates UI checkbox when data is loaded from server
   */
  function setSelectedCompany() {
    gridApi?.forEachNode((node) => {
      const rowData: GetCompanyMngtList_getFilteredCompaniesAdmin = node.data;

      if (
        (rowData.listCompanies.find((group) => group.listId === query.companyId) && !deletedCompaniesID.includes(rowData.id)) ||
        (!rowData.listCompanies.find((group) => group.listId === query.companyId) && selectedCompaniesID.includes(rowData.id))
      ) {
        // This executes when existing row present
        // This executes when adding new row in list
        node.setSelected(true);
      }
    });
  }

  /**
   * It fetches the dynamic fields from the server, filters the default fields, fetches the companies from the server, sets
   * the column definitions, sets the company list, sets the row data, hides the load more button, hides the overlay, and
   * sets the selected company
   */
  async function initData() {
    try {
      gridApi?.showLoadingOverlay();
      const fields = await companyMngtApi.getDynamicFields();
      const filteredFields = fields.filter((field) => field.isDefault);

      let companies = [];

      if (query.selectedCompany) {
        console.log('get selected company list only');

        companies = await companyMngtApi.getSelectedCompanies({
          fields: filteredFields,
          query: {
            listId: query.companyId || '',
            take: pageLimit,
          },
        });
      } else {
        companies = await companyMngtApi.getCompanies({
          query: {
            take: pageLimit,
            filterList: [],
            filterObj: {},
            where: {
              listId: {
                equals: query.companyId,
              },
            },
          },
          fields: filteredFields,
        });
      }

      setCompanyFields(filteredFields);
      const colDefs: ColDef[] = filteredFields.map((f) => {
        const colDef: ColDef = {
          colId: String(f.id),
          headerName: f.fieldLabel,
          field: f.fieldName,
          hide: f.display ? false : true,
          filter: true,
          filterParams: {
            newRowsAction: 'keep',
            filterOptions: ['contains'],
            defaultOption: 'contains',
            suppressAndOrCondition: true,
          },
          headerCheckboxSelection: isFirstColumn,
          checkboxSelection: isFirstColumn,
        };

        if (f.fieldName === 'name') {
          colDef.cellRenderer = 'nameCell';
        }

        return colDef;
      });
      setColumnDefs(colDefs);
      setCompanyList(companies);
      gridApi?.setRowData(companies);
      setHideLoadMore(companies.length < pageLimit);
      gridApi?.hideOverlay();

      setSelectedCompany();
    } catch (error) {
      gridApi?.hideOverlay();
      console.log(error);
    }
  }

  /**
   * It loads paginated data from the server.
   * @param {'prev' | 'next'} type - 'prev' | 'next'
   * @returns a promise.
   */
  async function loadMore(type: 'prev' | 'next', e?: any) {
    gridApi = e;

    // Do not fetch next page data because next page has no data
    // or Do not fetch prev page data because no prev page exist
    if ((hideLoadMore && type === 'next') || (page - 1 === 0 && type === 'prev')) {
      return;
    }

    let phrase = '';
    if (searchText) phrase = searchText;
    if (!searchText && columnName) phrase = columnSearch;

    gridApi?.showLoadingOverlay();

    let skip = 0;
    if (type === 'next') {
      skip = page * pageLimit;
      setPage(page + 1);
    } else {
      skip = (page - 2) * pageLimit;
      setPage(page - 1);
    }

    let companies = [];

    if (query.selectedCompany) {
      companies = await companyMngtApi.getSelectedCompanies({
        fields: companyFields,
        query: {
          listId: query.companyId || '',
          take: pageLimit,
          filterList: [],
          skip: skip,
          filterObj: {},
          searchColumn: columnName ? columnName : '',
          searchPhrase: phrase,
        },
      });
    } else {
      companies = await companyMngtApi.getCompanies({
        query: {
          take: pageLimit,
          filterList: [],
          skip: skip,
          filterObj: {},
          searchColumn: columnName ? columnName : '',
          searchPhrase: phrase,
        },
        fields: companyFields,
      });
    }

    setHideLoadMore(companies.length < pageLimit);
    gridApi?.setRowData(companies);
    setCompanyList(companies);
    setSelectedCompany();
    gridApi?.hideOverlay();
  }

  /**
   * It sets the grid api to the grid api of the event and fetch data first time
   * @param {GridReadyEvent} e - GridReadyEvent - this is the event that is fired when the grid is ready.
   */
  const handleGridReady = (e: GridReadyEvent) => {
    console.log('grid event', e);
    gridApi = e.api;
    initData();
  };

  /**
   * It changes the visibility of a field in the database
   * @param {number} id - the id of the field you want to change the visibility of
   * @param {boolean} display - boolean - true if the field is to be displayed, false if it is to be hidden
   */
  async function changeVisibility(id: number, display: boolean) {
    try {
      await companyMngtApi.changeFieldVisibility(id, display);
    } catch (e) {
      catchError(e, true);
    }
  }

  /**
   * Update the column order in the database
   * @param {number[]} cols - number[] - an array of column ids in the order you want them to be displayed
   */
  async function updateColumnOrder(cols: number[]) {
    try {
      await companyMngtApi.changeFieldOrder(cols);
    } catch (e) {
      catchError(e, true);
    }
  }

  async function searchUser(column: string, searchPhrase: string | null) {
    console.log(column, searchPhrase);
    // setSearchText('');
    // setColumnName(column);
    // setColumnSearch(searchPhrase as string);
    // const companies = await companyMngtApi.getCompanies({
    //   query: {
    //     take: pageLimit,
    //     filterList: [],
    //     filterObj: {},
    //     searchColumn: column,
    //     searchPhrase,
    //   },
    //   fields: companyFields,
    // });
    // hideLoadMore = companies.length < pageLimit;
    // gridApi?.setRowData(companies);
    // setCompanyList(companies);
    // console.log(`total user length: ${companyList.concat(companies).length}`);
  }

  async function searchCompanies(value: string) {
    setSearchText(value);
    setColumnName('');
    setColumnSearch('');
    const companies = await companyMngtApi.getCompanies({
      query: {
        take: pageLimit,
        filterList: [],
        filterObj: {},
        searchPhrase: value,
      },
      fields: companyFields,
    });
    setHideLoadMore(companies.length < pageLimit);
    gridApi?.setRowData(companies);
    setCompanyList(companies);
    setSelectedCompany();
  }

  function handleRowSelection({ data, isSelected }: { data: GetCompanyMngtList_getFilteredCompaniesAdmin; isSelected: boolean }) {
    setTimeout(() => {
      if (isSelected === false && data.listCompanies.find((g) => g.listId === query.companyId)) {
        deletedCompaniesID = [...deletedCompaniesID, data.id];
      } else if (isSelected && data.listCompanies.find((g) => g.listId === query.companyId)) {
        deletedCompaniesID = deletedCompaniesID.filter((x) => x !== data.id);
      } else if (isSelected === true) {
        selectedCompaniesID = [...selectedCompaniesID, data.id];
      } else if (isSelected === false) {
        selectedCompaniesID = selectedCompaniesID.filter((x) => x !== data.id);
      }
    }, 10);
  }

  function updateCompanyGroup() {
    console.log({ selectedCompaniesID, deletedCompaniesID, selectedList: gridApi?.getSelectedRows().length });
    dispatch(companyManagementActions.updateSelectedCompanies(selectedCompaniesID));
    dispatch(companyManagementActions.updateDeleteCompanies(deletedCompaniesID));
    if (gridApi?.getSelectedRows().length) {
      dispatch(companyManagementActions.countSelectedCompanies(Number(gridApi?.getSelectedRows().length)));
    } else {
      dispatch(companyManagementActions.countSelectedCompanies(0));
    }

    if (query.companyId) {
      navigate(routes.companyGroupEdit.build(String(query?.companyId)));
    } else {
      navigate(routes.companyGroupCreate.match);
    }
  }

  useEffect(() => {
    TrackingApi.log({
      pageName: routes.companyList.name,
    });
  }, []);

  function manageCompanies() {
    if (query?.companyId) {
      navigate(
        routes.companyList.build({
          companyId: query?.companyId,
        })
      );
    } else {
      location.href = routes.companyList.build();
    }
  }

  return (
    <div className="h-screen flex flex-col company-list">
      <ContentHeader title={query.selectedCompany ? 'Selected Company Management' : 'Company Management'}>
        <div className="grid grid-cols-1 md:grid-cols-2">
          <SearchField defaultValue={searchText} label={searchText.length > 0 ? searchText : 'Search for name'} onSearch={(value) => searchCompanies(value)} />
          {query.selectedCompany && (
            <Button classes="md:absolute md:right-4 xl:right-10 2xl:right-16 md:bottom-10" text="Manage Companies" type="button" onClick={manageCompanies} />
          )}
        </div>
      </ContentHeader>
      <ContentFrame type="footer-with-noscroll" classes={['pb-0', 'flex', 'flex-col', 'flex-1']}>
        <div className="p-5 lg:p-16 flex flex-col flex-1">
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
            handleRowSelection={(e: any) => handleRowSelection(e)}
            pagination={{
              onNextPage: (e) => loadMore('next', e),
              onPrevPage: (e) => loadMore('prev', e),
              page,
              prevEnabled: true,
              nextEnabled: true,
            }}
          />
        </div>
      </ContentFrame>

      <ContentFooter>
        <div className="flex-1">
          {query?.companyId && permissions?.capabilities.EDIT && (
            <Button classes="mx-auto md:mx-0 mb-4 md:mb-0" onClick={() => updateCompanyGroup()}>
              Update Company List
            </Button>
          )}
          {!query?.companyId && permissions?.capabilities.CREATE && (
            <Button classes="mx-auto md:mx-0 mb-4 md:mb-0" onClick={() => updateCompanyGroup()}>
              Create Company List
            </Button>
          )}
        </div>
      </ContentFooter>
    </div>
  );
}
