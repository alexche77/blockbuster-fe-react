import {
    MOVEMENT_LIST_FAIL,
    MOVEMENT_LIST_REQUEST,
    MOVEMENT_LIST_SUCCESS,
    MOVEMENT_DETAILS_FAIL,
    MOVEMENT_DETAILS_REQUEST,
    MOVEMENT_DETAILS_SUCCESS,
  } from "../constants/movementsContants";
  
  export const movementListReducer = (state = { movements: [] }, action) => {
    switch (action.type) {
      case MOVEMENT_LIST_REQUEST:
        return { loadingMovements: true,  movements: [] };
      case MOVEMENT_LIST_SUCCESS:
        return { loadingMovements: false, movements: action.payload };
      case MOVEMENT_LIST_FAIL:
        return { loadingMovements: false, errorMovements: action.payload };
      default:
        return state;
    }
  };
  
  export const movementDetailReducer = (
    state = { movement: {info:{Ratings: []} } },
    action
  ) => {
    switch (action.type) {
      case MOVEMENT_DETAILS_REQUEST:
        return { loading: true, ...state };
      case MOVEMENT_DETAILS_SUCCESS:
        return { loading: false, movement: action.payload };
      case MOVEMENT_DETAILS_FAIL:
        return { loading: false, error: action.payload };
      default:
        return state;
    }
  };
  