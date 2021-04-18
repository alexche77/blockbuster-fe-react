import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "react-bootstrap/Button";
import { Badge, Form, Col, Container } from "react-bootstrap";
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
import { addMovement, deleteOrder, publishOrder } from "../services/orderService";
import Movement from "../components/Movement";
const OrderScreen = ({ match, history }) => {
  const [pickingMovie, setPickingMovie] = useState(false);
  const [errorMessage, seterrorMessage] = useState()
  const orderId = match.params.id;

  const dispatch = useDispatch();
  const orderDetails = useSelector((state) => state.orderDetails);
  const { isUpdating, loading, error, order } = orderDetails;
  const movementsList = useSelector((state) => state.movementsList);
  const { loadingMovements, errorMovements, movements } = movementsList;

  const moviePicked = (movieId) => {
    // Adding movie as movement to order
    addMovement(orderId, { movie_id: movieId, quantity: 1, price: 0, unit_price: 0 }).then((response) => {
      console.log(response.data)
      dispatch(listMovements(orderId))
    }).catch(error => {
      let err = error.response && error.response.data.detail
        ? error.response.data.detail
        : error.detail
      console.error(err)
      seterrorMessage(err)
      setTimeout(() => seterrorMessage(null), 5000)
    })

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

  const handlePublish = () => {
    publishOrder(orderId).then(() => history.push('/orders')).catch((error) => {
      let _err = error.response && error.response.data.detail
        ? error.response.data.detail
        : error.detail;
      seterrorMessage(_err)

    })
  }

  const handleDelete = () => {
    // TODO Implement double check mech
    deleteOrder(orderId).then(() => history.push('/orders')).catch((error) => {
      let _err = error.response && error.response.data.detail
        ? error.response.data.detail
        : error.detail;
      seterrorMessage(_err)

    })
  }

  const orderTypeChanged = ({ target }) => {
    if (target.value === undefined) return;
    dispatch(updateOrderType(orderId, target.value));
  };
  // useEffect: This runs as soon as the component loads
  useEffect(() => {
    dispatch(listOrderDetails(orderId));
    dispatch(listMovements(orderId));
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
        <>
          <FormContainer>
            <h1>Order #{orderId}</h1>
            <Badge variant="success">Status: {order.state_label}</Badge>
            {error && <Message variant="danger"> {error}</Message>}
            {isUpdating && <Loader />}
            <Form >
              <Form.Group controlId="orderForm.OrderTypeSelect">
                <Form.Label>Order type</Form.Label>
                <Form.Control
                  defaultValue={order.order_type}
                  as="select"
                  onChange={orderTypeChanged}
                  disabled={order.order_state !== 0}
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

              {order.order_state === 0 ? (
                <>
                  <Button className="w-100" onClick={() => setPickingMovie(true)}> Add movie </Button>
                  <div>
                    <Button className="w-50" variant="success" onClick={handlePublish}> Publish </Button>
                    <Button className="w-50" variant="danger" onClick={handleDelete}> Delete </Button>
                  </div></>
              ) : <Message variant="warning">No actions available, this order is locked</Message>}
              <h2 className="mt-4">Movements</h2>
              {loadingMovements && <Loader></Loader>}
              {errorMessage && <Message variant="danger" >{errorMessage}</Message>}
              {movements.map(movement => (
                <Movement movement={movement} key={movement.id} />
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
