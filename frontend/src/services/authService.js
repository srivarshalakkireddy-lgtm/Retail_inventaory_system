import api from './api';

const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials);

  if (response.data && response.data.success) {
    // Backend returns { success, message, data: { user, token } }
    // Store both user info and token together for the interceptor
    const userData = {
      ...response.data.data.user,
      token: response.data.data.token,
    };
    localStorage.setItem('user', JSON.stringify(userData));
    return response.data.data; // Return { user, token }
  }

  return response.data;
};

const logout = () => {
  localStorage.removeItem('user');
};

const getCurrentUser = async () => {
  const response = await api.get('/auth/me');
  // Backend returns { success, message, data: { user object } }
  return response.data.data;
};

const authService = {
  login,
  logout,
  getCurrentUser,
};

export default authService;
