import axiosClient from './axiosClient';

export const statsApi = {
  getDashboardStats: () => axiosClient.get('/statistics/dashboard'),
};
