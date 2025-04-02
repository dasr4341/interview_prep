import { DataSource } from '../../../../../../config/config.enum';
import { PatientContactsInterface } from '../../../interface/sourceSystem.interface';

function sortObj(obj1: PatientContactsInterface, obj2: PatientContactsInterface) {
  if (obj1?.full_name && obj2?.full_name) {
    return obj1.full_name.toLowerCase().localeCompare(obj2.full_name.toLowerCase());
  } else {
    return 1;
  }
}

export function comparePatientContactListRespectToFirstName(
  actualData: PatientContactsInterface[],
  dbData: PatientContactsInterface[],
  isPatientPresent: boolean,
) {
  if (actualData) {
    actualData.sort(sortObj);
  }
  if (dbData) {
    dbData.sort(sortObj);
  }

  let isErrorExist = false;

  const modifiedData = actualData.reduce((prevData: any, currentData, index) => {
    let currentDbData: any | null = null;

    if (dbData && dbData[index]) {
      currentDbData = dbData[index];
    }

    const modifiedObj = Object.entries(currentData).reduce((preValue: any, entry) => {
      const [key, value1] = entry;
      const value2 = currentDbData ? currentDbData[key] : null;
      const matched = String(value1).toLowerCase() === String(value2).toLowerCase();

      if (!matched) {
        isErrorExist = true;
      }

      preValue[key] = {
        data: value1,
        isPatientPresent,
        matched,
        dbData: value2,
      };

      return preValue;
    }, {});

    return [
      ...prevData,
      {
        source: {
          data: DataSource.KIPU,
          isPatientPresent,
          dbData: null,
          matched: !isErrorExist,
        },
        ...modifiedObj,
        errors: {
          isErrorExist,
          isPatientPresent,
          dbData: {
            source: DataSource.LOCAL,
            ...currentDbData,
          },
        },
      },
    ];
  }, []);

  return {
    isErrorExist,
    modifiedData,
  };
}
