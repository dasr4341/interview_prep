import { StoreClinicianFilterInterface } from 'interface/app.slice.interface';
import { SelectedPatientsType } from 'screens/Report/ReportFilter/ReportFilter';
import { FilterInterface } from 'screens/Report/interface/dateFilterData.interface';
import { SelectedClinicianType } from './FilterCliniciansList';

export function FilterClinicianListMenu({
  option,
  reportFilterState,
  appendClinicianListCallback,
}: {
  option: FilterInterface;
  reportFilterState: StoreClinicianFilterInterface;
  appendClinicianListCallback: any;
}) {
  return (
    <div className="p-3 max-w-xs flex flex-row w-full border-b last:border-0">
      <div
        data-testid="option"
        className="flex items-center space-x-3 uppercase">
        <input
          id={`clinician-option-${option.id}`}
          type="checkbox"
          value={option.label}
          checked={
            (option.label === SelectedClinicianType.ALL &&
              reportFilterState.clinicianListAll) ||
            !!reportFilterState.filterClinicianList?.find(
              (d) => d.id === option.id
            )
          }
          className={`appearance-none h-5 w-5 border
border-primary-light
checked:bg-primary-light checked:border-transparent
rounded-md form-tick cursor-pointer`}
          onChange={(e) => {
            const selectedClinicianList = {
              clinicianListAll: Boolean(reportFilterState.clinicianListAll),
              filterClinicianList: [...reportFilterState.filterClinicianList],
            };

            // ---------------------------------- | For  checked | ---------------------
            if (e.target.checked) {
              if (option.id === SelectedPatientsType.ALL) {
                selectedClinicianList.clinicianListAll = true;
                selectedClinicianList.filterClinicianList = [];
              } else {
                selectedClinicianList.clinicianListAll = false;
                selectedClinicianList.filterClinicianList.push({
                  id: option.id,
                  name: option.label,
                });
              }
              appendClinicianListCallback(selectedClinicianList);
              return;
            }

            // ---------------------------------- | For un-checked | ---------------------
            if (option.value === SelectedPatientsType.ALL) {
              selectedClinicianList.clinicianListAll = false;
            } else {
              selectedClinicianList.filterClinicianList =
                reportFilterState.filterClinicianList.filter(
                  (data) => data.id !== option.id
                );
            }
            appendClinicianListCallback(selectedClinicianList);
          }}
        />
        <label htmlFor={`clinician-option-${option.id}`} className="text-primary font-semibold text-xs cursor-pointer">
          {option.label}
        </label>
      </div>
    </div>
  );
}
