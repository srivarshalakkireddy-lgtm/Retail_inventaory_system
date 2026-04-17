import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import supplierService from '../../services/supplierService';

const initialState = {
  suppliers: [],
  supplier: null,
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  },
};

export const getSuppliers = createAsyncThunk(
  'suppliers/getAll',
  async (params, thunkAPI) => {
    try {
      return await supplierService.getSuppliers(params);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getSupplier = createAsyncThunk(
  'suppliers/getOne',
  async (id, thunkAPI) => {
    try {
      return await supplierService.getSupplier(id);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const createSupplier = createAsyncThunk(
  'suppliers/create',
  async (supplierData, thunkAPI) => {
    try {
      return await supplierService.createSupplier(supplierData);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const updateSupplier = createAsyncThunk(
  'suppliers/update',
  async ({ id, supplierData }, thunkAPI) => {
    try {
      return await supplierService.updateSupplier(id, supplierData);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const supplierSlice = createSlice({
  name: 'suppliers',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.error = null;
      state.supplier = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSuppliers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getSuppliers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.suppliers = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(getSuppliers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(getSupplier.fulfilled, (state, action) => {
        state.isLoading = false;
        state.supplier = action.payload.data;
      })
      .addCase(createSupplier.fulfilled, (state, action) => {
        state.isLoading = false;
        state.suppliers.unshift(action.payload.data);
      })
      .addCase(updateSupplier.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.suppliers.findIndex((s) => s.id === action.payload.data.id);
        if (index !== -1) {
          state.suppliers[index] = action.payload.data;
        }
      });
  },
});

export const { reset } = supplierSlice.actions;
export default supplierSlice.reducer;
