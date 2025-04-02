import React from 'react';
import { NavLink, Outlet, useActionData, useAsyncError, useAsyncValue, useBeforeUnload, useOutletContext, useSearchParams } from 'react-router-dom';

export default function HomePage() {
    // takes data from url
    const [searchedParams, setSearchedParams] = useSearchParams();


    // <Outlet state={ { date: '' }  } />
    // used for accessing the data through outlet
    // const obj = useOutletContext();


    // const a = useActionData();
    // const b = useAsyncError();
    // const c = useAsyncValue();
    // const d = useBeforeUnload();


    return (
        <div>HomePage
 
            <NavLink state={{ data: 'hey' }} to='/test' style={({ isActive }) => isActive ? {} : {}}>
                {({ isActive }) =>  isActive ? 'I am Active' : ' Not Active'}
            </NavLink>
        </div>
    );
}
