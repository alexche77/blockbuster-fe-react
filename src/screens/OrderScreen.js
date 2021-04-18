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

const OrderScreen = ({ match }) => {
  const [pickingMovie, setPickingMovie] = useState(false);

  const orderId = match.params.id;

  const dispatch = useDispatch();
  const orderDetails = useSelector((state) => state.orderDetails);
  const { isUpdating, loading, error, order } = orderDetails;
  const submitHandler = (e) => {
    e.preventDefault();
    // dispatch(save(orderId, order_type, movements));
  };

  const moviePicked = (imdb_id) => {
    console.log(imdb_id);
  };

  const getOrderTypeHelpMessage = (orderType) => {
    let helpMessage = null;
    switch (orderType) {
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

  const orderTypeChanged = ({ target }) => {
    if (target.value === undefined) return;
    dispatch(updateOrderType(orderId, target.value));
  };
  // useEffect: This runs as soon as the component loads
  useEffect(() => {
    dispatch(listOrderDetails(orderId));
    return () => {
      dispatch(cleanUpOrdersState());
    };
  }, [dispatch, orderId]);
  return (
    <>
      <Link className="btn btn-light my-3" to="/orders">
        Go back
      </Link>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger"> {error}</Message>
      ) : (
        <FormContainer>
          <h1>Order #{orderId}</h1>
          <Badge variant="success">Status: {order.state_label}</Badge>
          {error && <Message variant="danger"> {error}</Message>}
          {isUpdating && <Loader />}
          <Form onSubmit={submitHandler}>
            <Form.Group controlId="orderForm.OrderTypeSelect">
              <Form.Label>Order type</Form.Label>
              <Form.Control
                defaultValue={order.order_type}
                as="select"
                onChange={orderTypeChanged}
              >
                <option disabled>Select order type...</option>
                <option value={5}>Purchase</option>
                <option value={4}>Defective return</option>
                <option value={6}>Adjustment (Add)</option>
                <option value={7}>Adjustment (Remove)</option>
              </Form.Control>
              {order.order_type && (
                <Message variant="info">
                  {getOrderTypeHelpMessage(order.order_type)}
                </Message>
              )}
            </Form.Group>

            <MoviePickerModal
              animation={false}
              show={pickingMovie}
              onHide={() => setPickingMovie(false)}
              onMoviePicked={moviePicked}
            />
            <Button onClick={() => setPickingMovie(true)}> Add movie </Button>
          </Form>
        </FormContainer>
      )}
    </>
  );
};

export default OrderScreen;
