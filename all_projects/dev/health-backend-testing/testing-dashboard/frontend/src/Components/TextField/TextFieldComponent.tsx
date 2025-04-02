import { TextInput } from '@mantine/core';
import { UseFormRegisterReturn } from 'react-hook-form';

export default function TextFieldComponent({
  placeholder,
  type = 'text',
  register,
  label,
  size = 'lg'
}: {
  icon: JSX.Element;
  placeholder: string;
  type?: 'text' | 'password';
  register: UseFormRegisterReturn,
  label?: string;
  size?: string;
}) {
  return (
    <TextInput type={type} label={label} placeholder={placeholder}  {...register} className='mb-4' size={size} />
  );
}
