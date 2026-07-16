import React, { Suspense, lazy } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import MainLayout from './layouts/client/MainLayout';
import DashboardLayout from './layouts/dashboard/DashboardLayout';
import LoadingLayout from './common/loading/LoadingLayout';
import ProtectedRoute from './components/protectedrouter/ProtectedRouter';
import ScrollToTop from "./common/scroll/ScrollToTop";

const HomePages = lazy(() => import('./pages/client/homepage/HomePages'));
const Dashboard = lazy(() => import('./pages/dashboard/main/Dashboard'));
const AddCategory = lazy(() => import('./pages/dashboard/category/AddCategory'));
const CategoryList = lazy(() => import('./pages/dashboard/category/CategoryList'));
const UpdateCategory = lazy(() => import('./pages/dashboard/category/UpdateCategory'));
const AddProduct = lazy(() => import('./pages/dashboard/product/AddProduct'));
const ProductList = lazy(() => import('./pages/dashboard/product/ProductList'));
const UpdateProduct = lazy(() => import('./pages/dashboard/product/UpdateProduct'));
const UpdateProductImage = lazy(() => import('./pages/dashboard/product/UpdateProductImage'));
const ProductDetailPage = lazy(() => import('./pages/client/product/ProductDetailPage'));
const OrderProductPage = lazy(() => import('./pages/client/product/OrderProductPage'));
const OrderList = lazy(() => import('./pages/dashboard/order/OrderList'));
const MyOrder = lazy(() => import('./pages/client/order/MyOrder'));
const OrderDetail = lazy(() => import('./pages/dashboard/order/OrderDetail'));
const MyOrderDetail = lazy(() => import('./pages/client/order/MyOrderDetail'));
const UserInfo = lazy(() => import('./pages/client/user/UserInfo'));
const UserList = lazy(() => import('./pages/dashboard/users/UserList'));
const UserDetail = lazy(() => import('./pages/dashboard/users/UserDetail'));
const UpdateBanner = lazy(() => import('./pages/dashboard/banner/UpdateBanner'));
const UpdateLogo = lazy(() => import('./pages/dashboard/logo/UpdateLogo'));
const CartProductPage = lazy(() => import('./pages/client/product/CartProductPage'));
const SortCategory = lazy(() => import('./pages/dashboard/category/SortCategory'));
const ProductItemPage = lazy(() => import('./pages/client/product/ProductItemPage'));
const ProductContactDetailPage = lazy(() => import('./pages/client/product/ProductContactDetailPage'));
const ContactNowPage = lazy(() => import('./pages/client/product/ContactNowPage'));
const ContactList = lazy(() => import('./pages/dashboard/contact/ContactList'));
const ContactPage = lazy(() => import('./pages/client/contact/ContactPage'));
const ProductByCategoryGroupPage = lazy(() => import('./pages/client/product/ProductByCategoryGroupPage'));

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <ScrollToTop />
        <MainLayout />
      </>
    ),
    children: [
      {
        index: true,
        element: <HomePages />
      },
      {
        path: "product-detail/:id",
        element: <ProductDetailPage />
      },
      {
        path: "product-contact/:id",
        element: <ProductContactDetailPage />
      },
      {
        path: "contact-now",
        element: <ContactNowPage />
      },
      {
        path: "product-category-group/:id",
        element: <ProductByCategoryGroupPage />
      },
      {
        path: "category-group/:id",
        element: <ProductItemPage />
      },
      {
        path: "contact-page",
        element: <ContactPage />
      },
      {
        path: "order-product",
        element: (
          <ProtectedRoute>
            <OrderProductPage />
          </ProtectedRoute>
        )
      },
      {
        path: "my-orders",
        element: (
          <ProtectedRoute>
            <MyOrder />
          </ProtectedRoute>
        )
      },
      {
        path: "user-info",
        element: (
          <ProtectedRoute>
            <UserInfo />
          </ProtectedRoute>
        )
      },
      {
        path: "my-order-detail/:id",
        element: (
          <ProtectedRoute>
            <MyOrderDetail />
          </ProtectedRoute>
        )
      },
      {
        path: "cart-product",
        element: (
          <ProtectedRoute>
            <CartProductPage />
          </ProtectedRoute>
        )
      },
    ]
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute requiredRole="ADMIN">
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Dashboard />
      },
      {
        path: "add-category",
        element: <AddCategory />
      },
      {
        path: "category-list",
        element: <CategoryList />
      },
      {
        path: "category-sort",
        element: <SortCategory />
      },
      {
        path: "update-category/:id",
        element: <UpdateCategory />
      },
      {
        path: "add-product",
        element: <AddProduct />
      },
      {
        path: "product-list",
        element: <ProductList />
      },
      {
        path: "update-product/:id",
        element: <UpdateProduct />
      },
      {
        path: "view-product-images/:id",
        element: <UpdateProductImage />
      },
      {
        path: "order-list",
        element: <OrderList />
      },
      {
        path: "order-detail/:id",
        element: <OrderDetail />
      },
      {
        path: "user-list",
        element: <UserList />
      },
      {
        path: "user-detail/:id",
        element: <UserDetail />
      },
      {
        path: "view-banner",
        element: <UpdateBanner />
      },
      {
        path: "contact-list",
        element: <ContactList />
      },
      {
        path: "view-logo",
        element: <UpdateLogo />
      },

    ]
  },
]);

// Khởi tạo bộ định tuyến và hiển thị cấu trúc chính của ứng dụng.
const App = () => {
  return (
    <Suspense fallback={<LoadingLayout loading={true} />}>
      <RouterProvider router={router} />
    </Suspense>
  );
};

export default App;