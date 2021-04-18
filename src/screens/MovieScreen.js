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
import { updateMovie } from "../services/movieService";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { range } from "lodash-es";

const MovieScreen = ({ history, match }) => {
  const [qty, setQty] = useState(1);
  const [profit, setProfit] = useState(1);
  const [rentPrice, setRentPrice] = useState(0.5);
  const movieId = match.params.id;
  const dispatch = useDispatch();
  const movieDetails = useSelector((state) => state.movieDetails);
  const { loading, error, movie } = movieDetails;
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const [isStaff, setIsStaff] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAvailable, setIsAvailable] = useState(movie.is_available);
  // useEffect: This runs as soon as the component loads
  useEffect(() => {
    if (userInfo) {
      setIsStaff(
        userInfo &&
        userInfo.groups !== undefined &&
        (userInfo.groups.includes("Staff"))
      );
      setIsAdmin(
        userInfo &&
        userInfo.groups !== undefined &&
        userInfo.groups.includes("Admins")
      );
    } else {
      setIsStaff(false);
    }
    setProfit(movie.profit_percentage)
    setRentPrice(movie.rent_price)
    setIsAvailable(movie.is_available)
    dispatch(listMovieDetails(movieId));
    return () => {
      dispatch(cleanUpMoviesState());
    };
  }, [dispatch, movieId]);

  const addToCartHandler = () => {
    history.push(`/cart/${movieId}?qty=${qty}`);
  };

  const handleProfitChange = ({ target: { value } }) => {
    updateMovie(movieId, { profit_percentage: value }).then(() => setProfit(value)).catch((error) => {
      console.error(error)
      setProfit(movie.profit_percentage)
    })

  }

  const handleRentPrice = ({ target: { value } }) => {
    updateMovie(movieId, { rent_price: value }).then(({ data }) => setRentPrice(data.rent_price))
      .catch((error) => {
        console.error(error)
      })

  }
  const handleToggleAvailability = () => {
    updateMovie(movieId, { is_available: !isAvailable }).then(({ data }) => setRentPrice(data.rent_price))
      .catch((error) => {
        console.error(error)
      })

  }

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
            {!(isStaff || isAdmin) ? <Card>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>Purchase:</Col>
                    <Col>
                      <strong>{movie.final_price > 0 ? `$ ${movie.final_price}` : 'N/A'}</strong>
                    </Col>
                  </Row>
                  <Row>
                    <Col>Rent:</Col>
                    <Col>
                      <strong>{movie.rent_price > 0 ? `$ ${movie.rent_price}` : 'N/A'}</strong>
                    </Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Status:</Col>
                    <Col>{movie.stock < 1 || movie.final_price < 1 || movie.rent_price < 1 ? "Out of Stock" : "In Stock"}</Col>
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
                          disabled={movie.stock < 1 || movie.final_price < 1 || movie.rent_price < 1}
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
                    disabled={movie.stock < 1 || movie.final_price < 1 || movie.rent_price < 1}
                  >
                    Add to Cart
                  </Button>
                </ListGroup.Item>
              </ListGroup>
            </Card> : <>
              <ListGroup.Item>
                <Row>
                  <Col>Profit margin (%):</Col>
                  <Col>
                    <Form.Control
                      as="select"
                      value={profit}
                      disabled={!isAdmin}
                      onChange={handleProfitChange}
                    >
                      {range(0, 200, 5).map((x) => (
                        <option key={x} value={x}>
                          {x}
                        </option>
                      ))}
                    </Form.Control>
                  </Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Rent price (fixed):</Col>
                  <Col>
                    <Form.Control
                      as="select"
                      value={rentPrice}
                      disabled={!isAdmin}
                      onChange={handleRentPrice}
                    >
                      {range(1, 11, 1).map((x) => (
                        <option key={x} value={x}>
                          {x}
                        </option>
                      ))}
                    </Form.Control>
                  </Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Base price:</Col>
                  <Col>
                    <strong>{movie.base_price}</strong>
                  </Col>
                </Row>
                <Row>
                  <Col>Profit margin:</Col>
                  <Col>
                    <strong>{movie.profit_percentage}</strong>
                  </Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Final sale price:</Col>
                  <Col>{movie.final_price}</Col>
                </Row>
                <Row>
                  <Col>Final rent price:</Col>
                  <Col>{rentPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Button
                  className="btn-block"
                  type="button"
                  onClick={handleToggleAvailability}
                >
                  Mark as {!isAvailable ? "unavailable" : "available"}
                </Button>
              </ListGroup.Item>
            </>
            }
          </Col>
        </Row>
      )}
    </>
  );
};

export default MovieScreen;
