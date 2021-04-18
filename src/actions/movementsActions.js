import axios from "axios";
import {
  MOVEMENT_LIST_FAIL,
  MOVEMENT_LIST_REQUEST,
  MOVEMENT_LIST_SUCCESS,
  MOVEMENT_DETAILS_FAIL,
  MOVEMENT_DETAILS_SUCCESS,
  MOVEMENT_DETAILS_UPDATING,
} from "../constants/movementsContants";

export const listMovements = (orderId) => async (dispatch) => {
  try {
    dispatch({ type: MOVEMENT_LIST_REQUEST });
    const { data } = await axios.get(`/api/orders/${orderId}/movements/`);
    dispatch({ type: MOVEMENT_LIST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: MOVEMENT_LIST_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.detail,
    });
  }
};


export const updateMovement = (id,payload) => async (dispatch) => {
  try {
    dispatch({ type: MOVEMENT_DETAILS_UPDATING });    
    const { data } = await axios.put(`/api/orders/${id}/movements/`, {...payload});
    dispatch({ type: MOVEMENT_DETAILS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: MOVEMENT_DETAILS_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.detail,
    });
  }
}

export const cleanUpMovementsState = () => async (dispatch) => {
  dispatch({ type: MOVEMENT_DETAILS_SUCCESS, payload: {} });
};
