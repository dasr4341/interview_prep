import { FilterInterface } from '../interface/dateFilterData.interface';
import { SelectedPatientsType } from './ReportFilter';
import { useLocation, useNavigate } from 'react-router-dom';

export function getReportTabRoute(link: string, patientId: string) {
  const arr = (link + '/').split('/');
  while (arr.length > 4) {
    arr.pop();
  }
  return `${arr.join('/')}/${patientId}`;
}

export function FilterDropDownMenu({
  option,
  reportFilterState,
  appendPatientCallback,
  patientId,
}: {
  option: FilterInterface;
  reportFilterState: any;
  appendPatientCallback: any;
  patientId?: string;
}) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="px-3 border-b last:border-0">
      <div
        onClick={() => {
          if (option.id === patientId) {
            return;
          }

          if (patientId) {
            navigate(getReportTabRoute(location.pathname, option.id));
          }
        }}
        data-testid="eventFilterOption"
        className="flex items-center space-x-3 uppercase w-full">
        {!patientId && (
          <input
            id={`${option.id}`}
            type="checkbox"
            value={option.label}
            checked={
              (option.label === SelectedPatientsType.ALL &&
                reportFilterState.all) ||
              !!reportFilterState.filterUsers.find(
                (d) => d.patientId === option.id
              )
            }
            className={`appearance-none h-5 w-5 border
border-primary-light
checked:bg-primary-light checked:border-transparent
rounded-md form-tick`}
            onChange={(e) => {
              const selectedPatientsData = {
                all: Boolean(reportFilterState.all),
                filterUsers: [...reportFilterState.filterUsers],
              };

              // ---------------------------------- | For  checked | ---------------------
              if (e.target.checked) {
                if (option.value === SelectedPatientsType.ALL) {
                  selectedPatientsData.all = true;
                  selectedPatientsData.filterUsers = [];
                } else {
                  selectedPatientsData.all = false;
                  selectedPatientsData.filterUsers.push({
                    patientId: option.id,
                    name: option.label,
                  });
                }
                appendPatientCallback(selectedPatientsData);
                return;
              }

              // ---------------------------------- | For un-checked | ---------------------
              if (option.value === SelectedPatientsType.ALL) {
                selectedPatientsData.all = false;
              } else {
                selectedPatientsData.filterUsers =
                  reportFilterState.filterUsers.filter(
                    (data) => data.patientId !== option.id
                  );
              }
              appendPatientCallback(selectedPatientsData);
            }}
          />
        )}
        <label className="text-primary font-semibold text-xs cursor-pointer w-full py-3" htmlFor={`${option.id}`}>
          {option.label}
        </label>
      </div>
    </div>
  );
}
