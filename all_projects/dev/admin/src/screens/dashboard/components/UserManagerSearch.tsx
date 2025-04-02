import { customStyleSelectBox, OptionItem } from 'components/ui/SelectBox';
import {
  GetSearchReportManager,
  GetSearchReportManagerVariables,
} from 'generatedTypes';
import AsyncSelect from 'react-select/async';
import { useQuery } from '@apollo/client';
import { useState, useEffect } from 'react';
import _ from 'lodash';
import { client } from 'apiClient';
import { SearchReportManagerQuery } from 'lib/query/team-insights/get-manager-members';

interface SelectOptions {
  value: any;
  label: string;
}

export default function UserManagerSearch({
  className,
  onchange,
  componentId,
  componentName,
  classNamePrefix,
  placeholder,
  reporterUserId
}: {
  className?: string;
  componentId?: string;
  componentName?: string;
  isSearchable?: boolean;
  isLoading?: boolean;
  classNamePrefix?: string;
  placeholder?: string;
  reporterUserId?: string;

  onchange: (company: SelectOptions) => void;
}) {
  const [userList, setUserList] = useState<SelectOptions[]>();
  const [selectedUser, setSelectedUser] = useState<SelectOptions | null>(null);
  const [searchText, setSearchText] = useState('');

  const { data: searchManagerList, loading } = useQuery<GetSearchReportManager, GetSearchReportManagerVariables>(
    SearchReportManagerQuery,
    {
      variables: {
        searchPhrase: searchText,
        reporteeUserId: String(reporterUserId),
      },
    }
  );

  useEffect(() => {
    if (searchManagerList?.pretaaGetManagerMembers) {
      const userData = searchManagerList?.pretaaGetManagerMembers?.map((x) => {
        return { value: x.id, label: `${x.firstName} ${x.lastName}` };
      });
      setUserList(userData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchManagerList]);

  const loadOptions = async (phrase: string, callback: any) => {
    const response = await client.query<GetSearchReportManager, GetSearchReportManagerVariables>({
      query: SearchReportManagerQuery,
      variables: {
        searchPhrase: phrase,
        reporteeUserId: String(reporterUserId),
      },
    });

    if (response?.data?.pretaaGetManagerMembers) {
      const userData = searchManagerList?.pretaaGetManagerMembers?.map((x) => {
        return { value: x.id, label: `${x.firstName} ${x.lastName}` };
      });
      callback(userData);
    }

  };

  // Debounced search
  const delayedCallback = _.debounce(loadOptions, 1000);

  const handleInputChange = (phrase: string, callback: any) => {
    setSearchText(phrase);
    delayedCallback(phrase, callback);
  };

  return (
    <div className={`${Number(searchManagerList?.pretaaGetManagerMembers?.length) > 0 ?  '' : 'hidden'}`}>
      <AsyncSelect
        name={componentName}
        id={componentId}
        classNamePrefix={classNamePrefix}
        className={className}
        styles={customStyleSelectBox}
        defaultOptions={userList}
        loadOptions={handleInputChange}
        value={selectedUser}
        isLoading={loading}
        placeholder={placeholder || 'Select...'}
        components={{
          Option: OptionItem,
        }}
        onChange={(company) => {
          if (company) {
            setSelectedUser(company);
            onchange(company);
          }
        }}
        options={[]}
      />
    </div>
  );
}
