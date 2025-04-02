import { configVar } from '@/config/config';
import { Slider } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { useEffect, useState, memo } from 'react';

interface IMemoPropsType {
  // eslint-disable-next-line no-unused-vars
  onChange: (value: number) => void;
  value: number;
  defaultValue: number;
}

const DebouncedSlider = ({
  onChange,
  value,
  defaultValue,
}: {
  defaultValue: number;
  value: number;
  // eslint-disable-next-line no-unused-vars
  onChange: (value: number) => void;
}) => {
  const [tempCount, setTempCount] = useState(value);
  const [debouncedCount] = useDebouncedValue(tempCount, 300);
  useEffect(() => {
    onChange(debouncedCount);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedCount]);

  useEffect(() => {
    setTempCount(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <Slider
      onChange={(value) => setTempCount(value)}
      onChangeEnd={(value) => setTempCount(value)}
      value={tempCount}
      min={1}
      max={configVar.ownersMax}
      step={1}
      defaultValue={defaultValue}
      label={null}
      showLabelOnHover={false}
      color="#ea580c"
      size={'sm'}
    />
  );
};

export default memo(DebouncedSlider, areEqual);

function areEqual(prevProps: IMemoPropsType, nextProps: IMemoPropsType) {
  return (
    prevProps.value === nextProps.value &&
    prevProps.defaultValue === nextProps.defaultValue
  );
}
