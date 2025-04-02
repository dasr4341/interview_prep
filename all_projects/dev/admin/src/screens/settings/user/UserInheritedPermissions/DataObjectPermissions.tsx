/* eslint-disable react-hooks/exhaustive-deps */
import {
  Accordion,
  AccordionItem,
  AccordionItemButton,
  AccordionItemHeading,
  AccordionItemPanel,
} from 'react-accessible-accordion';
import 'react-accessible-accordion/dist/fancy-example.css';
import 'scss/components/_data-object-details.scoped.scss';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import { getObjectQuery } from 'lib/query/data-object/get-object';
import { GetObject, GetObjectVariables, SortOrder } from 'generatedTypes';
import { UiDataObject } from 'interface/DataObject.inteface';
import { ToggleSwitch } from 'components/ToggleSwitch/ToggleSwitch';

export default function DataObjectPermissions({ dataObjectId }: { dataObjectId: string }) {
  const [accordion, setAccordion] = useState<UiDataObject[]>([]);
  const openItems = ['salesforce', 'zendesk', 'marketo', 'client-saas-platform'];
  const [getObject, { data: objectGroups }] = useLazyQuery<GetObject, GetObjectVariables>(getObjectQuery);

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

  useEffect(() => {
    getObject({
      variables: {
        where: {
          id: {
            equals: dataObjectId,
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
      console.log(data);
      setAccordion(data);
    }
  }, [objectGroups]);

  return (
    <>
      {accordion.length > 0 && (
        <Accordion allowZeroExpanded preExpanded={openItems} className="opacity-50">
          {accordion.map((item) => (
            <AccordionItem uuid={item.name.replaceAll(' ', '-').toLowerCase()} key={item.name}>
              <div>
                <div
                  className="px-0.5 py-2 border-b items-center
                     border-gray-500 relative accordion-button mt-2 flex">
                  <ToggleSwitch color="blue" checked={item.isChecked} />
                  <span className="text-base flex-1 text-primary ml-6 font-bold">{item.name}</span>
                  <AccordionItemHeading>
                    <AccordionItemButton />
                  </AccordionItemHeading>
                </div>
              </div>
              <AccordionItemPanel className="p-0">
                <ul>
                  {item.objects.map((field) => {
                    return (
                      <li key={field.dataObject.id} className="relative">
                        <div className="flex items-center border-b border-gray-500">
                          <div className="px-6 lg:px-9 py-3 flex-1">
                            <label data-testid="option" className="items-center space-x-3 uppercase">
                              <input
                                type="checkbox"
                                className={`appearance-none h-5 w-5 border
                                border-primary-light
                                checked:bg-primary-light checked:border-transparent
                                  rounded-md form-tick`}
                                disabled
                                checked={field.status}
                              />
                              <span className="ml-2">{field.dataObject.displayName}</span>
                            </label>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </AccordionItemPanel>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </>
  );
}
