import React from 'react';
import { appRoutes } from './routes';
import { Outlet, Route, Routes, useRoutes } from 'react-router-dom';
import HomePage from 'screens/HomePage/HomePage';


const NestedRoutes = () => <>
    <Routes >
        <Route element={<>hey i am parent<Outlet/></>}>
            <Route path='/1' element={<>h1</>} />
            <Route path='/2' element={<>h2</>} />
            <Route path='/3' element={<>h3</>} />
        </Route>
    </Routes>
</>;
export default function AppWrapper() {
    // Helps in creating routes using state hooks
    // const appRoutes = useRoutes();

    return (
        <Routes>
            <Route path={appRoutes.home.path} element={<HomePage />} />
            <Route element={<NestedRoutes/>} path='/nested/*' />
            <Route element={<>No Page found</>} path='*' />
        </Routes>
    );
}
