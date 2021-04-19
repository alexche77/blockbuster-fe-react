import React, { useState, useEffect, useRef } from "react";
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
  Overlay,
  Tooltip,
} from "react-bootstrap";
import Rating from "../components/Rating";
import { listMovieDetails, cleanUpMoviesState } from "../actions/movieActions";
import { updateMovie } from "../services/movieService";
import { createOrder, addMovement } from "../services/orderService";
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAvailable, setIsAvailable] = useState(movie.is_available);
  const purchaseBtn = useRef(null);
  const rentBtn = useRef(null);
  // useEffect: This runs as soon as the component loads
  useEffect(() => {
    if (userInfo) {
      setIsStaff(userInfo.groups && userInfo.groups.includes("Staff"));
      setIsAdmin(userInfo.groups && userInfo.groups.includes("Admins"));
      setIsAuthenticated(userInfo.auth_token != undefined);
    } else {
      setIsStaff(false);
      setIsAuthenticated(false);
      setIsAdmin(false);
    }
    setProfit(movie.profit_percentage);
    setRentPrice(movie.rent_price);
    setIsAvailable(movie.is_available);
    dispatch(listMovieDetails(movieId));
    return () => {
      dispatch(cleanUpMoviesState());
    };
  }, [dispatch, movieId]);

  const addToCartHandler = (movementType) => {
    // Create order or type ${movementType} and add the movie as movement
    let order_type = movementType == "PURCHASE" ? 1 : 2;
    let final_price =
      movementType == "PURCHASE" ? movie.final_price : movie.rent_price;
    createOrder({ order_type: order_type, price: final_price })
      .then(({ data }) => {
        console.log("Order created adding movement with movie ID", data);
        addMovement(data.id, {
          movie_id: movie.id,
          quantity: 1,
          price: final_price,
          unit_price: final_price,
        })
          .then(({ data }) => {
            console.log("Movement added");
            console.log(data);
            history.push("/order/" + data.order.id);
          })
          .catch((err) => console.error(err));
      })
      .catch((err) => console.error(err));
  };

  const handleProfitChange = ({ target: { value } }) => {
    updateMovie(movieId, { profit_percentage: value })
      .then(() => setProfit(value))
      .catch((error) => {
        console.error(error);
        setProfit(movie.profit_percentage);
      });
  };

  const handleRentPrice = ({ target: { value } }) => {
    updateMovie(movieId, { rent_price: value })
      .then(({ data }) => setRentPrice(data.rent_price))
      .catch((error) => {
        console.error(error);
      });
  };
  const handleToggleAvailability = () => {
    updateMovie(movieId, { is_available: !isAvailable })
      .then(({ data }) => setIsAvailable(data.is_available))
      .catch((error) => {
        console.error(error);
      });
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
            {!(isStaff || isAdmin) ? (
              <Card>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <Row>
                      <Col>Purchase:</Col>
                      <Col>
                        <strong>
                          {movie.final_price > 0
                            ? `$ ${movie.final_price}`
                            : "N/A"}
                        </strong>
                      </Col>
                    </Row>
                    <Row>
                      <Col>Rent:</Col>
                      <Col>
                        <strong>
                          {movie.rent_price > 0
                            ? `$ ${movie.rent_price}`
                            : "N/A"}
                        </strong>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Status:</Col>
                      <Col>{movie.stock < 1 ? "Out of Stock" : "In Stock"}</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Button
                      ref={purchaseBtn}
                      className="btn-block"
                      type="button"
                      onClick={(e) => addToCartHandler("PURCHASE")}
                      disabled={
                        !isAuthenticated ||
                        movie.stock < 1 ||
                        movie.final_price < 1
                      }
                    >
                      Purchase for ${movie.final_price}
                    </Button>
                    <Overlay
                      target={purchaseBtn.current}
                      show={!isAuthenticated}
                      placement="right"
                    >
                      <Tooltip id="overlay-needs-auth">
                        You need to be logged in to do this!
                      </Tooltip>
                    </Overlay>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Button
                      ref={rentBtn}
                      className="btn-block"
                      type="button"
                      onClick={(e) => addToCartHandler("RENT")}
                      disabled={
                        !isAuthenticated ||
                        movie.stock < 1 ||
                        movie.rent_price < 1
                      }
                    >
                      Rent for ${movie.rent_price}
                    </Button>
                    <Overlay
                      target={rentBtn.current}
                      show={!isAuthenticated}
                      placement="right"
                    >
                      <Tooltip id="overlay-needs-auth">
                        You need to be logged in to do this!
                      </Tooltip>
                    </Overlay>
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            ) : (
              <>
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
                          <option key={x} value={x} selected={x === profit}>
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
                          <option key={x} value={x} selected={x === rentPrice}>
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
                    Mark as {isAvailable ? "unavailable" : "available"}
                  </Button>
                </ListGroup.Item>
              </>
            )}
          </Col>
        </Row>
      )}
    </>
  );
};

export default MovieScreen;
