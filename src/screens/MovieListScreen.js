import React, { useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import Movie from "../components/Movie";
import { useDispatch, useSelector } from "react-redux";
import { listMovies } from "../actions/movieActions";
import Loader from "../components/Loader";
import Message from "../components/Message";

const MovieListScreen = () => {
  const distpatch = useDispatch();
  const movieList = useSelector((state) => state.movieList);
  const { loading, error, movies } = movieList;

  // useEffect: This runs as soon as the component loads
  useEffect(() => {
    distpatch(listMovies());
  }, [distpatch]);

  return (
    <>
      <h1>Movies</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger"> {error}</Message>
      ) : (
        <Row>
          {movies.map((movie) => (
            <Col sm={12} md={6} lg={4} xl={4} key={movie.id}>
              <Movie movie={movie} />
            </Col>
          ))}
        </Row>
      )}
    </>
  );
};

export default MovieListScreen;
