import React from "react";
import { routes } from "../../../Lib/Routes/Routes";
import Navbar from './Navbar';
// import AddIcon from "../../Icons/Add-Icon";

export interface NavDataInterface{
  tab: string;
  path: string;
}
export default function Header() {
  const navData: NavDataInterface[] = [
    { tab: "Home", path: routes.home.path },
    { tab: "Blogs", path: routes.blogs.path },
    { tab: "About Us", path: routes.aboutUs.path },
    { tab: "Contact Us", path: routes.contactUs.path },
  ];
  return (
    <section className="header h-[50%]">
      {/* nav-bar */}
      <Navbar navData={navData} />
      <div className="h-80 relative overflow-hidden ">
        {/* header */}
        <div className="absolute top-[50%] left-[50%] transform-center flex flex-col justify-center items-center bg-theme-semiTransparent py-4 px-6 rounded ">
          <div className="text-6xl text-white font-extrabold text-center">
            Hollo ! Welcome
          </div>
          <div className="text-sm text-white tracking-widest mt-4 font-bold">
            SignIN. Create. Publish.
          </div>
        </div>
      </div>
    </section>
  );
}
