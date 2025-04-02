import { FilterStateInterface } from 'components/EventOrTimeline';
import { TicketsFilterOptions } from 'interface/url-query.interface';

export function changeSelectedEvent(label: string, setFilterState: React.Dispatch<React.SetStateAction<FilterStateInterface>>) {
    setFilterState((f) => {
      return {
        ...f,
        optionList: f.optionList.map((e: TicketsFilterOptions) => {
          if (e.label === label) {
            return {
              ...e,
              checked: !e.checked,
            };
          }
          return e;
        }),
      };
    });
  }