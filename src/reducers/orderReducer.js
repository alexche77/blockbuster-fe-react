import {
  ORDER_LIST_FAIL,
  ORDER_LIST_REQUEST,
  ORDER_LIST_SUCCESS,
  ORDER_DETAILS_FAIL,
  ORDER_DETAILS_REQUEST,
  ORDER_DETAILS_UPDATING,
  ORDER_DETAILS_SUCCESS,
} from "../constants/orderConstants";

export const orderListReducer = (state = { ordersResponse: {results: []} }, action) => {
  switch (action.type) {
    case ORDER_LIST_REQUEST:
      return { loading: true, ordersResponse: {results: []} };
    case ORDER_LIST_SUCCESS:
      return { loading: false, ordersResponse: action.payload };
    case ORDER_LIST_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const orderDetailReducer = (
  state = { order: { movements: [] } },
  action
) => {
  switch (action.type) {
    case ORDER_DETAILS_REQUEST:
      return { isUpdating: false, loading: true, ...state  };
    case ORDER_DETAILS_SUCCESS:
      return { isUpdating: false, loading: false, order: action.payload };
    case ORDER_DETAILS_FAIL:
      return { isUpdating: false, loading: false, error: action.payload };
    default:
      return state;
  }
};
