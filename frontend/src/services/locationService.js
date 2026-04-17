import api from './api';

const getLocations = async (params = {}) => {
  const response = await api.get('/locations', { params });
  return response.data;
};

const getLocation = async (id) => {
  const response = await api.get(`/locations/${id}`);
  return response.data;
};

const locationService = {
  getLocations,
  getLocation,
};

export default locationService;
