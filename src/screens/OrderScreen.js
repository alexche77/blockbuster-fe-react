import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "react-bootstrap/Button";
import { Badge, Form } from "react-bootstrap";
import {
  cleanUpOrdersState,
  listOrderDetails,
  updateOrderType,
} from "../actions/orderActions";
import Loader from "../components/Loader";
import Message from "../components/Message";
import FormContainer from "../components/FormContainer";
import MoviePickerModal from "../components/MoviePickerModal";
import { Link } from "react-router-dom";
import { listMovements } from "../actions/movementsActions";
import {
  addMovement,
  deleteOrder,
  publishOrder,
} from "../services/orderService";
import Movement from "../components/Movement";
const OrderScreen = ({ match, history }) => {
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isStaff, setIsStaff] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const [pickingMovie, setPickingMovie] = useState(false);
  const [errorMessage, seterrorMessage] = useState();
  const orderId = match.params.id;

  const dispatch = useDispatch();
  const orderDetails = useSelector((state) => state.orderDetails);
  const { isUpdating, loading, error, order } = orderDetails;
  const movementsList = useSelector((state) => state.movementsList);
  const { loadingMovements, errorMovements, movements } = movementsList;

  const moviePicked = (movieId) => {
    // Adding movie as movement to order
    addMovement(orderId, {
      movie_id: movieId,
      quantity: 1,
      price: 0,
      unit_price: 0,
    })
      .then((response) => {
        console.log(response.data);
        dispatch(listMovements(orderId));
      })
      .catch((error) => {
        let err =
          error.response && error.response.data.detail
            ? error.response.data.detail
            : error.detail;
        console.error(err);
        seterrorMessage(err);
        setTimeout(() => seterrorMessage(null), 5000);
      });
  };

  const getOrderTypeHelpMessage = (orderType) => {
    let helpMessage = null;
    switch (orderType) {
      case 1:
        helpMessage =
          "This is a movie purchase";
        break;
      case 2:
        helpMessage =
          "You are renting this movie. It should be returned in 5 days";
        break;
      case 3:
        helpMessage =
          "You are returning this rented movie.";
        break;
      case 4:
        helpMessage =
          "This movie was defective and you are returning it.";
        break;
      case 5:
        helpMessage =
          "Purchase order represents a purchase that the store made in orter to add products to stock";
        break;
      case 6:
        helpMessage =
          "Adjustment(Add) order is made when an adjustment in the inventory is needed, in this case, movies need to be added.";
        break;
      case 7:
        helpMessage =
          "Adjustment(Remove) order is made when an adjustment in the inventory is needed, in this case, movies need to be removed.";
        break;
      case 4:
        helpMessage =
          "Defective return order represents a customer returning one or many movies";
        break;
      default:
        break;
    }
    return helpMessage;
  };

  const handlePublish = () => {
    publishOrder(orderId)
      .then(() => history.push((isAdmin || isStaff)?"/orders":"/profile"))
      .catch((error) => {
        let _err =
          error.response && error.response.data.detail
            ? error.response.data.detail
            : error.detail;
        seterrorMessage(_err);
      });
  };

  const handleDelete = () => {
    // TODO Implement double check mech
    deleteOrder(orderId)
      .then(() => history.push( (isAdmin || isStaff)?"/orders":"/profile"))
      .catch((error) => {
        let _err =
          error.response && error.response.data.detail
            ? error.response.data.detail
            : error.detail;
        seterrorMessage(_err);
      });
  };

  const orderTypeChanged = ({ target }) => {
    if (target.value === undefined) return;
    dispatch(updateOrderType(orderId, target.value));
  };
  // useEffect: This runs as soon as the component loads
  useEffect(() => {
    if (userInfo) {
      setIsLoggedIn(true);

      setIsAdmin(
        userInfo &&
          userInfo.groups !== undefined &&
          userInfo.groups.includes("Admins")
      );
      setIsStaff(
        isAdmin ||
          (userInfo &&
            userInfo.groups !== undefined &&
            userInfo.groups.includes("Staff"))
      );
    } else {
      setIsLoggedIn(false);
      setIsStaff(false);
      setIsAdmin(false);
    }
    dispatch(listOrderDetails(orderId));
    dispatch(listMovements(orderId));
    return () => {
      dispatch(cleanUpOrdersState());
    };
  }, [dispatch, orderId, userInfo, isAdmin]);
  return (
    <>
      <Link className="btn btn-light my-3" to={(isAdmin || isStaff)?"/orders":"/profile"}>
        Go back
      </Link>
      {error && <Message variant="danger"> {error}</Message>}
      {loading ? (
        <Loader />
      ) : (
        <>
          <FormContainer>
            <h1>Order #{orderId}</h1>
            <Badge variant="success">Status: {order.state_label}</Badge>
            {error && <Message variant="danger"> {error}</Message>}
            {isUpdating && <Loader />}
            <Form>
              <Form.Group controlId="orderForm.OrderTypeSelect">
                <Form.Label>Order type</Form.Label>
                <Form.Control
                  defaultValue={order.order_type}
                  value={order.order_type}
                  as="select"
                  onChange={orderTypeChanged}
                  disabled={order.order_state !== 0 || !(isAdmin || isStaff)}
                >
                  {!(isAdmin || isStaff) && (
                    <>
                      <option value={1} disabled>Purchase</option>
                      <option value={2} disabled>Rent</option>
                      <option value={3} disabled>Rent return</option>
                      <option value={4} disabled>Defective return</option>
                    </>
                  )}
                  <option disabled>
                    {isStaff
                      ? "Select order type..."
                      : order.order_type == 1
                      ? "Purchase"
                      : "Rent"}
                  </option>
                  {isStaff && (
                    <>
                      <option value={5}>Purchase</option>
                      <option value={4}>Defective return</option>
                      <option value={6}>Adjustment (Add)</option>
                      <option value={7}>Adjustment (Remove)</option>
                    </>
                  )}
                </Form.Control>
                {order.order_type && (
                  <Message variant="info">
                    {getOrderTypeHelpMessage(order.order_type)}
                  </Message>
                )}
              </Form.Group>

              {order.order_state === 0 ? (
                <>
                  { (isAdmin || isStaff) && <Button
                    className="w-100"
                    onClick={() => setPickingMovie(true)}
                  >
                    {" "}
                    Add movie{" "}
                  </Button>}
                  <div>
                    <Button
                      className="w-50"
                      variant="success"
                      onClick={handlePublish}
                    >
                      {" "}
                      {(isAdmin || isStaff)? 'Publish':'Finish'}{" "}
                    </Button>
                    <Button
                      className="w-50"
                      variant="danger"
                      onClick={handleDelete}
                    >
                      {" "}
                      {(isAdmin || isStaff)? 'Delete':'Cancel'}{" "}
                    </Button>
                  </div>
                </>
              ) : (
                <Message variant="warning">
                  No actions available, this order is locked
                </Message>
              )}
              <h2 className="mt-4">Movements</h2>
              {loadingMovements && <Loader></Loader>}
              {errorMessage && (
                <Message variant="danger">{errorMessage}</Message>
              )}
              {movements.map((movement) => (
                <Movement movement={movement} key={movement.id} readOnly={!(isAdmin || isStaff)} />
              ))}
            </Form>
          </FormContainer>
          {/* Modal */}
          <MoviePickerModal
            animation={false}
            show={pickingMovie}
            onHide={() => setPickingMovie(false)}
            onMoviePicked={moviePicked}
          />
        </>
      )}
    </>
  );
};

export default OrderScreen;
