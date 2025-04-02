import { FieldTypes } from 'interface/dynamic-field-data.interface';
import { TbLayoutGridAdd } from 'react-icons/tb';
import { Menu, Button } from '@mantine/core';
import './_add-new-field.scoped.scss';

export default function AddNewField({
  updateFieldType,
  disabled,
  order
} : {
    updateFieldType: (type: FieldTypes, disabled: boolean) => void,
    disabled: boolean,
    order?: string
}) {
  return (
    <div className={`dropdown_menu ${order ?? ''} ${disabled && 'cursor-wait'}`}>
      <Menu width={200}>
        <Menu.Target>
          <Button 
            type="button" 
            className='btn-light hover:border-primary hover:bg-primary hover:text-white active:translate-y-0 py-2 px-6' 
            size='md'
            >
              <TbLayoutGridAdd className="mr-2" />Add new field
            </Button>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Item 
            onClick={() => updateFieldType('text', disabled)} 
            className='py-3 hover:text-primary-light uppercase cursor-pointer font-semibold text-xs'>
              Text
          </Menu.Item>

          <Menu.Divider />

          <Menu.Item 
            onClick={() => updateFieldType('textarea', disabled)} 
            className='py-3 hover:text-primary-light uppercase cursor-pointer font-semibold text-xs'>
              Textarea
          </Menu.Item>

          <Menu.Divider />

          <Menu.Item 
            onClick={() => updateFieldType('date', disabled)} 
            className='py-3 hover:text-primary-light uppercase cursor-pointer font-semibold text-xs'>
              Date
          </Menu.Item>

          <Menu.Divider />

          <Menu.Item 
            onClick={() => updateFieldType('radio', disabled)} 
            className='py-3 hover:text-primary-light uppercase cursor-pointer font-semibold text-xs'>
              Radio Button
          </Menu.Item>

          <Menu.Divider />

          <Menu.Item 
            onClick={() => updateFieldType('checkbox', disabled)} 
            className='py-3 hover:text-primary-light uppercase cursor-pointer font-semibold text-xs'>
              Checkbox
          </Menu.Item>

          <Menu.Divider />

          <Menu.Item 
            onClick={() => updateFieldType('dropdown', disabled)} 
            className='py-3 hover:text-primary-light uppercase cursor-pointer font-semibold text-xs'>
              Dropdown
          </Menu.Item>

          <Menu.Divider />

          <Menu.Item 
            onClick={() => updateFieldType('range', disabled)} 
            className='py-3 hover:text-primary-light uppercase cursor-pointer font-semibold text-xs'>
              Range
          </Menu.Item>

          <Menu.Divider />

          <Menu.Item 
            onClick={() => updateFieldType('html', disabled)} 
            className='py-3 hover:text-primary-light uppercase cursor-pointer font-semibold text-xs'>
              HTML
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </div>
  );
}
