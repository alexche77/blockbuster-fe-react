import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Table from "react-bootstrap/Table";
import { Form } from "react-bootstrap";
import { cleanUpOrdersState, listOrderDetails } from "../actions/orderActions";
import Loader from "../components/Loader";
import Message from "../components/Message";
import FormContainer from "../components/FormContainer";

const OrderScreen = ({ history, match }) => {
  const orderId = match.params.id;

  const dispatch = useDispatch();
  const orderDetails = useSelector((state) => state.orderDetails);
  const { loading, error, order } = orderDetails;
  const [movements, setMovements] = useState(
    order.movements ? order.movements : []
  );
  const [order_type, setOrderType] = useState(
    order.order_type ? order.order_type : "-1"
  );
  const [message, setMessage] = useState(null);
  const [orderHelpMessage, setOrderHelpmessage] = useState(null);
  const submitHandler = (e) => {
    e.preventDefault();
    // dispatch(save(orderId, order_type, movements));
  };

  const getOrderTypeHelpMessage = (orderType) => {
    let helpMessage = null
    switch (orderType) {
      case "5":
        helpMessage= "Purchase order represents a purchase that the store made in orter to add products to stock";    
        break;
      case "6":
        helpMessage= "Adjustment(Add) order is made when an adjustment in the inventory is needed, in this case, movies need to be added.";        
        break;
      case "7":
        helpMessage= "Adjustment(Remove) order is made when an adjustment in the inventory is needed, in this case, movies need to be removed.";        
        break;
      case "4":
        helpMessage= "Defective return order represents a customer returning one or many movies";        
        break;
      default:        
        break;
    }
    return helpMessage;
  };

  const orderTypeChanged = ({ target: { value } }) => {
    setOrderType(value);    
    setOrderHelpmessage(getOrderTypeHelpMessage(value));
  };
  // useEffect: This runs as soon as the component loads
  useEffect(() => {
    if (orderId != "new") {
      dispatch(listOrderDetails(orderId));
    } else {
    }
    return () => {
      dispatch(cleanUpOrdersState());
    };
  }, [dispatch, orderId]);
  const saveOrder = () => {
    if (orderId == "new") {
      // TODO CREATE ORDER
      // GET NEW ID
      // PUSH ROUTER TO NEW ORDERS ID
      let newOrderId = 1;
      history.push(`/order/${newOrderId}`);
    } else {
      // TODO UPDATE ORDER
      // PUSH ROUTER TO ORDERS
      history.push(`/orders`);
    }
  };
  return (
    <>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger"> {error}</Message>
      ) : (
        <FormContainer>
          <h1>Order {orderId === "new" ? "*UNSAVED*" : "#" + orderId}</h1>
          {message && <Message variant="warning"> {message}</Message>}
          {error && <Message variant="danger"> {error}</Message>}
          <Form onSubmit={submitHandler}>
            <Form.Group controlId="orderForm.OrderTypeSelect">
              <Form.Label>Order type</Form.Label>
              <Form.Control as="select" onChange={orderTypeChanged}>
                <option selected disabled>
                  Select order type...
                </option>
                <option value={5}>Purchase</option>
                <option value={4}>Defective return</option>
                <option value={6}>Adjustment (Add)</option>
                <option value={7}>Adjustment (Remove)</option>
              </Form.Control>
              {orderHelpMessage && (
                <Message variant="info"> {orderHelpMessage}</Message>
              )}
            </Form.Group>            
          </Form>
        </FormContainer>
      )}
    </>
  );
};

export default OrderScreen;
