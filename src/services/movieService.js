import axios from "axios";


export const updateMovie = (id, data) => axios.patch(`/api/movies/${id}/`, data)
