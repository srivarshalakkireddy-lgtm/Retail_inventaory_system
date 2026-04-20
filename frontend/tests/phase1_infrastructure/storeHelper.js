/**
 * Redux Store Helper for Tests
 * Creates an isolated Redux store with real reducers so we can
 * test slices without a browser or backend running.
 */
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../../../src/store/slices/authSlice';
import productReducer from '../../../src/store/slices/productSlice';
import inventoryReducer from '../../../src/store/slices/inventorySlice';
import orderReducer from '../../../src/store/slices/orderSlice';
import supplierReducer from '../../../src/store/slices/supplierSlice';
import uiReducer from '../../../src/store/slices/uiSlice';
import userReducer from '../../../src/store/slices/userSlice';

export const createTestStore = (preloadedState = {}) =>
  configureStore({
    reducer: {
      auth: authReducer,
      products: productReducer,
      inventory: inventoryReducer,
      orders: orderReducer,
      suppliers: supplierReducer,
      ui: uiReducer,
      users: userReducer,
    },
    preloadedState,
  });
