// eslint-disable-next-line max-len
import { GetObject_pretaaListDataObjectCollections_dataObjectCollectionOnDataObject } from 'generatedTypes';

export interface UiDataObject {
  name: string | 'salesforce' | 'zendesk';
  isChecked: boolean;
  id: string;
  objects: GetObject_pretaaListDataObjectCollections_dataObjectCollectionOnDataObject[];
}
