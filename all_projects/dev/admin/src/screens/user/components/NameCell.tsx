import { UserTableRow } from 'interface/user-table-row.interface';
import React from 'react';
import { Link } from 'react-router-dom';
import { routes } from 'routes';

export default function NameCell({ data }: { data: UserTableRow }) {
  return (
    <>
      <Link to={routes.UserDetails.build(data.id)} className="link" data-test-id="name-col">
        {data?.firstName} {data?.lastName}
      </Link>
    </>
  );
}
