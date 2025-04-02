/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { ContentFrame } from 'components/content-frame/ContentFrame';
import { ContentHeader } from 'components/ContentHeader';
import { SearchField } from 'components/SearchField';
import { Accordion, AccordionItem, AccordionItemButton, AccordionItemHeading, AccordionItemPanel } from 'react-accessible-accordion';
import 'react-accessible-accordion/dist/fancy-example.css';
import 'scss/components/_data-object-details.scoped.scss';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import Button from 'components/ui/button/Button';
import { useLazyQuery, useMutation } from '@apollo/client';
import { getObjectQuery } from 'lib/query/data-object/get-object';
import {
  CreateDataObject,
  CreateDataObjectVariables,
  GetObject,
  GetObjectVariables,
  GetObject_pretaaListDataObjectCollections,
  SortOrder,
  UpdateDataObject,
  UpdateDataObjectVariables,
  UserPermissionNames,
} from 'generatedTypes';
import { useLocation, useNavigate } from 'react-router-dom';
import queryString from 'query-string';
import { UiDataObject } from 'interface/DataObject.inteface';
import { ContentFooter } from 'components/content-footer/ContentFooter';
import { createDataObject } from 'lib/mutation/data-object/create-data';
import { updateDataObject } from 'lib/mutation/data-object/update-data-object';
import { toast } from 'react-toastify';
import catchError from 'lib/catch-error';
import { routes } from 'routes';
import ConfirmationDialog from 'components/ConfirmationDialog';
import ListIcon from 'components/icons/ListIcon';
import SublistIcon from 'components/icons/SublistIcon';
import { ToggleSwitch } from 'components/ToggleSwitch/ToggleSwitch';
import { BsFillExclamationCircleFill } from 'react-icons/bs';
import Popover from 'components/Popover';
import usePermission from '../../lib/use-permission';
import FilterToggler from 'components/FilterToggler';
import { successList } from '../../lib/message.json';
import EmptyFilter from 'components/EmptyFilter';
import { TrackingApi } from 'components/Analytics';

export function Loading() {
  return (
    <div className="ph-item">
      <div className="ph-col-12">
        <div className="ph-row">
          <div className="ph-col-6"></div>
          <div className="ph-col-4 empty"></div>
          <div className="ph-col-2"></div>
        </div>
        <div className="ph-row">
          <div className="ph-col-4"></div>
          <div className="ph-col-6 empty"></div>
          <div className="ph-col-2"></div>
        </div>
        <div className="ph-row">
          <div className="ph-col-2"></div>
          <div className="ph-col-8 empty"></div>
          <div className="ph-col-2"></div>
        </div>
      </div>
    </div>
  );
}

export default function DataObjectsDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const [dataObject, setDataObject] = useState<GetObject_pretaaListDataObjectCollections>();
  const [confirmDelete, setConfirmNew] = useState(false);
  const query: { id: string; name?: string; search?: string } = queryString.parse(location.search) as any;
  const [accordion, setAccordion] = useState<UiDataObject[]>([]);
  const [selectedAccordion, setSelectedAccordion] = useState<UiDataObject[]>([]);
  const [searchText, setSearchText] = useState<string>('');
  const [openItems, setOpenItems] = useState<Array<string>>(['salesforce', 'zendesk', 'marketo', 'client-saas-platform']);
  const dataObjectPermission = usePermission(UserPermissionNames.DATA_OBJECT_COLLECTIONS);
  const [createData] = useMutation<CreateDataObject, CreateDataObjectVariables>(createDataObject);
  const [updateData, { loading: updateDataLoading }] = useMutation<UpdateDataObject, UpdateDataObjectVariables>(updateDataObject);
  const [getObject, { data: objectGroups, loading }] = useLazyQuery<GetObject, GetObjectVariables>(getObjectQuery);

  const [showList, setShowList] = useState(false);
  const show = () => setShowList(true);
  const hide = () => setShowList(false);

  function getObjectsRows(rows: GetObject) {
    if (Array.isArray(rows?.pretaaListDataObjectCollections) && rows?.pretaaListDataObjectCollections.length) {
      const object = rows?.pretaaListDataObjectCollections;
      const groups = _.groupBy(object[0].dataObjectCollectionOnDataObject, 'dataObject.dataSource.sourceType');

      const data: UiDataObject[] = [];
      Object.keys(groups).forEach((key) => {
        const obj: UiDataObject = {
          isChecked: true,
          name: groups[key][0].dataObject.dataSource.name,
          id: groups[key][0].dataObject.dataSource.name.replaceAll(' ', '-').toLowerCase(),
          objects: groups[key] as any,
        };
        data.push(obj);
      });

      const newData: UiDataObject[] = data.map((group) => {
        return {
          ...group,
          isChecked: group.objects.filter((o) => o.status).length === group.objects.length,
        };
      });

      return newData;
    } else {
      return [];
    }
  }

  function extractRows(rows: UiDataObject[]) {
    const rowsData: any = [];

    rows.forEach((collection) => {
      collection.objects.forEach((obj) => {
        rowsData.push({
          status: obj.status,
          dataObject: {
            connect: {
              id: obj.dataObject.id,
            },
          },
        });
      });
    });
    return rowsData;
  }

  useEffect(() => {
    getObject({
      variables: {
        where: {
          id: {
            equals: query.id,
          },
        },
        orderBy: [
          {
            dataObject: {
              name: SortOrder.asc,
            },
          },
        ],
      },
    });
  }, []);

  useEffect(() => {
    if (objectGroups) {
      const data = getObjectsRows(objectGroups);
      setAccordion(_.sortBy(data, ['name']));
      setSelectedAccordion(_.sortBy(data, ['name']));
      setDataObject(objectGroups?.pretaaListDataObjectCollections[0]);
    }
  }, [objectGroups]);

  function toggleField(index: number, status: boolean, section: number, objectId: string, sectionName: string) {
    // Accordion Object Changes
    const accordionData = _.cloneDeep(accordion);

    const itemIndex = accordionData[section].objects.findIndex((o) => o.dataObject.id === objectId);
    accordionData[section].objects[itemIndex].status = !status;
    // Selected Accordion Object Changes
    const selectedAccordionData = _.cloneDeep(selectedAccordion);
    const sectionIndex = selectedAccordionData.findIndex((o) => o.name === sectionName);
    const objectIndex = selectedAccordionData[sectionIndex].objects.findIndex((o) => o.dataObject.id === objectId);
    selectedAccordionData[sectionIndex].objects[objectIndex].status = !status;
    // Set Value
    setAccordion(accordionData);
    setSelectedAccordion(selectedAccordionData);
    setOpenItems(accordionData.map((d) => d.name));
  }

  function changeDataItems(collectionIndex: number, isChecked: boolean, name: string) {
    // Accordion Object Changes
    const accordionData = _.cloneDeep(accordion);
    accordionData[collectionIndex].isChecked = isChecked;
    accordionData[collectionIndex].objects.forEach((o, i) => {
      accordionData[collectionIndex].objects[i] = {
        ...o,
        status: isChecked,
      };
    });
    // Selected Accordion Object Changes
    const selectedAccordionData = _.cloneDeep(selectedAccordion);
    const sectionIndex = selectedAccordionData.findIndex((o) => o.name === name);
    selectedAccordionData[sectionIndex].isChecked = isChecked;
    selectedAccordionData[sectionIndex].objects.forEach((o, i) => {
      selectedAccordionData[sectionIndex].objects[i] = {
        ...o,
        status: isChecked,
      };
    });
    // Set Value
    setAccordion(accordionData);
    setSelectedAccordion(selectedAccordionData);
  }

  const handleSearchFilter = (value: string) => {
    setSearchText(value);
    if (value?.trim()?.length === 0) {
      const data = _.cloneDeep(selectedAccordion);
      setAccordion(data);
    } else {
      const finalResult: any = [];
      const accordionObj = _.cloneDeep(selectedAccordion);
      accordionObj.forEach((item, acc) => {
        const resultCollection: any = [];
        item.objects.forEach((itemObj) => {
          if (itemObj?.dataObject?.displayName?.toLowerCase().includes(value.toLowerCase())) {
            resultCollection.push(itemObj);
          }
        });
        if (resultCollection.length > 0) {
          const tempAcc = accordionObj[acc];
          tempAcc.objects = resultCollection;
          finalResult.push(tempAcc);
        }
      });
      setAccordion(finalResult);
    }
  };

  async function handleFormData() {
    const name = objectGroups ? objectGroups?.pretaaListDataObjectCollections[0].name : '';

    // Create
    if (query.name) {
      try {
        const data = {
          name: query.name,
          collectionObject: {
            create: extractRows(selectedAccordion),
          },
        };

        const response = await createData({
          variables: data,
        });
        setSearchText('');
        setAccordion(selectedAccordion);
        toast.success(successList.objectCreate);
        navigate(
          routes.dataObjectsDetails.build({
            id: String(response.data?.pretaaCreateDataObjectCollection?.id),
          })
        );
        getObject({
          variables: {
            where: {
              id: {
                equals: String(response.data?.pretaaCreateDataObjectCollection?.id),
              },
            },
            orderBy: [
              {
                dataObject: {
                  name: SortOrder.asc,
                },
              },
            ],
          },
        });
      } catch (e) {
        catchError(e, true);
      }
    } else {
      // Edit
      try {
        const data: UpdateDataObjectVariables = {
          name,
          data: {
            deleteMany: [{}],
            create: extractRows(selectedAccordion),
          },
          id: String(query.id),
        };
        await updateData({
          variables: data,
        });
        setSearchText('');
        setAccordion(selectedAccordion);
        toast.success(successList.objectUpdate);
      } catch (e) {
        catchError(e, true);
      }
    }
  }

  async function handleSubmit() {
    if (dataObject?.default && !query.name) {
      setConfirmNew(true);
      return;
    }
    handleFormData();
  }

  function createNew() {
    setConfirmNew(false);
    handleFormData();
  }

  const objectOptions = [
    {
      label: 'Sales Force',
      value: 'salesForce',
      checked: false,
    },
    {
      label: 'Jira',
      value: 'jira',
      checked: false,
    },
    {
      label: 'Zendesk',
      value: 'zendesk',
      checked: false,
    },
    {
      label: 'Linkedin',
      value: 'linkedin',
      checked: false,
    },
    {
      label: 'Okta',
      value: 'okta',
      checked: false,
    },
  ];

  useEffect(() => {
    TrackingApi.log({
      pageName: routes.dataObjectsDetails.name,
    });
  }, []);

  return (
    <>
      <ContentHeader title={query.id ? dataObject?.name : 'Data Object Create'}>
        <div className="flex items-center gap-4">
          <SearchField defaultValue={searchText} label="Filter..." onSearch={handleSearchFilter} />
          <div className="hidden">
            <FilterToggler filterOptions={objectOptions} hideOptionLabel={true} />
          </div>
          <div className="flex flex-1 items-center justify-end gap-3">
            <button
              onClick={hide}
              className={`h-8 w-8 rounded-lg 
            transition duration-300 ${showList ? 'bg-gray-300' : 'bg-primary-light'}`}>
              <ListIcon
                className={`block mx-auto transition 
              duration-300 ${showList ? 'text-primary' : 'text-white'}`}
              />
            </button>
            <button
              onClick={show}
              className={`h-8 w-8 bg-gray-300 rounded-lg 
            transition duration-300 ${showList ? 'bg-primary-light' : 'bg-gray-300'}`}>
              <SublistIcon
                className={`block mx-auto transition 
              duration-300 ${showList ? 'text-white' : 'text-primary'}`}
              />
            </button>
          </div>
        </div>
      </ContentHeader>

      <ContentFrame className="bg-white flex flex-col flex-1" type="with-footer">
        {loading && accordion.length === 0 && <Loading />}
        {!loading && accordion.length === 0 && <EmptyFilter />}
        {accordion.length > 0 && (
          <Accordion allowZeroExpanded allowMultipleExpanded preExpanded={openItems}>
            {accordion.map((item, index) => (
              <AccordionItem uuid={item.name.replaceAll(' ', '-').toLowerCase()} key={item.name}>
                <div>
                  <div
                    className="px-0.5 py-2 border-b items-center
                     border-gray-500 relative accordion-button mt-2 flex">
                    <ToggleSwitch color="blue" checked={item.objects.some((obj) => obj.status)} onChange={(isChecked) => changeDataItems(index, isChecked, item?.name)} />
                    <span className="text-base flex-1 text-primary ml-6 font-bold">{item.name}</span>
                    <AccordionItemHeading>
                      <AccordionItemButton />
                    </AccordionItemHeading>
                  </div>
                </div>
                <AccordionItemPanel className="p-0">
                  <ul>
                    {_.sortBy(item.objects, ['dataObject.displayName'])?.map((field, i) => {
                      return (
                        <li key={field.dataObject.id} className="relative">
                          <div className="flex items-center border-b border-gray-500">
                            <div className="px-6 lg:px-9 py-3 flex-1">
                              <label data-testid="option" className="items-center space-x-3 uppercase cursor-pointer">
                                <input
                                  type="checkbox"
                                  className={`appearance-none h-5 w-5 border border-primary-light
                      checked:bg-primary-light checked:border-transparent rounded-md form-tick cursor-pointer`}
                                  checked={field.status}
                                  onChange={() => toggleField(i, field.status, index, field.dataObject.id, item.name)}
                                />
                                <span className="ml-2">{field.dataObject.displayName}</span>
                              </label>
                            </div>
                            <div className="">
                              {field.dataObject?.useCasesDataObjectsClient?.length && (
                                <Popover
                                  trigger={
                                    <BsFillExclamationCircleFill
                                      className="mr-2 cursor-pointer
                     text-base text-red-800"
                                    />
                                  }>
                                  <p className="uppercase px-2 py-4">Data Object depends on this Use case</p>
                                </Popover>
                              )}
                            </div>
                          </div>
                          {showList === true && (
                            <ul>
                              {_.sortBy(field.dataObject?.useCasesDataObjectsClient, ['useCase.displayName'])?.map((y, idex) => {
                                return (
                                  <li
                                    key={idex}
                                    className="border-b border-gray-500 uppercase 
                                    pl-24 py-3 text-gray-600 bg-gray-50">
                                    {y.useCase.displayName}
                                  </li>
                                );
                              })}
                            </ul>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </AccordionItemPanel>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </ContentFrame>
      {accordion.length > 0 && (
        <ContentFooter block={true}>
          {(dataObjectPermission?.capabilities?.CREATE || dataObjectPermission?.capabilities?.EDIT) && (
            <React.Fragment>
              <div className="flex">
                <Button onClick={() => handleSubmit()} loading={updateDataLoading} disabled={updateDataLoading}>
                  Save
                </Button>
                <Button type="button" style="bg-none" onClick={() => navigate(-1)}>
                  Cancel
                </Button>
              </div>
              <div>
                <p className="italic text-xs text-gray-150 mt-3">ALL CHANGES MUST BE ACTUALLY SAVED BY CLICKING A SAVE BUTTON. CHANGES WILL NOT BE AUTOMATICALLY CHANGED</p>
              </div>
            </React.Fragment>
          )}
        </ContentFooter>
      )}
      <ConfirmationDialog modalState={confirmDelete} confirmBtnText="Continue" className="max-w-md rounded-xl" onConfirm={() => createNew()} onCancel={() => setConfirmNew(false)}>
        <div>
          <h2 className="h2">Are you sure?</h2>
          You are about to overwrite the default settings. This will change the access to any user with these data object settings.
        </div>
      </ConfirmationDialog>
    </>
  );
}
