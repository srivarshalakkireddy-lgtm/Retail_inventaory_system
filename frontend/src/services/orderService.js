import api from './api';

const getOrders = async (params = {}) => {
  const response = await api.get('/orders', { params });
  return response.data;
};

const getOrder = async (id) => {
  const response = await api.get(`/orders/${id}`);
  return response.data;
};

const createOrder = async (orderData) => {
  const response = await api.post('/orders', orderData);
  return response.data;
};

const updateOrderStatus = async (id, statusData) => {
  const response = await api.put(`/orders/${id}/status`, statusData);
  return response.data;
};

const orderService = {
  getOrders,
  getOrder,
  createOrder,
  updateOrderStatus,
};

export default orderService;
