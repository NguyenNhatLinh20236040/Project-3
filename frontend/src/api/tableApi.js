import axiosClient from './axiosClient';

export const tableApi = {
  getTables: (zone) => axiosClient.get('/tables', { params: { zone } }),
  getTableById: (id) => axiosClient.get(`/tables/${id}`),
  createTable: (data) => axiosClient.post('/tables', data),
  updateTable: (id, data) => axiosClient.put(`/tables/${id}`, data),
  updateStatus: (id, status) => axiosClient.patch(`/tables/${id}/status`, null, { params: { status } }),
  deleteTable: (id) => axiosClient.delete(`/tables/${id}`),
};
