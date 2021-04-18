import React from "react";
import { Card, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";

const Order = ({ order }) => {
  return (
    <Card className="my-3 p-3 rounded">
      <Card.Body>
        <Link to={`/order/${order.id}`}>
          <Card.Title as="div">
            <strong>Order {"#" + order.id}</strong>
          </Card.Title>
        </Link>
        <Badge className="mr-2" variant="info">Type: {order.type_label}</Badge>
        <Badge variant="success">Status: {order.state_label}</Badge>
      </Card.Body>
    </Card>
  );
};

export default Order;
