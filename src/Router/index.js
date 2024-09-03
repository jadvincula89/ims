import React from 'react';
import { Navigate, createBrowserRouter } from 'react-router-dom';

import VerticalLayout from '../Layouts/index';
import Cover404 from '../pages/AuthenticationInner/Errors/Cover404';

import { AuthProtected } from './AuthProtected';
import Login from '../pages/Authentication/Login';
import Logout from '../pages/Authentication/Logout';

import Products from '../pages/Maintenance/Products';
import ProductDetail from '../pages/Maintenance/Products/ProductDetail';
import AddProduct from '../pages/Maintenance/Products/AddProduct';

import Category from '../pages/Maintenance/Categories';

import Sizes from '../pages/Maintenance/Sizes';

import ProductTypes from '../pages/Maintenance/ProductTypes';

import Locations from '../pages/Maintenance/Locations';

import Conditions from '../pages/Maintenance/Conditions';
import Shelf from '../pages/Maintenance/Shelf';
import SellerType from '../pages/Maintenance/SellerType';
import StockAdjustment from '../pages/Transaction/StockAdjustment';
import PriceChange from '../pages/Transaction/PriceChange';
import AddPriceAdjustment from '../pages/Transaction/PriceChange/AddPriceAdjustment';
import AddStockAdjustment from '../pages/Transaction/StockAdjustment/AddStockAdjustment';
import StockTake from '../pages/Transaction/StockTake';
import AddStocktake from '../pages/Transaction/StockTake/AddStocktake';
import ForgetPasswordPage from '../pages/Authentication/ForgetPassword';
import ResetPassword from '../pages/Authentication/ResetPassword';
import Quantities from '../pages/Maintenance/Quantities';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <AuthProtected>
        <Navigate to="/app" replace />
      </AuthProtected>
    )
  },
  {
    path: '/dashboard',
    element: (
      <AuthProtected>
        <Navigate to="/app" replace />
      </AuthProtected>
    )
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/forgot-password',
    element: <ForgetPasswordPage />
  },
  {
    path: '/reset-password',
    element: <ResetPassword />
  },
  {
    path: '/logout',
    element: <Logout />
  },
  {
    path: '/app',
    errorElement: <div>Error</div>,
    element: (
      <AuthProtected>
        <VerticalLayout />
      </AuthProtected>
    ),
    children: [
      {
        path: '/app',
        element: <Products />
      },

      /********************** MAINTENANCE ******************/

      // Products
      {
        path: '/app/products',
        element: <Products />
      },
      {
        path: '/app/products/new',
        element: <AddProduct />
      },
      {
        path: '/app/products/:id',
        element: <ProductDetail />
      },
      {
        path: '/app/products/:id/edit',
        element: <AddProduct />
      },

      // Categories
      {
        path: '/app/categories',
        element: <Category />
      },

      // Sizes
      {
        path: '/app/sizes',
        element: <Sizes />
      },
      {
        path: '/app/seller-types',
        element: <SellerType />
      },
      {
        path: '/app/shelves',
        element: <Shelf />
      },
      // Product Types
      {
        path: '/app/brands',
        element: <ProductTypes />
      },

      // Locations
      {
        path: '/app/locations',
        element: <Locations />
      },

      // Conditions
      {
        path: '/app/conditions',
        element: <Conditions />
      },
      {
        path: '/app/quantities',
        element: <Quantities />
      },
      /********************** MAINTENANCE ******************/

      /********************** TRANSACTIONS ******************/
      {
        path: '/app/sadj',
        element: <StockAdjustment />
      },
      {
        path: '/app/price-adj',
        element: <PriceChange />
      },
      {
        path: '/app/price-adj/new',
        element: <AddPriceAdjustment />
      },
      {
        path: '/app/price-adj/:sadj_id/edit',
        element: <AddPriceAdjustment />
      },

      {
        path: '/app/sadj/new',
        element: <AddStockAdjustment />
      },
      {
        path: '/app/sadj/:sadj_id/edit',
        element: <AddStockAdjustment />
      },
      {
        path: '/app/stocktake',
        element: <StockTake />
      },
      {
        path: '/app/stocktake/:id/new',
        element: <AddStocktake />
      },
      {
        path: '/app/stocktake/:id/edit',
        element: <AddStocktake />
      }
      /********************** TRANSACTIONS ******************/
    ]
  },
  {
    path: '*',
    element: <Cover404 />
  }
]);

export default router;
