import { Button } from '@mantine/core';

export default function ButtonComponent({
  loading,
  color = 'violet',
  children,
  className,
  testId,
  type
}: {
  loading?: boolean;
  type?: 'submit' | 'button';
  color?: string;
  className?: string;
  children: any
  testId?: string
}) {


  return (
    <Button loading={loading} data-test-id={testId} className={className} color={color} type={type}>
      {children}
    </Button>
  );
}
