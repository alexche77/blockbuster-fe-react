import axios from "axios";

export const updateMovement = (id, data) => axios.patch(`/api/movements/${id}/`, data)
export const deleteMovement = (id) => axios.delete(`/api/movements/${id}/`)