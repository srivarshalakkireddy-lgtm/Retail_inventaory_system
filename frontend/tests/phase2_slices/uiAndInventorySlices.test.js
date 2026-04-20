import uiReducer, { toggleSidebar, setSidebarOpen, toggleTheme } from '@src/store/slices/uiSlice';
import inventoryReducer, { getInventory, adjustInventory, reset as inventoryReset } from '@src/store/slices/inventorySlice';

jest.mock('@src/services/inventoryService');

// ─── UI SLICE ────────────────────────────────────────────────────────────────
describe('uiSlice', () => {
  const initialState = { sidebarOpen: true, theme: 'light' };

  it('should return the initial state', () => {
    expect(uiReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('toggleSidebar should flip sidebarOpen', () => {
    let state = uiReducer(initialState, toggleSidebar());
    expect(state.sidebarOpen).toBe(false);

    state = uiReducer(state, toggleSidebar());
    expect(state.sidebarOpen).toBe(true);
  });

  it('setSidebarOpen should set sidebar to specific value', () => {
    const state = uiReducer(initialState, setSidebarOpen(false));
    expect(state.sidebarOpen).toBe(false);
  });

  it('toggleTheme should switch between light and dark', () => {
    let state = uiReducer(initialState, toggleTheme());
    expect(state.theme).toBe('dark');

    state = uiReducer(state, toggleTheme());
    expect(state.theme).toBe('light');
  });
});

// ─── INVENTORY SLICE ──────────────────────────────────────────────────────────
describe('inventorySlice', () => {
  const initialState = {
    inventory: [],
    isLoading: false,
    error: null,
    pagination: { page: 1, limit: 20, total: 0, totalPages: 0 },
  };

  beforeEach(() => jest.clearAllMocks());

  it('should return initial state', () => {
    expect(inventoryReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('reset should clear loading and error', () => {
    const state = { ...initialState, isLoading: true, error: 'err' };
    expect(inventoryReducer(state, inventoryReset())).toMatchObject({ isLoading: false, error: null });
  });

  it('getInventory.pending should set isLoading=true', () => {
    const state = inventoryReducer(initialState, { type: getInventory.pending.type });
    expect(state.isLoading).toBe(true);
  });

  it('getInventory.fulfilled should populate inventory list', () => {
    const payload = {
      data: [{ id: 1, quantity_available: 100 }],
      pagination: { page: 1, limit: 20, total: 1, totalPages: 1 },
    };
    const state = inventoryReducer(initialState, { type: getInventory.fulfilled.type, payload });
    expect(state.inventory).toEqual(payload.data);
    expect(state.pagination).toEqual(payload.pagination);
    expect(state.isLoading).toBe(false);
  });

  it('adjustInventory.fulfilled should update existing inventory item', () => {
    const existingState = {
      ...initialState,
      inventory: [{ id: 1, product_id: 10, location_id: 5, quantity_available: 20 }],
    };
    const updatedItem = { id: 1, product_id: 10, location_id: 5, quantity_available: 25 };
    const payload = { data: updatedItem };

    const state = inventoryReducer(existingState, { type: adjustInventory.fulfilled.type, payload });
    expect(state.inventory[0].quantity_available).toBe(25);
  });

  it('adjustInventory.fulfilled should add an item if it is a new product/location combo', () => {
    const existingState = {
      ...initialState,
      inventory: [{ id: 1, product_id: 10, location_id: 5, quantity_available: 20 }],
    };
    const newItem = { id: 2, product_id: 99, location_id: 5, quantity_available: 50 };
    const payload = { data: newItem };

    const state = inventoryReducer(existingState, { type: adjustInventory.fulfilled.type, payload });
    expect(state.inventory).toHaveLength(2);
    expect(state.inventory[0]).toEqual(newItem); // Added to front with unshift
  });
});
