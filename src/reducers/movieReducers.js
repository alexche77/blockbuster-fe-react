import {
  MOVIE_LIST_FAIL,
  MOVIE_LIST_REQUEST,
  MOVIE_LIST_SUCCESS,
  MOVIE_DETAILS_FAIL,
  MOVIE_DETAILS_REQUEST,
  MOVIE_DETAILS_SUCCESS,
} from "../constants/movieConstants";

export const movieListReducer = (state = { movieResponse: { results : [] } }, action) => {
  switch (action.type) {
    case MOVIE_LIST_REQUEST:
      return { loading: true, movieResponse: { results : [] } };
    case MOVIE_LIST_SUCCESS:
      return { loading: false, movieResponse: action.payload };
    case MOVIE_LIST_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const movieDetailReducer = (
  state = { movie: {info:{Ratings: []} } },
  action
) => {
  switch (action.type) {
    case MOVIE_DETAILS_REQUEST:
      return { loading: true, ...state };
    case MOVIE_DETAILS_SUCCESS:
      return { loading: false, movie: action.payload };
    case MOVIE_DETAILS_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
