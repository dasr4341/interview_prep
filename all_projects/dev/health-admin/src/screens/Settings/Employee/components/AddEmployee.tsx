import React from 'react';
import { Menu, Button } from '@mantine/core';
import { BsChevronDown } from 'react-icons/bs';
import { routes } from 'routes';
import { useNavigate } from 'react-router-dom';
import './_add-employee.scoped.scss';

export default function AddEmployee() {
  const navigate = useNavigate();

  return (
    <div className='add-employee-dropdown-menu'>
      <Menu width={200} shadow="md">
        <Menu.Target>
          <Button 
            className='btn hover:border-yellow-800 hover:bg-yellow-800 hover:text-black px-6 md:px-14 h-11 justify-center flex items-center'>
              Add
              <BsChevronDown size={17} className="ml-1" />
          </Button>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Item 
            onClick={() => navigate(routes.admin.careTeam.create.match)}
            className='py-3 hover:text-primary-light cursor-pointer font-semibold text-xs outline-none block capitalize'
          >
            Add Staff
          </Menu.Item>
          <Menu.Divider />
          <Menu.Item 
            onClick={() => navigate(routes.admin.employeeUpload.match)} 
            className='py-3 hover:text-primary-light cursor-pointer font-semibold text-xs outline-none block capitalize'
          >
            Upload CSV
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </div>
  );
}
