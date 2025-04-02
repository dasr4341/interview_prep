import { FaUserCircle } from 'react-icons/fa';
import { IoDocumentsOutline, IoPower, IoStatsChart } from 'react-icons/io5';
import { RxDashboard } from 'react-icons/rx';
import { RiBillLine, RiErrorWarningLine } from 'react-icons/ri';
import { PiSteeringWheelBold } from 'react-icons/pi';
import { TbTransactionRupee, TbUsersGroup } from 'react-icons/tb';
import { RiGalleryLine } from 'react-icons/ri';
import { MdOutlineSell } from 'react-icons/md';
import { TbDeviceDesktopAnalytics } from 'react-icons/tb';
import { ImUsers } from 'react-icons/im';
import { GiCheckMark } from 'react-icons/gi';

export const dashboardRootRoute = {
  name: 'Dashboard',
  path: '/dashboard',
  icon: <RxDashboard size={'25px'} />,
};

function getPath(path: string, id?: string) {
  const route = `${dashboardRootRoute.path}/${path}`;
  return id ? `${route}/${id}` : route;
}
// --------------------------------------------------------------------------
// these are protected routes that are accessible after login
// --------------------------------------------------------------------------

const carDetails = {
  name: 'Cars',
  children: {
    dashboard: {
      name: 'CarDashboard',
      path: (carId: string) => getPath('cars', `${carId}/dashboard`),
      icon: <RxDashboard size={'20px'} />,
    },
    gallery: {
      name: 'Gallery',
      path: (carId: string) => getPath('cars', `${carId}/gallery`),
      icon: <RiGalleryLine size={'20px'} />,
    },
    products: {
      name: 'Products',
      path: (carId: string) => getPath('cars', `${carId}/products`),
      icon: <MdOutlineSell size={'20px'} />,
    },
    quotations: {
      name: 'Quotations',
      path: (carId: string) => getPath('cars', `${carId}/quotations`),
      icon: <RiBillLine size={'20px'} />,
    },
    leads: {
      name: 'Leads',
      path: (carId: string) => getPath('cars', `${carId}/leads`),
      icon: <IoStatsChart size={'20px'} />,
    },
    carViews: {
      name: 'Viewers',
      path: (carId: string) => getPath('cars', `${carId}/views`),
      icon: <TbDeviceDesktopAnalytics size={'20px'} />,
    },
    markAsSold: {
      name: 'Mark As Sold',
      path: (carId: string) => getPath('cars', `${carId}/mark-as-sold`),
      icon: <GiCheckMark size={'20px'} />,
    },
    groundZero: {
      name: 'Danger Zone',
      path: (carId: string) => getPath('cars', `${carId}/ground-zero`),
      icon: <RiErrorWarningLine size={'20px'} />,
    },
  },
};

const dealerDetails = {
  name: 'Dealers',
  children: {
    dashboard: {
      name: 'Dealer Dashboard',
      path: (dealerId: string) => getPath('dealers', `${dealerId}/dashboard`),
      icon: <RxDashboard size={'20px'} />,
    },
    documents: {
      name: 'Documents',
      path: (dealerId: string) => getPath('dealers', `${dealerId}/documents`),
      icon: <IoDocumentsOutline size={'20px'} />,
    },
    quotations: {
      name: 'Quotations',
      path: (dealerId: string) => getPath('dealers', `${dealerId}/quotations`),
      icon: <RiBillLine size={'20px'} />,
    },
    leads: {
      name: 'Leads',
      icon: <IoStatsChart size={'20px'} />,
      path: (dealerId: string) => getPath('dealers', `${dealerId}/leads`),
    },
    cars: {
      name: 'Cars',
      icon: <PiSteeringWheelBold size={'20px'} />,
      path: (dealerId: string) => getPath('dealers', `${dealerId}/cars`),
    },
    groundZero: {
      name: 'Danger Zone',
      path: (dealerId: string) => getPath('dealers', `${dealerId}/ground-zero`),
      icon: <RiErrorWarningLine size={'20px'} />,
    },
  },
};

export const navbarRouters = {
  dealer: {
    name: 'Dealers',
    path: getPath('dealers'),
    icon: <TbUsersGroup size={'25px'} />,
    children: {
      dealersCarListing: (dealerId: string) =>
        getPath('cars', `?dealer-id=${dealerId}`),
      dealersLeadsListing: (dealerId: string) =>
        getPath('leads', `?dealer-id=${dealerId}`),
      quotations: {
        name: 'Quotation list',
        path: (dealerId: string) => getPath(`dealers/${dealerId}/quotations`),
      },
    },
  },
  carsListing: {
    name: 'Cars',
    path: getPath('cars'),
    icon: <PiSteeringWheelBold size={'25px'} />,
    children: {
      quotations: {
        name: 'Quotation list',
        path: (dealerId: string, carId: string) =>
          getPath(`dealers/${dealerId}/quotations?car-id=${carId}`),
      },
    },
  },
  leads: {
    name: 'Leads',
    path: getPath('leads'),
    icon: <IoStatsChart size={'25px'} />,
    build: (leadId: string) => getPath('leads', leadId),
    // eslint-disable-next-line no-unused-vars
    children: {
      link: {
        name: 'Leads',
        path: getPath('leads'),
      },
    },
  },
  transactions: {
    name: 'Transactions',
    path: getPath('transactions'),
    icon: <TbTransactionRupee size={'25px'} />,
  },
  userList: {
    name: 'Users',
    path: getPath('users'),
    icon: <ImUsers size={'25px'} />,
    children: {
      userDetails: {
        name: 'User Details',
        path: (userId: string) => getPath(`users/${userId}`),
      },
    },
  },
};

const protectedRoutes = {
  dashboard: {
    ...dashboardRootRoute,
    children: {
      profile: {
        name: 'Profile',
        path: getPath('profile'),
        icon: <FaUserCircle size={'20px'} />,
      },
      ...navbarRouters,
      carDetails,
      dealerDetails,
    },
  },
};

// --------------------------------------------------------------------------
// these are unprotected routes, i.e user can access this routes without login
// --------------------------------------------------------------------------
export const routes = {
  logout: {
    name: 'Logout',
    path: '/logout',
    children: {},
    icon: <IoPower size="20px" />,
  },
  login: {
    name: 'Login',
    path: '/',
    children: {},
  },
  resetPassword: {
    name: 'Forgot Password',
    path: '/reset-password',
    children: {},
  },
  ...protectedRoutes,
};
