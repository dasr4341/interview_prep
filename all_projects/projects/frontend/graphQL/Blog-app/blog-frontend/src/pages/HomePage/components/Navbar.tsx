import React from 'react';
import NavBarLinks from "../../../components/NavbarLinks";
import { NavDataInterface } from './Header';

export default function Navbar({ navData }: {navData: NavDataInterface[]}) {
    return (
       <div className="flex justify-between w-full p-4 items-center">
        <div className="text-white text-xl font-semibold">SAM.</div>
        <ul className="md:flex flex-row list-none text-white hidden items-center">
          {navData.map((e, i) => {
            return <NavBarLinks key={i} path={e.path} tab={e.tab}  />;
          })}
          {/* <NavBarLinks tab='SignIn' onClick={()=>setLoginRegModal(true)}  /> */}
        </ul>
      </div>
    );
}
