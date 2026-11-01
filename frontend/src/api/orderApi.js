import axiosClient from './axiosClient';

export const orderApi = {
  getOrders: (status) => axiosClient.get('/orders', { params: { status } }),
  getOrderById: (id) => axiosClient.get(`/orders/${id}`),
  getActiveOrderByTable: (tableId) => axiosClient.get(`/orders/table/${tableId}/active`),
  lookupOrder: (orderNumber) => axiosClient.get(`/orders/lookup/${orderNumber}`),
  createOrder: (data) => axiosClient.post('/orders', data),
  createCustomerOrder: (data) => axiosClient.post('/orders/customer', data),
  addItems: (orderId, items) => axiosClient.post(`/orders/${orderId}/items`, items),
  updateOrderStatus: (orderId, status) => axiosClient.patch(`/orders/${orderId}/status`, null, { params: { status } }),
  updateItemStatus: (itemId, status) => axiosClient.patch(`/orders/items/${itemId}/status`, null, { params: { status } }),
  checkout: (orderId, checkoutData) => axiosClient.post(`/orders/${orderId}/checkout`, checkoutData),
};
