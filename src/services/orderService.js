import axios from "axios";

export const createOrder = () => axios.post(`/api/orders/`);
