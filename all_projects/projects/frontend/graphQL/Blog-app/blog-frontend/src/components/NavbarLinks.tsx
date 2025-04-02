import React from "react";
import { Link } from "react-router-dom";

export default function NavBarLinks({
  tab,
  path,
  onClick,
}: {
  tab: string;
  path: string;
  onClick?: () => void;
}) {
  return (
    <Link to={path}>
      <li
        className="p-2 tracking-widest m-1 hover:text-blue-400 cursor-pointer rounded font-medium "
              onClick={() => onClick && onClick()}
      >
        {tab}
      </li>
    </Link>
  );
}
