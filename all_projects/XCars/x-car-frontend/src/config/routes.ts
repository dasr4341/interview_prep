export const routes = {
  logout: {
    name: 'Logout',
    path: '/logout',
  },
  loginIn: {
    name: 'LoginIn',
    path: '/login',
  },
  home: {
    name: 'Home',
    path: '/',
  },
  buyCars: {
    name: 'Buy Used cars',
    path: '/buy-used-cars',
    build: (carId: string) => `/buy-used-cars/${carId}`,
    // TODO
    order: (carId: string, orderId: string) =>
      `/buy-used-cars/${carId}/${orderId}`,
  },
  registerDealer: {
    name: 'Dealer registration',
    path: '/dealer-registration',
  },
  account: {
    name: 'Account',
    path: '/account',
    children: {
      orders: {
        name: 'My orders',
        path: '/account/orders',
        build: (orderId: string) => `/account/orders/${orderId}`,
      },
      quotes: {
        name: 'My quotes',
        path: '/account/quotes',
      },
    },
  },
};
