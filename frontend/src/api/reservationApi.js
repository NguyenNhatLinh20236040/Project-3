import axiosClient from './axiosClient';

export const reservationApi = {
  getReservations: (status) => axiosClient.get('/reservations', { params: { status } }),
  getReservationById: (id) => axiosClient.get(`/reservations/${id}`),
  lookupByPhone: (phone) => axiosClient.get('/reservations/lookup', { params: { phone } }),
  createReservation: (data) => axiosClient.post('/reservations', data),
  updateStatus: (id, status, tableId) => 
    axiosClient.patch(`/reservations/${id}/status`, null, { params: { status, tableId } }),
};
