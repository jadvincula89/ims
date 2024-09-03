import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { authSlice } from './slice/auth';
import storage from 'redux-persist/lib/storage';
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER
} from 'redux-persist';
import { authApi } from '../services/auth';
import { categoryApi } from '../services/category';
import { sizeApi } from '../services/size';
import { locationApi } from '../services/location';
import { conditionApi } from '../services/condition';

import { maintenanceApi } from '../services/maintenance';
import { productTypeApi } from '../services/product_type';
import { shelfApi } from '../services/shelf';
import { sellerTypeApi } from '../services/seller_type';
import { stockadjustmentApi } from '../services/stockadjustment';
import { pricechangeApi } from '../services/pricechange';
import { productApi } from '../services/product';
import { transactionApi } from '../services/transaction';
import { configSlice } from './slice/config';
import { stocktakeApi } from '../services/stocktake';
import { fileApi } from '../services/file';

const rootPersistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth']
};

const rootReducer = combineReducers({
  auth: authSlice.reducer,
  config: configSlice.reducer,

  [authApi.reducerPath]: authApi.reducer,
  [categoryApi.reducerPath]: categoryApi.reducer,
  [sizeApi.reducerPath]: sizeApi.reducer,
  [locationApi.reducerPath]: locationApi.reducer,
  [conditionApi.reducerPath]: conditionApi.reducer,
  [shelfApi.reducerPath]: shelfApi.reducer,
  [maintenanceApi.reducerPath]: maintenanceApi.reducer,
  [productTypeApi.reducerPath]: productTypeApi.reducer,
  [sellerTypeApi.reducerPath]: sellerTypeApi.reducer,
  [stockadjustmentApi.reducerPath]: stockadjustmentApi.reducer,
  [pricechangeApi.reducerPath]: pricechangeApi.reducer,
  [productApi.reducerPath]: productApi.reducer,
  [transactionApi.reducerPath]: transactionApi.reducer,
  [stocktakeApi.reducerPath]: stocktakeApi.reducer,
  [fileApi.reducerPath]: fileApi.reducer
});

const persistedReducer = persistReducer(rootPersistConfig, rootReducer);

export default rootReducer;

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
      }
    }).concat([
      authApi.middleware,
      categoryApi.middleware,
      sizeApi.middleware,
      shelfApi.middleware,
      locationApi.middleware,
      conditionApi.middleware,
      maintenanceApi.middleware,
      productTypeApi.middleware,
      sellerTypeApi.middleware,
      stockadjustmentApi.middleware,
      pricechangeApi.middleware,
      productApi.middleware,
      transactionApi.middleware,
      stocktakeApi.middleware,
      fileApi.middleware
    ])
});

export const persistor = persistStore(store);
