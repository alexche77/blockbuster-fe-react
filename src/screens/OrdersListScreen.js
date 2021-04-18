import React, { useState, useEffect } from "react";
import { Button, Pagination } from "react-bootstrap";
import { Col, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { listOrders } from "../actions/orderActions";
import { createOrder } from "../services/orderService";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Order from "../components/Order";

const OrdersListScreen = ({ history }) => {
  const distpatch = useDispatch();
  const orderList = useSelector((state) => state.orderList);
  const [addingNew, setAddingNew] = useState(false);
  const { loading, error, ordersResponse } = orderList;
  const addNew = () => {
    setAddingNew(true);
    createOrder()
      .then(({ data }) => {
        if (data.id) {
          history.push(`/order/${data.id}`);
        } else {
          throw new Error("Failed to create");
        }
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => setAddingNew(true));
  };

  // useEffect: This runs as soon as the component loads
  useEffect(() => {
    distpatch(listOrders());
  }, [distpatch]);

  return (
    <>
      <h1>Orders</h1>
      <Button disabled={addingNew} onClick={addNew}>
        {addingNew ? "Loading.." : "Add new"}
      </Button>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger"> {error}</Message>
      ) : (
        <Row>
          {ordersResponse.count && (
            <Pagination>
              <Pagination.First />
              <Pagination.Prev />
              {ordersResponse.results.length == 10 && (
                <>
                  <Pagination.Next />
                  <Pagination.Last />
                </>
              )}
            </Pagination>
          )}
          {ordersResponse.results.map((order) => (
            <Col sm={12} md={4} lg={4} xl={4} key={order.id}>
              <Order order={order}></Order>
            </Col>
          ))}
        </Row>
      )}
    </>
  );
};

export default OrdersListScreen;
