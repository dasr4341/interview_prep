import React, { Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import routes from './Routes';
import LoadingOverLay from '../../Components/Loading/LoadingOverLay';
import Cart from '../../Page/Cart/Cart';
import CategoryPage from '../../Page/Category/CategoryPage';
import MenuEditorPage from '../../Page/Category/MenuEditorPage';
import MenuPage from '../../Page/Menu/MenuPage';
import UnAuthGuard from '../Guards/UnAuthGuard';
import OnlineGuard from '../Guards/OnlineGuard';
import OrderStatus from '../../Page/Order/OrderStatus';
const NotFound = React.lazy(() => import('../../Page/NotFoundPage'));
const LoginPage = React.lazy(() => import('../../Page/Login/LoginPage'));
const ForgetPassword = React.lazy(() => import('../../Page/ForgetPassword/ForgetPassword'));
const UpdateForgetPassword = React.lazy(() => import('../../Page/ForgetPassword/UpdatePassword/UpdatePassword'));
const RegisterPage = React.lazy(() => import('../../Page/Register/RegisterPage'));
const DashboardPage = React.lazy(() => import('../../Page/Dashboard/DashboardPage'));
const ProfilePage = React.lazy(() => import('../../Page/Profile/ProfilePage'));
const OrderPage = React.lazy(() => import('../../Page/Order/Order'));
const AllOrders = React.lazy(() => import('../../Page/Order/AllOrders'));
const ResetPassword = React.lazy(() => import('../../Page/Dashboard/ResetPassword/ResetPassword'));

export default function AppRoutes() {
  return (
    <div>
      <Suspense fallback={<LoadingOverLay />}>
        <Routes>
          <Route path={routes.home.path} element={<Navigate to={routes.login.path} />} />
          <Route element={<UnAuthGuard />}>
            <Route path={routes.login.path} element={<LoginPage />} />
            <Route path={routes.register.path} element={<RegisterPage />} />
          </Route>

          <Route path={routes.dashboard.path} element={<DashboardPage />}>
            <Route path={routes.dashboard.children.me.path} element={<ProfilePage />} />
            <Route path={routes.dashboard.children.cart.path} element={<Cart />} />
            <Route path={routes.dashboard.children.menu.path} element={<MenuPage />}>
              <Route path={routes.dashboard.children.menu.children.item_availability.path} element={<CategoryPage />} />
              <Route path={routes.dashboard.children.menu.children.menu_editor.path} element={<MenuEditorPage />} />
              <Route
                path={routes.dashboard.children.menu.children.out_of_stock.path}
                element={<div>Out of Stock</div>}
              />
            </Route>
            <Route element={<OnlineGuard />}>
              <Route path={routes.dashboard.children.order.path} element={<OrderPage />}>
                <Route path=':pageType' element={<AllOrders />}>
                  <Route path=':orderId' element={<AllOrders />} />
                </Route>
              </Route>
            </Route>
            <Route path={routes.dashboard.children.reset.path} element={<ResetPassword />} />
          </Route>
          <Route path={routes.forgetPassword.path} element={<ForgetPassword />} />
          <Route path={routes.forgetPassword.children.updatePassword.fullPath} element={<UpdateForgetPassword />} />
          <Route path={routes.orderStatus.path} element={<OrderStatus />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </Suspense>
    </div>
  );
}