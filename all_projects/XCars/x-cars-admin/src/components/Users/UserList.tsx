'use client';
import { routes } from '@/config/routes';
import { User } from '@/generated/graphql';
import { GET_ALL_USERS } from '@/graphql/getAllCustomer.query';
import catchError from '@/lib/catch-error';
import { useLazyQuery } from '@apollo/client';
import { Paper } from '@mantine/core';
import { DataGridPro, GridColDef } from '@mui/x-data-grid-pro';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

export const UserList = () => {
  const router = useRouter();
  const [userList, setUserList] = useState<User[]>([]);
  const [getAllUserList, { loading }] = useLazyQuery(GET_ALL_USERS, {
    onCompleted: (d) => {
      if (d.getAllCustomers.data) {
        const userData = d.getAllCustomers.data.map((user) => {
          return {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            status: user.status,
            email: user.email,
            phoneNumber: user.phoneNumber,
          };
        });
        setUserList(userData as User[]);
      }
    },
    onError: (e) => catchError(e),
  });

  const columns: GridColDef[] = [
    {
      field: 'firstName',
      headerName: 'Customer Name',
      flex: 1,
      minWidth: 200,
      renderCell: (params) => {
        return (
          <div>
            {params.row.firstName} {params.row.lastName}
          </div>
        );
      },
    },
    {
      field: 'email',
      headerName: 'Email',
      flex: 1,
      minWidth: 200,
    },
    {
      field: 'phoneNumber',
      headerName: 'Phone Number',
      flex: 1,
      minWidth: 200,
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      minWidth: 200,
    },
  ];

  useEffect(() => {
    getAllUserList();
  }, [getAllUserList]);

  return (
    <section className="p-6 flex flex-col h-full gap-6 ">
      <div className="font-semibold text-3xl text-teal-900">Users</div>
      <Paper className="w-full flex-1 overflow-scroll h-full">
        <DataGridPro
          loading={loading}
          rows={userList}
          columns={columns}
          disableDensitySelector
          filterDebounceMs={300}
          disableColumnSelector
          disableRowSelectionOnClick
          sx={{
            border: 0,
            '& .MuiDataGrid-row:hover': {
              color: 'blue',
              cursor: 'pointer',
            },
            width: '100%',
            overflowX: 'auto',
          }}
          onRowClick={(params) =>
            params.id &&
            router.push(
              routes.dashboard.children.userList.children.userDetails.path(
                String(params.id)
              )
            )
          }
        />
      </Paper>
    </section>
  );
};
