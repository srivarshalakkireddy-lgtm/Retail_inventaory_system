import api from './api';

const getDashboardStats = async () => {
  const response = await api.get('/reports/dashboard');
  return response.data;
};

const reportService = {
  getDashboardStats,
};

export default reportService;
