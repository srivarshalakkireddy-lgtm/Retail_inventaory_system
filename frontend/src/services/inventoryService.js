import api from './api';

const getInventory = async (params = {}) => {
  const response = await api.get('/inventory', { params });
  return response.data;
};

const adjustInventory = async (adjustmentData) => {
  const response = await api.post('/inventory/adjust', adjustmentData);
  return response.data;
};

const transferInventory = async (transferData) => {
  const response = await api.post('/inventory/transfer', transferData);
  return response.data;
};

const inventoryService = {
  getInventory,
  adjustInventory,
  transferInventory,
};

export default inventoryService;
