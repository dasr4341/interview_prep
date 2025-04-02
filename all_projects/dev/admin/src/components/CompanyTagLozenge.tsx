import React from 'react';
import classNames from 'classnames';
import { UrlQueryOptions } from 'interface/url-query.interface';
import { IoIosClose } from 'react-icons/io';
import { DefaultIndustriesVariable, DefaultProductsVariable } from '../interface/company-interface';
import { arrRange, employeesRange, timeRange } from '../lib/constant/timeRange';

// Todo: This needs refactor 
export function CompanyTagLozenge({
  tags,
  onChange,
  className,
  defaultProducts,
  defaultIndustries,
}: {
  onChange: (options: UrlQueryOptions[] | any) => void;
  tags: any;
  className?: Array<string>;
  defaultProducts: DefaultProductsVariable[];
  defaultIndustries: DefaultIndustriesVariable[];
}): JSX.Element {
  const classes = classNames(
    `border border-primary font-bold focus:outline-none px-4 py-1 rounded-full
     text-2xs uppercase whitespace-nowrap bg-primary text-white flex
     items-center mb-1 mr-2 ${className}`
  );

  const removeTag = (key: string, item: string | any, isArrayValue: boolean) => {
    if (isArrayValue) {
      const index = tags[key]?.indexOf(item);
      tags[key]?.splice(index, 1);
    } else {
      if (key === 'references') {
        tags[key][item] = null;
        if (!(tags[key].referredOn || tags[key].offeredOn)) {
          // check for removing manual range badge
          tags[key].manualRange = null;
        }
      } else {
        tags[key][item] = null;
      }
    }
    onChange(tags);
  };

  const getTagValue = (key: string, key1: any, tagsData: any) => {
    if (key === 'references') {
      if (key1 === 'manualRange') {
        return `${['manual Range']} : ${timeRange?.find((item) => item.value === tagsData[key][key1])?.label}`;
      } else if (key1 === 'surveyedRange') {
        return `${['surveyed Range']} : ${timeRange?.find((item) => item.value === tagsData[key][key1])?.label}`;
      } else if (key1 === 'referredOn') {
        return `${['referred On']}`;
      } else if (key1 === 'offeredOn') {
        return `${['offered On']}`;
      } else {
        return `${key1}`;
      }
    } else {
      return `${[key]} ${[[key1]]} : ${tagsData[key][key1]}`;
    }
  };

  const singleBadge = (key: string, length: number) => {
    // for single badge
    if (key === 'industries') {
      if (length > 1) {
        const firstIndustriesValue = defaultIndustries?.find((item) => item.id === tags[key][0])?.sector || '';
        return firstIndustriesValue ? firstIndustriesValue + ` +${length - 1}` : '';
      } else {
        return defaultIndustries?.find((item) => item.id === tags[key][0])?.sector || '';
      }
    } else if (key === 'products') {
      if (length > 1) {
        const firstProductValue = defaultProducts?.find((item) => item.customerProductId === tags[key][0])?.name || '';
        return firstProductValue ? firstProductValue + ` +${length - 1}` : '';
      } else {
        return defaultProducts?.find((item) => item.customerProductId === tags[key][0])?.name || '';
      }
    }
  };

  const removeSingleBadge = (key: string) => {
    tags[key] = [];
    onChange(tags);
  };

  const minMaxBadge = (key: string) => {
    if (key === 'npsScore') {
      return `nps Score : ${tags?.[key]?.min}-${tags?.[key]?.max}`;
    } else {
      const rangeLabel =
        (key === 'arr' ? arrRange : employeesRange)?.find(
          (item) => item.value?.[0] === tags?.[key]?.min && item.value?.[1] === tags?.[key]?.max
        )?.label || '';
      if (key === 'arr') {
        const minCheck = arrRange?.find((item) => item.value?.[1] === tags?.[key]?.min)?.label || '';
        if (rangeLabel) return `Revenue : ${rangeLabel}`;
        else if (!rangeLabel && minCheck && tags?.[key]?.min && !tags?.[key]?.max) return `Revenue : ${minCheck}`;
        else if (!rangeLabel && !minCheck && tags?.[key]?.min && !tags?.[key]?.max)
          return `Revenue : ${tags?.[key]?.min || ''}`;
        else return `Revenue : ${tags?.[key]?.min || ''}-${tags?.[key]?.max || ''}`;
      } else if (key === 'employeeCount') {
        if (rangeLabel) return `employeeCount : ${rangeLabel}`;
        else return `employeeCount : ${tags?.[key]?.min || ''}-${tags?.[key]?.max || ''}`;
      }
    }
  };

  const removeMinMaxBadge = (key: string) => {
    delete tags[key];
    onChange(tags);
  };

  return (
    <React.Fragment>
      {Object.keys(tags).length > 0 &&
        Object.keys(tags).map((key, index) => {
          return (
            <React.Fragment key={index}>
              {Array.isArray(tags[key]) ? ( //check object key value is array
                <React.Fragment>
                  {key === 'filters'
                    ? tags[key]?.length > 0 &&
                      tags[key]?.map((item: any) => {
                        return (
                          <button type="button" className={classes} key={item}>
                            {item?.replace('_', ' ')}
                            <IoIosClose size="20" className="ml-2" onClick={() => removeTag(key, item, true)} />
                          </button>
                        );
                      })
                    : defaultProducts?.length > 0 && //handle multiple industries and product in single badge
                      defaultIndustries?.length > 0 &&
                      singleBadge(key, tags[key]?.length) && ( // handle empty badge
                        <button type="button" className={classes}>
                          {singleBadge(key, tags[key]?.length)}
                          <IoIosClose size="20" className="ml-2" onClick={() => removeSingleBadge(key)} />
                        </button>
                      )}
                </React.Fragment>
              ) : (
                <React.Fragment>
                  {
                    Object.keys(tags[key]).length > 0 &&
                      (key === 'arr' || key === 'employeeCount' || key === 'npsScore'
                        ? // handle single badge single badge
                          minMaxBadge(key) && ( // handle empty badge
                            <button type="button" className={classes}>
                              {minMaxBadge(key)}
                              <IoIosClose size="20" className="ml-2" onClick={() => removeMinMaxBadge(key)} />
                            </button>
                          )
                        : Object.keys(tags[key])?.map((key1: any) => {
                            return (
                              <React.Fragment key={key1}>
                                {(!!tags[key][key1] || tags[key][key1] === 0) && (
                                  <button type="button" className={classes} onClick={() => removeTag(key, key1, false)}>
                                    {getTagValue(key, key1, tags)}
                                    <IoIosClose size="20" className="ml-2" />
                                  </button>
                                )}
                              </React.Fragment>
                            );
                          })) //here object key value is object
                  }
                </React.Fragment>
              )}
            </React.Fragment>
          );
        })}
    </React.Fragment>
  );
}
