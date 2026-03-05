import { createBrowserRouter, Navigate } from 'react-router-dom';
import MainLayout from '../layout/MainLayout';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import ProductList from '../pages/Product/List';
import CategoryList from '../pages/Product/Category';
import AdminList from '../pages/System/Admin';

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        path: '/',
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
      {
        path: 'product/list',
        element: <ProductList />,
      },
      {
        path: 'product/category',
        element: <CategoryList />,
      },
      {
        path: 'system/admin',
        element: <AdminList />,
      },
    ],
  },
]);

export default router;
