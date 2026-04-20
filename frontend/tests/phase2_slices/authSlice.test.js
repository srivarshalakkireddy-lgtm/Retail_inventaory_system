import authReducer, {
  login,
  logout,
  getCurrentUser,
  reset,
} from '@src/store/slices/authSlice';
import authService from '@src/services/authService';

// Mock the service — we don't want to hit a real backend
jest.mock('@src/services/authService');

describe('authSlice', () => {
  // The initial state our reducer starts with
  const initialState = {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Clear localStorage between tests
    localStorage.clear();
  });

  // --- Testing the synchronous reducer actions ---
  describe('reducers', () => {
    it('should return the initial state', () => {
      expect(authReducer(undefined, { type: 'unknown' })).toMatchObject({
        isLoading: false,
        error: null,
        isAuthenticated: false,
      });
    });

    it('reset action should clear loading and error state', () => {
      const stateWithError = { ...initialState, isLoading: true, error: 'Some error' };
      const nextState = authReducer(stateWithError, reset());
      expect(nextState.isLoading).toBe(false);
      expect(nextState.error).toBeNull();
    });
  });

  // --- Testing the async thunks ---
  describe('login thunk', () => {
    it('should set isLoading=true when login is pending', () => {
      const action = { type: login.pending.type };
      const state = authReducer(initialState, action);
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should set user and isAuthenticated on successful login', () => {
      const fakeUser = { id: 1, first_name: 'John', token: 'abc123' };
      const action = { type: login.fulfilled.type, payload: { user: fakeUser } };
      const state = authReducer(initialState, action);

      expect(state.isLoading).toBe(false);
      expect(state.isAuthenticated).toBe(true);
      expect(state.user).toEqual(fakeUser);
    });

    it('should set error on failed login', () => {
      const action = { type: login.rejected.type, payload: 'Invalid credentials' };
      const state = authReducer(initialState, action);

      expect(state.isLoading).toBe(false);
      expect(state.isAuthenticated).toBe(false);
      expect(state.user).toBeNull();
      expect(state.error).toBe('Invalid credentials');
    });
  });

  describe('logout thunk', () => {
    it('should clear user and isAuthenticated on logout', () => {
      const loggedInState = { ...initialState, user: { id: 1 }, isAuthenticated: true };
      const action = { type: logout.fulfilled.type };
      const state = authReducer(loggedInState, action);

      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
    });
  });

  describe('getCurrentUser thunk', () => {
    it('should set isLoading=true when pending', () => {
      const action = { type: getCurrentUser.pending.type };
      const state = authReducer(initialState, action);
      expect(state.isLoading).toBe(true);
    });

    it('should set user on fulfilled', () => {
      const fakeUser = { id: 1, first_name: 'Jane' };
      const action = { type: getCurrentUser.fulfilled.type, payload: fakeUser };
      const state = authReducer(initialState, action);

      expect(state.user).toEqual(fakeUser);
      expect(state.isAuthenticated).toBe(true);
      expect(state.isLoading).toBe(false);
    });

    it('should clear user on rejected', () => {
      const loggedInState = { ...initialState, user: { id: 1 }, isAuthenticated: true };
      const action = { type: getCurrentUser.rejected.type };
      const state = authReducer(loggedInState, action);

      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
    });
  });
});
