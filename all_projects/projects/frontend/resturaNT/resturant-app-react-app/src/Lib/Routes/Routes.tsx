import { OrderPage } from '../Helper/constants';
export const routes = {
  home: {
    path: '/',
  },
  login: {
    path: '/login'
  },
  forgetPassword: {
    path: '/forget-password',
    children: {
      updatePassword: {
        path: '/:token',
        fullPath: '/forget-password/:token'
      }
    }
  },
  register: {
    path: '/register'
  },
  orderStatus: {
    path: '/order-status/:orderId',
  },
  dashboard: {
    path: '/dashboard',

    children: {
      me: {
        path: 'me',
        fullPath: '/dashboard/me'
      },

      menu: {
        path: 'menu',
        fullPath: '/dashboard/menu',

        children: {
          item_availability: {
            path: '/dashboard/menu/item_availability',
            fullPath: '/dashboard/menu/item_availability'
          },
          menu_editor: {
            path: '/dashboard/menu/menu_editor',
            fullPath: '/dashboard/menu/menu_editor'
          },
          out_of_stock: {
            path: '/dashboard/menu/out_of_stock',
            fullPath: '/dashboard/menu/out_of_stock'
          }
        }
      },
      postList: {
        path: 'post-list',
        fullPath: '/dashboard/post-list'
      },
      order: {
        path: 'order',
        fullPath: '/dashboard/order',

        children: {
          pages: {
            path: (pageType: OrderPage) => `${pageType}`,
            fullPath: (pageType: OrderPage, orderId?: number) => `/dashboard/order/${pageType}/${!!orderId ? orderId : ''}`,
          },
        },
        
      },
      cart: {
        path: 'cart',
        fullPath: '/dashboard/cart'
      },
      reset: {
        path: 'reset-password/',
        fullPath: '/dashboard/reset-password/'
      }
    },
  },

};

export default routes;
