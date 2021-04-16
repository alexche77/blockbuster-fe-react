import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  Row,
  Col,
  Image,
  ListGroup,
  Card,
  Button,
  Form,
} from "react-bootstrap";
import Rating from "../components/Rating";
import { listMovieDetails, cleanUpMoviesState } from "../actions/movieActions";
import Loader from "../components/Loader";
import Message from "../components/Message";

const MovieScreen = ({ history, match }) => {
  const [qty, setQty] = useState(1);
  const movieId = match.params.id;
  const dispatch = useDispatch();
  const movieDetails = useSelector((state) => state.movieDetails);
  const { loading, error, movie } = movieDetails;

  // useEffect: This runs as soon as the component loads
  useEffect(() => {
    dispatch(listMovieDetails(movieId));
    return () => {
      dispatch(cleanUpMoviesState());
    };
  }, [dispatch, movieId]);

  const addToCartHandler = () => {
    history.push(`/cart/${movieId}?qty=${qty}`);
  };

  return (
    <>
      <Link className="btn btn-light my-3" to="/">
        Go back
      </Link>
      {loading || movie.info === undefined ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Row>
          <Col md={4}>
            <Image fluid src={movie.info.Poster} alt={movie.info.Title} />
          </Col>
          <Col md={3}>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h3>{movie.info.Title}</h3>
              </ListGroup.Item>
              <ListGroup.Item>
                {movie.info.Ratings !== undefined &&
                  movie.info.Ratings.map((rating) => {
                    return (
                      <Rating
                        text={`${rating.Source}: ${rating.Value}`}
                        color="black"
                        key={rating.Source}
                      />
                    );
                  })}
              </ListGroup.Item>
              <ListGroup.Item>Description: {movie.info.Plot}</ListGroup.Item>
            </ListGroup>
          </Col>
          <Col md={3}>
            <Card>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>Purchase:</Col>
                    <Col>
                      <strong>{movie.final_price > 0? `$ ${movie.final_price}`:'N/A'}</strong>
                    </Col>
                  </Row>
                  <Row>
                    <Col>Rent:</Col>
                    <Col>
                      <strong>{movie.rent_price > 0? `$ ${movie.rent_price}`:'N/A'}</strong>
                    </Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Status:</Col>
                    <Col>{movie.stock > 0 ? "In Stock" : "Out of Stock"}</Col>
                  </Row>
                </ListGroup.Item>
                {movie.stock > 0 && (
                  <ListGroup.Item>
                    <Row>
                      <Col>Qty:</Col>
                      <Col>
                        <Form.Control
                          as="select"
                          value={qty}
                          onChange={(e) => setQty(e.target.value)}
                        >
                          {[...Array(movie.stock).keys()].map((x) => (
                            <option key={x + 1} value={x + 1}>
                              {x + 1}
                            </option>
                          ))}
                        </Form.Control>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                )}
                <ListGroup.Item>
                  <Button
                    className="btn-block"
                    type="button"
                    onClick={addToCartHandler}
                    disabled={movie.stock < 1}
                  >
                    Add to Cart
                  </Button>
                </ListGroup.Item>
              </ListGroup>
            </Card>
          </Col>
        </Row>
      )}
    </>
  );
};

export default MovieScreen;
