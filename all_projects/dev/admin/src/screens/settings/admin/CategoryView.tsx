import { SettingsCategory } from 'fakeData';
import { SubCategoryView } from './SubCategoryView';

export function CategoryView({
  category,
  groups,
}: {
  category: SettingsCategory;
  groups: string[];
}): JSX.Element {
  const subViews = category.subCategories.map((s) => (
    <SubCategoryView key={s.id} subCategory={s} groups={groups} />
  ));

  return (
    <>
      <div className="bg-gray-400 sticky left-0 
        py-2 uppercase whitespace-nowrap">
        {category.name}
      </div>
      {groups.map((g) => (
        <div className="bg-gray-400 flex items-center" key={g}>
          <input type="checkbox" />
        </div>
      ))}
      {subViews}
    </>
  );
}
