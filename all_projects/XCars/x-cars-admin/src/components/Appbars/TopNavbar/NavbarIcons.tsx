import { INavbarIcon } from './navbarIcons.interface';

const NavbarIcons = ({ children, className, notification }: INavbarIcon) => {
  return (
    <div className={` rounded-2xl  bg-opacity-25 p-3 relative ${className} `}>
      {children}
      {notification > 0 && (
        <span
          className={`absolute -top-2 -right-1  border-[3px] p-2 border-white text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center ${className}`}
        >
          {notification > 99 ? '99+' : notification}
        </span>
      )}
    </div>
  );
};

export default NavbarIcons;
