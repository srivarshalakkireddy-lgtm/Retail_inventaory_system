import api from './api';

const getSuppliers = async (params = {}) => {
  const response = await api.get('/suppliers', { params });
  return response.data;
};

const getSupplier = async (id) => {
  const response = await api.get(`/suppliers/${id}`);
  return response.data;
};

const createSupplier = async (supplierData) => {
  const response = await api.post('/suppliers', supplierData);
  return response.data;
};

const updateSupplier = async (id, supplierData) => {
  const response = await api.put(`/suppliers/${id}`, supplierData);
  return response.data;
};

const supplierService = {
  getSuppliers,
  getSupplier,
  createSupplier,
  updateSupplier,
};

export default supplierService;
