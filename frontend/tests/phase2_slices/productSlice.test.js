import productReducer, {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  reset,
} from '@src/store/slices/productSlice';

jest.mock('@src/services/productService');

describe('productSlice', () => {
  const initialState = {
    products: [],
    product: null,
    isLoading: false,
    error: null,
    pagination: { page: 1, limit: 20, total: 0, totalPages: 0 },
  };

  beforeEach(() => jest.clearAllMocks());

  describe('reducers', () => {
    it('should return default initial state', () => {
      expect(productReducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });

    it('reset action should clear loading, error and single product', () => {
      const state = { ...initialState, isLoading: true, error: 'err', product: { id: 1 } };
      const nextState = productReducer(state, reset());
      expect(nextState.isLoading).toBe(false);
      expect(nextState.error).toBeNull();
      expect(nextState.product).toBeNull();
    });
  });

  describe('getProducts thunk', () => {
    it('should set isLoading true when pending', () => {
      const state = productReducer(initialState, { type: getProducts.pending.type });
      expect(state.isLoading).toBe(true);
    });

    it('should populate products list on fulfilled', () => {
      const payload = {
        data: [{ id: 1, name: 'Product A' }],
        pagination: { page: 1, limit: 20, total: 1, totalPages: 1 },
      };
      const state = productReducer(initialState, { type: getProducts.fulfilled.type, payload });
      expect(state.products).toEqual(payload.data);
      expect(state.pagination).toEqual(payload.pagination);
      expect(state.isLoading).toBe(false);
    });

    it('should set error on rejection', () => {
      const state = productReducer(initialState, { type: getProducts.rejected.type, payload: 'Error fetching' });
      expect(state.error).toBe('Error fetching');
      expect(state.isLoading).toBe(false);
    });
  });

  describe('createProduct thunk', () => {
    it('should push new product into list on fulfilled', () => {
      const existingState = { ...initialState, products: [{ id: 1, name: 'Old Product' }] };
      const newProduct = { id: 2, name: 'New Product' };
      const state = productReducer(existingState, { type: createProduct.fulfilled.type, payload: newProduct });

      expect(state.products).toHaveLength(2);
      expect(state.products[1]).toEqual(newProduct);
    });
  });

  describe('updateProduct thunk', () => {
    it('should update product in list on fulfilled', () => {
      const existingState = {
        ...initialState,
        products: [
          { id: 1, name: 'Old Name' },
          { id: 2, name: 'Other Product' },
        ],
      };
      const updatedProduct = { id: 1, name: 'Updated Name' };
      const state = productReducer(existingState, { type: updateProduct.fulfilled.type, payload: updatedProduct });

      expect(state.products[0].name).toBe('Updated Name');
      expect(state.products[1].name).toBe('Other Product'); // Unchanged
      expect(state.product).toEqual(updatedProduct);
    });
  });

  describe('deleteProduct thunk', () => {
    it('should remove product from list by id on fulfilled', () => {
      const existingState = {
        ...initialState,
        products: [{ id: 1, name: 'Product A' }, { id: 2, name: 'Product B' }],
      };
      const state = productReducer(existingState, { type: deleteProduct.fulfilled.type, payload: 1 });

      expect(state.products).toHaveLength(1);
      expect(state.products[0].id).toBe(2);
    });
  });
});
