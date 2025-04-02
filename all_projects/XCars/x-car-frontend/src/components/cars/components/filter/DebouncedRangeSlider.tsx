import { configVar } from '@/config/config';
import { RangeSlider } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { useEffect, useState, memo } from 'react';

const DebouncedRangeSlider = ({
  onChange,
  value,
  defaultValue,
}: {
  defaultValue: { min: number; max: number };
  value: { min: number; max: number };
  // eslint-disable-next-line no-unused-vars
  onChange: (value: { min: number; max: number }) => void;
}) => {
  const [tempDrivenRange, setTempDrivenRange] = useState(value);
  const [debouncedRange] = useDebouncedValue(tempDrivenRange, 300);

  useEffect(() => {
    onChange(debouncedRange);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedRange]);

  useEffect(() => {
    setTempDrivenRange(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);
  return (
    <RangeSlider
      onChange={(value) => setTempDrivenRange({ min: value[0], max: value[1] })}
      minRange={100}
      min={configVar.drivenMin}
      max={configVar.drivenMax}
      step={100}
      value={[tempDrivenRange.min, tempDrivenRange.max]}
      defaultValue={[defaultValue.min, defaultValue.max]}
      label={null}
      showLabelOnHover={false}
      color="#ea580c"
      size={'sm'}
    />
  );
};

export default memo(
  DebouncedRangeSlider,
  (prevProps, nextProps) =>
    JSON.stringify(prevProps) === JSON.stringify(nextProps)
);
