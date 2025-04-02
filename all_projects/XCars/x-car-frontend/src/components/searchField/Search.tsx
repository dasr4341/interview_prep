import { useState, useEffect } from 'react';
import { useDebouncedValue } from '@mantine/hooks';
import { TextInput } from '@mantine/core';

export default function Search({
  onChange,
  className,
  defaultValue,
}: {
  defaultValue?: string | null;
  className?: string;
  // eslint-disable-next-line no-unused-vars
  onChange: (searchedText: string) => void;
}) {
  const [value, setValue] = useState(defaultValue || '');
  const [debounced] = useDebouncedValue(value, 300);

  useEffect(() => {
    onChange(debounced);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced]);

  return (
    <TextInput
      className={`${className}`}
      placeholder="Search cars "
      value={value}
      onChange={(event) => setValue(event.currentTarget.value.trim())}
    />
  );
}
