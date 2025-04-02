import classNames from 'classnames';
import { SettingsSubCategory } from 'fakeData';
import { Fragment } from 'react';

export function SubCategoryView({
  groups,
  subCategory,
}: {
  groups: string[];
  subCategory: SettingsSubCategory;
}): JSX.Element {
  return (
    <>
      <div className="sticky left-0 bg-white border-b border-black capitalize">
        {subCategory.name}
      </div>
      {groups.map((g) => (
        <div className="flex border-b border-black items-center" key={g}>
          <input type="checkbox" />
        </div>
      ))}
      {subCategory.items.map((item, itemIndex) => (
        <Fragment key={item.id}>
          <div
            className={classNames('sticky left-0 bg-white text-gray-900', {
              'mb-2': itemIndex === subCategory.items.length - 1,
            })}
            key={item.id}>
            {item.name}
          </div>
          {groups.map((g) => (
            <div
              className={classNames('flex items-center', {
                'mb-2': itemIndex === subCategory.items.length - 1,
              })}
              key={g}>
              <input type="checkbox" />
            </div>
          ))}
        </Fragment>
      ))}
    </>
  );
}
