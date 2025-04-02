import { ReactNode } from 'react';

export function LabeledValue({
  label,
  children,
  className,
  testId,
}: {
  label: string;
  children?: ReactNode;
  className?: string
  testId?: string;
}): JSX.Element {
  return (
    <div className={`text-primary text-base break-word px-3 ${className}`} data-test-id={testId}>
      <label className="block text-xs font-medium text-gray-600">{label}</label>
      {children}
    </div>
  );
}
