import './_toggle-switch.scoped.scss';

export function ToggleSwitch({
  checked,
  onChange,
  color,
  dataAttr,
  testId
}: {
  checked: boolean;
  onChange?: (checked: boolean) => void;
  color?: 'green' | 'blue';
  dataAttr?: string
  testId?: string
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
    }
  }

  return (
    <>
      <div className="toggle-container">
        <label data-test-id={testId || 'toggle-label'}>
          <input
            className="toggle-wapper"
            type="checkbox"
            checked={checked}
            onChange={(e) => onChange && onChange(e.target.checked)}
            data-testid="toggle-testid"
            data-name={dataAttr ? dataAttr : ''}
          />
          <div className={`toggle-bar rounded-full transition duration-100 cursor-pointer ${getColor()}`}>
            <div
              className="toggle-circle float-left ease-linear mt-0.5 ml-0.5 bg-white rounded-full duration-100
           pointer-events-none transition-transform"
            />
          </div>
        </label>
      </div>
    </>
  );
}
