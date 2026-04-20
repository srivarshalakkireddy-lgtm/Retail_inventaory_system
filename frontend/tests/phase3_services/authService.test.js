import authService from '@src/services/authService';
import api from '@src/services/api';

// Mock the underlying axios API instance
jest.mock('@src/services/api');
jest.mock('@src/services/api', () => ({
  post: jest.fn(),
  get: jest.fn(),
}));

describe('authService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  describe('login', () => {
    it('should store user data in localStorage and return it on success', async () => {
      // Arrange: fake successful API response
      const fakeResponse = {
        data: {
          success: true,
          data: {
            user: { id: 1, first_name: 'John', email: 'john@example.com' },
            token: 'fake-jwt-token',
          },
        },
      };
      api.post.mockResolvedValue(fakeResponse);

      // Act
      const result = await authService.login({ email: 'john@example.com', password: '123' });

      // Assert
      expect(api.post).toHaveBeenCalledWith('/auth/login', { email: 'john@example.com', password: '123' });
      // Should have stored user+token in localStorage
      const stored = JSON.parse(localStorage.getItem('user'));
      expect(stored.token).toBe('fake-jwt-token');
      expect(stored.first_name).toBe('John');
      // Should return { user, token }
      expect(result).toEqual(fakeResponse.data.data);
    });
  });

  describe('logout', () => {
    it('should remove user from localStorage', () => {
      localStorage.setItem('user', JSON.stringify({ id: 1 }));

      authService.logout();

      expect(localStorage.getItem('user')).toBeNull();
    });
  });

  describe('getCurrentUser', () => {
    it('should call GET /auth/me and return the user data', async () => {
      const fakeResponse = {
        data: { data: { id: 1, first_name: 'Jane' } },
      };
      api.get.mockResolvedValue(fakeResponse);

      const result = await authService.getCurrentUser();

      expect(api.get).toHaveBeenCalledWith('/auth/me');
      expect(result).toEqual({ id: 1, first_name: 'Jane' });
    });
  });
});
