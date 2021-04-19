import axios from "axios";

export const createOrder = (data) => axios.post(`/api/orders/`, data);
export const publishOrder = (id) => axios.patch(`/api/orders/${id}/`, {order_state:3});
export const deleteOrder = (id) => axios.delete(`/api/orders/${id}/`);

export const addMovement = (id, data) => axios.post(`/api/orders/${id}/movements/`, data)