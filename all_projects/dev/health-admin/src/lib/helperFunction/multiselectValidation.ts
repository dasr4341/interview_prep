import messagesData from 'lib/messages';
export interface MultiSelectOptionsInterface {
  id: null | string;
  label: string;
  value: string;
}

export function multiselectValidation(arrayValues: MultiSelectOptionsInterface[], index?:number, setError?:any ) {
  const uLabels: string[] = [];
  const uValues: string[] = [];
 
  let error = false;

  arrayValues.forEach((arrayValue: MultiSelectOptionsInterface, arrayIndex) => {
    // for label
   
    if (!arrayValue.label.trim().length) {
      error = true;
      if (setError) {
        setError(`fields.${index}.options.${arrayIndex}.label`, {
          message: messagesData.errorList.required,
          type: 'spaceNotAllowed',
        });
      }      
     
    } else {
     
      if (uLabels.includes(arrayValue.label.trim())) {
        error = true;
        if (setError) {
          setError(`fields.${index}.options.${arrayIndex}.label`, {
            message: messagesData.errorList.uniqueDataNeeded('label'),
            type: 'uniqueDataNeeded',
          });
        }
        
      
      } else {
        uLabels.push(arrayValue.label.trim());
      }
    }

    // for value
   
    if (!arrayValue.value.trim().length) {
      error = true;
      if (setError) {
        setError(`fields.${index}.options.${arrayIndex}.value`, {
          message: messagesData.errorList.required,
          type: 'spaceNotAllowed',
        });
      }
     
    } else if (arrayValue.value.includes(',')) {
      error = true;
      if (setError) {
        setError(`fields.${index}.options.${arrayIndex}.value`, {
          message: messagesData.errorList.commaNotAllowed('Value'),
          type: 'commaNotAllowed',
        });
      }
      
    } else {
     
      if (uValues.includes(arrayValue.value.trim())) {
        
        error = true;
        if (setError) {
          setError(`fields.${index}.options.${arrayIndex}.value`, {
            message: messagesData.errorList.uniqueDataNeeded('value'),
            type: 'uniqueDataNeeded',
          });
        }
       
      } else {
        uValues.push(arrayValue.value.trim());
      }
    }
  });

  return error;
}