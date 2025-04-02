import React from 'react';
import { useController, Control, UseFormSetValue, FieldValues } from 'react-hook-form';
import './_switchToggle.scoped.scss';


export default function SwitchToggle({ control, setValue, name }: {
  control: Control;
  setValue: UseFormSetValue<FieldValues>;
  name: string
}) {
  const {
    field: { value },
  } = useController({
    name,
    control,
  });

  const handleToggle = () => {
    setValue(name, !value);
  };

  function getColor() {
    if (value) {
      return 'bg-green active';
    } else if (!value) {
      return 'bg-gray-350 in-active';
    } 
  }

  return (
    <div className="toggle-container">
      <label>
        {value !== undefined && (
          <input className="toggle-wapper" type="checkbox"  checked={value} onChange={handleToggle} />
        )}
        
        <div className={`toggle-bar rounded-full transition duration-100 cursor-pointer ${getColor()}`}>
          <div
            className="toggle-circle float-left ease-linear mt-0.5 ml-0.5 bg-white rounded-full duration-100
          pointer-events-none transition-transform"
          />
        </div>
      </label>
    </div>
  );
}
