import api from './api';

const getUsers = async (params = {}) => {
  const response = await api.get('/users', { params });
  return response.data;
};

const getUser = async (id) => {
  const response = await api.get(`/users/${id}`);
  return response.data;
};

const createUser = async (userData) => {
  const response = await api.post('/users', userData);
  return response.data;
};

const updateUser = async (id, userData) => {
  const response = await api.put(`/users/${id}`, userData);
  return response.data;
};

const userService = {
  getUsers,
  getUser,
  createUser,
  updateUser,
};

export default userService;
