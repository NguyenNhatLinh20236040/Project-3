import axiosClient from './axiosClient';

export const menuApi = {
  getCategories: () => axiosClient.get('/categories'),
  getMenuItems: (params) => axiosClient.get('/menu', { params }),
  getMenuItemById: (id) => axiosClient.get(`/menu/${id}`),
  createMenuItem: (data) => axiosClient.post('/menu', data),
  updateMenuItem: (id, data) => axiosClient.put(`/menu/${id}`, data),
  deleteMenuItem: (id) => axiosClient.delete(`/menu/${id}`),
  toggleAvailability: (id) => axiosClient.patch(`/menu/${id}/toggle-availability`),
  createCategory: (data) => axiosClient.post('/categories', data),
  deleteCategory: (id) => axiosClient.delete(`/categories/${id}`),
};
