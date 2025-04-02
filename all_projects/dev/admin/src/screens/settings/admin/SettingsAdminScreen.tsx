import { ContentFrame } from 'components/content-frame/ContentFrame';
import { ContentHeader } from 'components/ContentHeader';
import { SettingsCategory } from 'fakeData';
import faker from 'faker';
import _ from 'lodash';
import { useMemo } from 'react';
import { CategoryView } from './CategoryView';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function makeGroups() {
  return _.range(0, 20).map(() => faker.lorem.words(2));
}

export function buildCategories(): SettingsCategory[] {
  return _.range(0, 20).map(() => ({
    id: faker.datatype.number(),
    name: faker.lorem.words(3),
    subCategories: _.range(0, 4).map(() => ({
      id: faker.datatype.number(),
      items: _.range(0, 2).map(() => ({
        id: faker.datatype.number(),
        name: faker.lorem.words(2),
      })),
      name: faker.lorem.words(3),
    })),
  }));
}

export function SettingsAdminScreen(): JSX.Element {
  const groups = useMemo(makeGroups, []);
  const categories = useMemo(buildCategories, []);

  const groupViews = groups.map((g, gi) => (
    <div
      key={gi}
      className="sticky top-0 bg-white whitespace-nowrap 
      pr-4 border-b border-black mb-2">
      {g}
    </div>
  ));

  const categoryViews = categories.map((c) => (
    <CategoryView category={c} groups={groups} key={c.id} />
  ));

  return (
    <>
      <ContentHeader title="Admin Settings" />
      <ContentFrame classes={['bg-white']}>
        <div
          className="bg-white grid item-center 
            max-w-full overflow-x-scroll mb-8"
          style={{ gridTemplateColumns: `2fr repeat(${groups.length}, auto)` }}>
          <div className="sticky bg-white top-0 
            left-0 z-10 border-b border-black mb-2">
            Groups
          </div>
          {groupViews}
          {categoryViews}
        </div>
      </ContentFrame>
    </>
  );
}
