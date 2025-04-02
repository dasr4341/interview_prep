/* eslint-disable react-hooks/exhaustive-deps */
import { useLazyQuery } from '@apollo/client';
import { client } from 'apiClient';
import { customStyleSelectBox, OptionItem, DropdownIndicator } from 'components/ui/SelectBox';
import {
  GetTemplatesDropDownVariables,
  GetTemplatesDropDown,
} from 'generatedTypes';
import { SelectBox } from 'interface/SelectBox.interface';
import { useEffect, useState } from 'react';
import AsyncSelect from 'react-select/async';
import _ from 'lodash';
import { getTemplatesDropDown } from 'lib/query/templates/template-dropdwon';
import { useSelector } from 'react-redux';
import { RootState } from 'lib/store/app-store';

export default function TemplateListDropdown({
  onChange,
  placeholder,
  defaultTemplateId,
  testId
}: {
  onChange: (selected: SelectBox) => void;
  placeholder: string;
  defaultTemplateId?: string;
  testId?: string;
}) {
  const [getEmailTemplates, { data: templates, loading }] = useLazyQuery<
    GetTemplatesDropDown,
    GetTemplatesDropDownVariables
  >(getTemplatesDropDown);

  const [defaultTemplates, setDefaultTemplates] = useState<SelectBox[]>([]);
  const [selectedValue, setSelectedValue] = useState<SelectBox | null>();
  const user = useSelector((state: RootState) => state.auth.user?.currentUser);


  useEffect(() => {
    if (user?.customerId) {
      getEmailTemplates();
    }
  }, [user?.customerId]);

  function getDropdownItems(list: any[]) {
    return list.map((template) => {
      return {
        value: template.id,
        label: template.title,
      };
    }) as unknown as SelectBox[];
  }

  useEffect(() => {
    if (templates && defaultTemplates.length === 0) {
      setDefaultTemplates(getDropdownItems(templates?.pretaaGetEmailTemplatesCreatedOrSharedOrAssigned));

      // Find and set default selected template if any.
      if (defaultTemplateId) {
        const defaultSelectedItem = templates.pretaaGetEmailTemplatesCreatedOrSharedOrAssigned.find((item) => {
          return item.id === defaultTemplateId;
        });
        if (defaultSelectedItem) {
          setSelectedValue({ label: defaultSelectedItem.title || '', value: defaultSelectedItem.id });
          onChange({ label: defaultSelectedItem.title || '', value: defaultSelectedItem.id });
        }
      }
    }
  }, [templates]);

  const loadOptions = (inputValue: string, callback: (options: any) => void) => {
    (async () => {
      const result = await client.query<GetTemplatesDropDown, GetTemplatesDropDownVariables>({
        query: getTemplatesDropDown,
        variables: {
          keyword: inputValue
        }
      });
      callback(getDropdownItems(result.data.pretaaGetEmailTemplatesCreatedOrSharedOrAssigned));
    })();
  };
  
  const delayedCallback = _.debounce(loadOptions, 1000);

  const handleInputChange = (inputValue: string, callback: any) => {
    delayedCallback(inputValue, callback);
  };

  return (
    <div
    data-test-id={testId || 'mm'}>
    <AsyncSelect
      components={{
        Option: OptionItem,
        DropdownIndicator: DropdownIndicator,
      }}
      isLoading={loading}
      menuShouldScrollIntoView={true}
      loadOptions={handleInputChange}
      defaultOptions={defaultTemplates}
      className="basic-single rounded-lg"
      styles={customStyleSelectBox}
      value={selectedValue}
      onChange={(newValue) => {
        if (newValue) {
          onChange(newValue);
          setSelectedValue(newValue);
        }
      }}
      options={[]}
      placeholder={placeholder}
    />
    </div>
  );
}
