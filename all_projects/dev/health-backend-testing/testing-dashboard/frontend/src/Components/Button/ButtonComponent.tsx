import { Button, DefaultMantineColor, ButtonVariant } from '@mantine/core';

export const defaultButtonConfig = {
  color: 'violet'
};

export default function ButtonComponent({
  onClick,
  loading,
  color,
  variant,
  children,
  className,
  testId,
  type,
}: {
  onClick?: () =>  void
  loading?: boolean;
  type?: 'submit' | 'button';
  color?: DefaultMantineColor;
  className?: string;
  children: any;
  testId?: string;
  variant?: ButtonVariant;
}) {


  return (
    <Button
      loading={loading}
      data-test-id={testId}
      className={className}
      color={color}
      type={type}
      variant={variant}
      onClick={onClick && onClick}>
      {children}
    </Button>
  );
}
