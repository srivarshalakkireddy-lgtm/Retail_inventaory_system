import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import productReducer from './slices/productSlice';
import inventoryReducer from './slices/inventorySlice';
import orderReducer from './slices/orderSlice';
import uiReducer from './slices/uiSlice';
import supplierReducer from './slices/supplierSlice';
import userReducer from './slices/userSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
    inventory: inventoryReducer,
    orders: orderReducer,
    ui: uiReducer,
    suppliers: supplierReducer,
    users: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
