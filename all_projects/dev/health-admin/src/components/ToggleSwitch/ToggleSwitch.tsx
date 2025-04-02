import './_toggle-switch.scoped.scss';

export function ToggleSwitch({
  checked,
  onChange,
  color,
  dataAttr,
  disabled,
  loading,
  isNotEditable
}: {
  checked: boolean;
  onChange?: (checked: boolean) => void;
  color?: 'green' | 'blue' | 'gray';
  dataAttr?: string;
  disabled?: boolean;
  loading?: boolean;
  isNotEditable?: boolean;
}): JSX.Element {
  function getColor() {
    if (!color) {
      color = 'green';
    }

    if (checked && color === 'green') {
      return 'bg-green active';
    } else if (!checked && color === 'green') {
      return 'bg-gray-650 in-active';
    } else if (checked && color === 'blue') {
      return 'bg-primary-light active';
    } else if (!checked && color === 'blue') {
      return 'bg-gray-650 in-active';
    } else if (disabled) {
      return 'bg-gray-400';
    } else {
      return 'bg-gray-900';
    }
  }

  return (
    <div className="toggle-container">
      <label>
        <input
          className='toggle-wapper'
          type="checkbox"
          checked={checked}
          onChange={(e) => !disabled && onChange && onChange(e.target.checked)}
          data-name={dataAttr ? dataAttr : ''}
        />
        <div
          className={` toggle-bar rounded-full transition duration-100 ${getColor()} ${isNotEditable ? 'toggle-switch-disable' : ''} cursor-pointer ${disabled ? 'bg-gray-650' : ''} ${loading ? ' cursor-wait' : ''}`}>
          <div
            className="toggle-circle float-left ease-linear mt-0.5 ml-0.5 bg-white rounded-full duration-100
           pointer-events-none transition-transform"
          />
        </div>
      </label>
    </div>
  );
}
