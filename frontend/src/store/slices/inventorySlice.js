import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import inventoryService from '../../services/inventoryService';

const initialState = {
  inventory: [],
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  },
};

export const getInventory = createAsyncThunk(
  'inventory/getAll',
  async (params, thunkAPI) => {
    try {
      return await inventoryService.getInventory(params);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const adjustInventory = createAsyncThunk(
  'inventory/adjust',
  async (adjustmentData, thunkAPI) => {
    try {
      return await inventoryService.adjustInventory(adjustmentData);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getInventory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getInventory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.inventory = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(getInventory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(adjustInventory.fulfilled, (state, action) => {
        const index = state.inventory.findIndex(
          (inv) => inv.product_id === action.payload.data.product_id && inv.location_id === action.payload.data.location_id
        );
        if (index !== -1) {
          state.inventory[index] = action.payload.data;
        } else {
          // It's a new inventory record for that location/product combo, push it
          state.inventory.unshift(action.payload.data);
        }
      });
  },
});

export const { reset } = inventorySlice.actions;
export default inventorySlice.reducer;
