import axios from "axios";

export const createOrder = () => axios.post(`/api/orders/`);

export const addMovement = (id, data) => axios.post(`/api/orders/${id}/movements/`, data)