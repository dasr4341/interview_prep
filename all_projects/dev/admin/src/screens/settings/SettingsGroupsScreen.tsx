import { TrackingApi } from 'components/Analytics';
import { ContentFrame } from 'components/content-frame/ContentFrame';
import { ContentHeader } from 'components/ContentHeader';
import { makeContact } from 'fakeData';
import _ from 'lodash';
import { useEffect, useMemo } from 'react';
import { routes } from 'routes';

export default function SettingsGroupsScreen(): JSX.Element {
  const contacts = useMemo(() => _.range(0, 30).map(makeContact), []);
  const contactElements = contacts.map((c) => {
    return (
      <div className="flex items-center py-2 border-b gap-2">
        <input type="checkbox" className="mr-2" />
        <div className="w-1/3">{c.name}</div>
        <div className="truncate w-1/3">{c.email}</div>
        <div className="w-1/3">{c.department}</div>
      </div>
    );
  });

  useEffect(() => {
    TrackingApi.log({
      pageName: routes.settingsGroups.name,
    });
  }, []);

  return (
    <>
      <ContentHeader title="Groups" />
      <ContentFrame>
        <div className="text-right">
          <button className="btn mb-8">Create user group</button>
        </div>
        <div
          className="flex font-bold items-center 
          gap-2 py-2 border rounded-full px-6 -mx-6 shadow-table-header">
          <input type="checkbox" className="mr-2" />
          <label className="w-1/3">Name</label>
          <label className="w-1/3">Email</label>
          <label className="w-1/3">Department</label>
        </div>
        {contactElements}
      </ContentFrame>
    </>
  );
}
