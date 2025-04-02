import classNames from 'classnames';
import { UrlQueryOptions } from 'interface/url-query.interface';
import { RootState } from 'lib/store/app-store';
import { IoIosClose } from 'react-icons/io';
import { useSelector } from 'react-redux';

export function TagLozenge({
  tags,
  onChange,
  className,
  filterRange,
  onFilterChange,
}: {
  onChange: (options: UrlQueryOptions[]) => void;
  tags: UrlQueryOptions[];
  className?: Array<string>;
  filterRange?: string;
  onFilterChange?: () => void;
}): JSX.Element {
  const dateRangeOptions = useSelector((state: RootState) => state.dataSource.dateRange);

  const classes = classNames(
    `border border-primary font-bold focus:outline-none px-4 py-1 rounded-full
     text-2xs uppercase whitespace-nowrap bg-primary text-white flex
     items-center mb-1 mr-2 ${className}`
  );

  function removeTag(tag: string) {
    const index = tags.findIndex((o) => o.value === tag);
    if (index > -1 && tags[index].checked) {
      tags[index].checked = false;
    }
    onChange(tags);
  }

  return (
    <>
      {tags.map(
        (tag) =>
          tag &&
          tag.checked && (
            <button data-testid="tag-badge"
             type="button" className={classes} key={tag.value} onClick={() => removeTag(tag.value)}>
              {tag.label}
              <IoIosClose size="20" className="ml-2" />
            </button>
          )
      )}
      {filterRange && (
        <button 
          data-testid="tag-badge"
          type="button" className={classes} onClick={onFilterChange}>
          {dateRangeOptions.find((item: { value: string }) => item.value === filterRange)?.label}
          <IoIosClose size="20" className="ml-2" />
        </button>
      )}
    </>
  );
}
